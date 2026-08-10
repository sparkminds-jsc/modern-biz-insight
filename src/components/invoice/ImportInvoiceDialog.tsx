import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ImportInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  onImported?: () => void;
}

const WEBHOOK_URL = 'https://auto.sparkminds.net/webhook/import_bill_team';

const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
const yearOptions = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031];

const toNumber = (value: any): number => {
  if (typeof value === 'number') return isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;
  const cleaned = value.replace(/[^\d.,-]/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(/,/g, '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

const isYes = (value: any) => String(value ?? '').trim().toUpperCase() === 'YES';

const collectInvoiceRows = (payload: any): any[] => {
  const out: any[] = [];
  const walk = (node: any) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === 'object') {
      if (Array.isArray((node as any).invoiceArr)) {
        (node as any).invoiceArr.forEach((r: any) => {
          if (r && typeof r === 'object') out.push(r);
        });
      }
      Object.values(node).forEach((v) => {
        if (Array.isArray(v) || (v && typeof v === 'object')) walk(v);
      });
    }
  };
  walk(payload);
  return out;
};

export function ImportInvoiceDialog({ open, onClose, onImported }: ImportInvoiceDialogProps) {
  const [step, setStep] = useState<'input' | 'confirm'>('input');
  const [month, setMonth] = useState<string>(String(new Date().getMonth() + 1));
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setStep('input');
    setPassword('');
    setShowPassword(false);
    setLoading(false);
  };

  const handleClose = () => {
    if (loading) return;
    reset();
    onClose();
  };

  const doImport = async () => {
    setLoading(true);
    try {
      const mm = String(Number(month)).padStart(2, '0');
      const url = `${WEBHOOK_URL}?month=${encodeURIComponent(mm)}&year=${encodeURIComponent(year)}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(`sparkminds:${password}`)}`,
        },
      });

      if (!res.ok) {
        toast.error(`Webhook lỗi (${res.status})`);
        return;
      }

      const text = await res.text();
      let payload: any = null;
      try {
        payload = JSON.parse(text);
      } catch {
        toast.error('Response webhook không phải JSON hợp lệ');
        return;
      }

      const rows = collectInvoiceRows(payload);
      if (rows.length === 0) {
        toast.error('Không có dữ liệu invoice trong response');
        return;
      }

      const { data: projectRows, error: projectErr } = await supabase
        .from('projects')
        .select('id, name');
      if (projectErr) throw projectErr;
      const projectMap = new Map<string, string>();
      (projectRows || []).forEach((p) => projectMap.set(String(p.name).trim().toLowerCase(), p.id));

      // Group by Client Name + Invoice
      const groups = new Map<string, { client: string; invoice: string; rows: any[] }>();
      rows.forEach((r) => {
        const client = String(r['Client Name'] ?? '').trim();
        const invoiceName = String(r['Invoice'] ?? '').trim();
        if (!client || !invoiceName) return;
        const key = `${client.toLowerCase()}||${invoiceName.toLowerCase()}`;
        if (!groups.has(key)) groups.set(key, { client, invoice: invoiceName, rows: [] });
        groups.get(key)!.rows.push(r);
      });

      if (groups.size === 0) {
        toast.error('Không có dòng invoice hợp lệ (thiếu Client Name / Invoice)');
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      let created = 0;
      let skipped = 0;

      for (const group of groups.values()) {
        const first = group.rows[0];
        const isVnd = isYes(first['Is VND']);
        const isCrypto = isYes(first['Is USDT']);
        const time = String(first['Time'] ?? '').trim();
        const invoiceTitle = time ? `${group.invoice} ${time}` : group.invoice;

        const items = group.rows.map((r) => {
          const projectName = String(r['Project Name'] ?? '').trim();
          const unitPrice = isYes(r['Is VND'])
            ? toNumber(r['Total Bill VND'])
            : toNumber(r['SUM USD']);
          return {
            description: String(r['Description'] ?? projectName || invoiceTitle),
            unit: 'pack',
            qty: 1,
            unit_price: unitPrice,
            amount: unitPrice,
            note: r['Note'] === '' || r['Note'] === null || r['Note'] === undefined ? null : String(r['Note']),
            project_id: projectMap.get(projectName.toLowerCase()) || null,
          };
        });

        const totalAmount = items.reduce((sum, i) => sum + i.amount, 0);

        const { data: invoice, error: invoiceErr } = await supabase
          .from('invoices')
          .insert({
            customer_name: group.client,
            invoice_name: invoiceTitle,
            payment_unit: isVnd ? 'VND' : 'USD',
            created_date: today,
            due_date: today,
            status: 'Mới tạo',
            total_amount: totalAmount,
            payment_status: 'Chưa thu',
            remaining_amount: totalAmount,
            is_crypto: isCrypto,
          })
          .select()
          .single();

        if (invoiceErr || !invoice) {
          console.error('[ImportInvoice] insert invoice error', invoiceErr);
          skipped += 1;
          continue;
        }

        const { error: itemsErr } = await supabase
          .from('invoice_items')
          .insert(items.map((i) => ({ ...i, invoice_id: invoice.id })));
        if (itemsErr) {
          console.error('[ImportInvoice] insert items error', itemsErr);
        }
        created += 1;
      }

      toast.success(`Đã import ${created} invoice${skipped ? `, bỏ qua ${skipped}` : ''}`);
      onImported?.();
      reset();
      onClose();
    } catch (err) {
      console.error('[ImportInvoice] error', err);
      toast.error('Có lỗi khi import invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent>
        {step === 'input' ? (
          <>
            <DialogHeader>
              <DialogTitle>Import Invoice</DialogTitle>
              <DialogDescription>Chọn tháng, năm và nhập mật khẩu để import invoice</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tháng</Label>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map((m) => (
                        <SelectItem key={m} value={String(m)}>{String(m).padStart(2, '0')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Năm</Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="import-invoice-password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="import-invoice-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Hủy</Button>
              <Button
                onClick={() => {
                  if (!password.trim()) {
                    toast.error('Vui lòng nhập mật khẩu');
                    return;
                  }
                  setStep('confirm');
                }}
              >
                Tiếp tục
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Xác nhận import</DialogTitle>
              <DialogDescription>
                Bạn có chắc là Import Invoice cho tháng {String(Number(month)).padStart(2, '0')} năm {year} không?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('input')} disabled={loading}>Hủy</Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  doImport();
                }}
                disabled={loading}
              >
                {loading ? 'Đang import...' : 'Xác nhận'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}