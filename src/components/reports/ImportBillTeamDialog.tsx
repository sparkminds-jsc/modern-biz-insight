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

interface ImportBillTeamDialogProps {
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

// "07_2026" | "7/2026" | "07-2026" -> { month, year }
const parseTime = (value: any): { month: number; year: number } | null => {
  const match = String(value ?? '').match(/(\d{1,2})\s*[_\-\/.]\s*(\d{4})/);
  if (!match) return null;
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10);
  if (!month || month < 1 || month > 12 || !year) return null;
  return { month, year };
};

const collectObjects = (payload: any): any[] => {
  const out: any[] = [];
  const walk = (node: any) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === 'object') {
      out.push(node);
      Object.values(node).forEach((v) => {
        if (Array.isArray(v)) walk(v);
      });
    }
  };
  walk(payload);
  return out;
};

export function ImportBillTeamDialog({ open, onClose, onImported }: ImportBillTeamDialogProps) {
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
      const res = await fetch(WEBHOOK_URL, {
        method: 'GET',
        headers: {
          Authorization: 'Basic ' + btoa(`sparkminds:${password}`),
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Webhook trả về lỗi ${res.status}`);
      }

      const text = await res.text();
      let payload: any = null;
      try {
        payload = JSON.parse(text);
      } catch {
        throw new Error('Không đọc được dữ liệu từ webhook');
      }

      const nodes = collectObjects(payload);
      const billTeam: any[] = [];
      const invoiceArr: any[] = [];
      nodes.forEach((node) => {
        if (Array.isArray(node.billTeam)) billTeam.push(...node.billTeam);
        if (Array.isArray(node.invoiceArr)) invoiceArr.push(...node.invoiceArr);
      });

      if (billTeam.length === 0 && invoiceArr.length === 0) {
        toast.error('Webhook không trả về dữ liệu để import');
        return;
      }

      // ---- Reference data ----
      const [teamReportsRes, projectsRes, employeesRes] = await Promise.all([
        supabase.from('team_reports').select('id, team, month, year'),
        supabase.from('projects').select('id, name'),
        supabase.from('employees').select('employee_code, full_name'),
      ]);

      const teamReportKeys = new Set(
        (teamReportsRes.data || []).map((r: any) => `${r.team}|${r.month}|${r.year}`)
      );
      const projectByName = new Map(
        (projectsRes.data || []).map((p: any) => [String(p.name).trim().toLowerCase(), p])
      );
      const employeeByCode = new Map(
        (employeesRes.data || []).map((e: any) => [String(e.employee_code).trim().toUpperCase(), e])
      );

      // ---- billTeam -> team_report_details ----
      const detailRows: any[] = [];
      let skippedBill = 0;

      for (const item of billTeam) {
        const time = parseTime(item['Time']);
        const team = String(item['Team'] ?? '').trim();
        const projectName = String(item['Project Name'] ?? '').trim();
        const code = String(item['Member Code'] ?? '').trim().toUpperCase();

        const project = projectByName.get(projectName.toLowerCase());
        const employee = employeeByCode.get(code);

        if (!time || !team || !project || !employee || !teamReportKeys.has(`${team}|${time.month}|${time.year}`)) {
          skippedBill++;
          continue;
        }

        const usdt = isYes(item['Is USDT']);
        const packageVnd = usdt ? 0 : toNumber(item['Bill VND']);
        const storageUsdt = usdt ? toNumber(item['USD']) : 0;

        detailRows.push({
          employee_code: employee.employee_code,
          employee_name: employee.full_name,
          team,
          month: time.month,
          year: time.year,
          project_id: project.id,
          billable_hours: 0,
          rate: 0,
          fx_rate: 0,
          percentage: 0,
          package_vnd: packageVnd,
          has_salary: false,
          gross_salary: 0,
          company_payment: 0,
          salary_13: 0,
          storage_usd: 0,
          storage_usdt: storageUsdt,
          earn_vnd: packageVnd * 0.7,
          earn_usdt: storageUsdt * 0.7,
          notes: item['Note'] === null || item['Note'] === undefined || item['Note'] === '' ? null : String(item['Note']),
        });
      }

      if (detailRows.length > 0) {
        const { error } = await supabase.from('team_report_details').insert(detailRows);
        if (error) throw error;
      }

      // ---- invoiceArr -> invoices + invoice_items ----
      let importedInvoices = 0;
      let skippedInvoices = 0;

      for (const item of invoiceArr) {
        const time = parseTime(item['Time']);
        const projectName = String(item['Project Name'] ?? '').trim();
        const project = projectByName.get(projectName.toLowerCase());
        if (!time) {
          skippedInvoices++;
          continue;
        }

        const isVnd = isYes(item['Is VND']);
        const timeLabel = String(item['Time'] ?? '').trim();
        const unitPrice = isVnd ? toNumber(item['Total Bill VND']) : toNumber(item['SUM USD']);
        const createdDate = new Date(time.year, time.month, 0);
        const dueDate = new Date(time.year, time.month, 15);
        const fmt = (d: Date) =>
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

        const { data: invoice, error: invoiceError } = await supabase
          .from('invoices')
          .insert({
            customer_name: String(item['Client Name'] ?? '').trim(),
            invoice_name: `${projectName}_${timeLabel}`,
            payment_unit: isVnd ? 'VND' : 'USD',
            created_date: fmt(createdDate),
            due_date: fmt(dueDate),
            status: 'Mới tạo',
            payment_status: 'Chưa thu',
            total_amount: unitPrice,
            remaining_amount: unitPrice,
            is_crypto: isYes(item['Is USDT']),
            project_id: project ? project.id : null,
          })
          .select()
          .single();

        if (invoiceError) throw invoiceError;

        const { error: itemError } = await supabase.from('invoice_items').insert({
          invoice_id: invoice.id,
          description: String(item['Description'] ?? `${projectName}_${timeLabel}`),
          unit: 'package',
          qty: 1,
          unit_price: unitPrice,
          amount: unitPrice,
          note: item['Note'] === null || item['Note'] === undefined || item['Note'] === '' ? null : String(item['Note']),
        });

        if (itemError) throw itemError;
        importedInvoices++;
      }

      toast.success(
        `Import xong: ${detailRows.length} bill team, ${importedInvoices} invoice.` +
          (skippedBill + skippedInvoices > 0 ? ` Bỏ qua ${skippedBill + skippedInvoices} dòng không hợp lệ.` : '')
      );
      onImported?.();
      reset();
      onClose();
    } catch (error: any) {
      console.error('[ImportBillTeam] error', error);
      toast.error(error?.message || 'Có lỗi xảy ra khi import bill team');
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
              <DialogTitle>Import Bill Team</DialogTitle>
              <DialogDescription>Chọn tháng, năm và nhập mật khẩu để import bill team</DialogDescription>
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
                <Label htmlFor="import-bill-password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="import-bill-password"
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
                Bạn có chắc là Import Bill Team cho tháng {String(Number(month)).padStart(2, '0')} năm {year} không?
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
