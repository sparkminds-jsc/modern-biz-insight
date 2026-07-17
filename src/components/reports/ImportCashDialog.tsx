import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const parseDMY = (s: any): string | null => {
  if (!s) return null;
  const str = String(s).trim();
  const m = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (!m) return null;
  return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
};

const toNumber = (v: any): number => {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v).replace(/[^\d.-]/g, ''));
  return isNaN(n) ? 0 : n;
};

interface Props {
  open: boolean;
  onClose: () => void;
  onImported?: () => void;
}

export function ImportCashDialog({ open, onClose, onImported }: Props) {
  const [fileName, setFileName] = useState('');
  const [sheetName, setSheetName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [importing, setImporting] = useState(false);

  const reset = () => {
    setFileName('');
    setSheetName('');
    setPassword('');
    setShowPassword(false);
    setConfirming(false);
    setImporting(false);
  };

  const handleClose = () => {
    if (importing) return;
    reset();
    onClose();
    setTimeout(() => { document.body.style.pointerEvents = ''; }, 100);
  };

  const doImport = async () => {
    console.log('[ImportCash] doImport called', { fileName, sheetName });
    setImporting(true);
    try {
      const auth = btoa(`sparkminds:${password}`);
      console.log('[ImportCash] calling webhook...');
      const res = await fetch('https://auto.sparkminds.net/webhook/import_tien_mat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({ file_name: fileName, sheet_name: sheetName }),
      });
      console.log('[ImportCash] webhook status', res.status);
      if (!res.ok) throw new Error(`Webhook lỗi: ${res.status}`);
      const text = await res.text();
      let data: any;
      try { data = JSON.parse(text); } catch { data = []; }
      const list: any[] = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);

      const revenues: any[] = [];
      const expenses: any[] = [];
      for (const item of list) {
        const date = parseDMY(item?.ngay) || new Date().toISOString().slice(0, 10);
        const content = String(item?.noiDung || '').trim();
        const amount = toNumber(item?.soTien);
        const loai = String(item?.loai || '').trim().toLowerCase();
        if (loai.includes('doanh')) {
          revenues.push({
            created_date: date,
            content,
            revenue_type: 'Chưa phân loại',
            amount_vnd: amount,
            amount_usd: 0,
            amount_usdt: 0,
            wallet_type: 'Tiền Mặt',
          });
        } else if (loai.includes('chi')) {
          expenses.push({
            created_date: date,
            content,
            expense_type: 'Chưa phân loại',
            amount_vnd: amount,
            amount_usd: 0,
            amount_usdt: 0,
            wallet_type: 'Tiền Mặt',
          });
        }
      }

      let revOk = 0;
      let expOk = 0;
      let skipped = 0;

      // Dedupe: check existing rows with same date + content + amount
      const revDates = Array.from(new Set(revenues.map((r) => r.created_date)));
      const expDates = Array.from(new Set(expenses.map((r) => r.created_date)));
      const existingRevKeys = new Set<string>();
      const existingExpKeys = new Set<string>();
      if (revDates.length > 0) {
        const { data: existRev } = await supabase
          .from('revenue')
          .select('created_date, content, amount_vnd')
          .in('created_date', revDates);
        (existRev || []).forEach((r: any) => {
          existingRevKeys.add(`${r.created_date}||${(r.content || '').trim()}||${Number(r.amount_vnd) || 0}`);
        });
      }
      if (expDates.length > 0) {
        const { data: existExp } = await supabase
          .from('expenses')
          .select('created_date, content, amount_vnd')
          .in('created_date', expDates);
        (existExp || []).forEach((r: any) => {
          existingExpKeys.add(`${r.created_date}||${(r.content || '').trim()}||${Number(r.amount_vnd) || 0}`);
        });
      }

      const seenRev = new Set<string>();
      const filteredRev = revenues.filter((r) => {
        const key = `${r.created_date}||${r.content.trim()}||${Number(r.amount_vnd) || 0}`;
        if (existingRevKeys.has(key) || seenRev.has(key)) { skipped++; return false; }
        seenRev.add(key);
        return true;
      });
      const seenExp = new Set<string>();
      const filteredExp = expenses.filter((r) => {
        const key = `${r.created_date}||${r.content.trim()}||${Number(r.amount_vnd) || 0}`;
        if (existingExpKeys.has(key) || seenExp.has(key)) { skipped++; return false; }
        seenExp.add(key);
        return true;
      });

      if (filteredRev.length > 0) {
        const { error } = await supabase.from('revenue').insert(filteredRev);
        if (error) throw error;
        revOk = filteredRev.length;
      }
      if (filteredExp.length > 0) {
        const { error } = await supabase.from('expenses').insert(filteredExp);
        if (error) throw error;
        expOk = filteredExp.length;
      }
      toast.success(`Import thành công: ${revOk} doanh thu, ${expOk} chi phí${skipped > 0 ? `, bỏ qua ${skipped} dòng trùng` : ''}`);
      onImported?.();
      reset();
      onClose();
    } catch (e: any) {
      console.error(e);
      toast.error('Import thất bại: ' + (e?.message || 'Lỗi không xác định'));
    } finally {
      setImporting(false);
      setConfirming(false);
      setTimeout(() => { document.body.style.pointerEvents = ''; }, 100);
    }
  };

  const canSubmit = fileName.trim() !== '' && sheetName.trim() !== '' && password !== '';

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => { if (!o && !confirming && !importing) handleClose(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Tiền Mặt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tên file</Label>
              <Input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Nhập tên file" />
            </div>
            <div className="space-y-2">
              <Label>Tên sheet</Label>
              <Input value={sheetName} onChange={(e) => setSheetName(e.target.value)} placeholder="Nhập tên sheet" />
            </div>
            <div className="space-y-2">
              <Label>Mật khẩu</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={importing}>Hủy</Button>
            <Button onClick={() => setConfirming(true)} disabled={!canSubmit || importing}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirming} onOpenChange={(o) => { if (!importing) setConfirming(o); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận import</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn import tiền mặt từ sheet <b>{sheetName}</b>, file <b>{fileName}</b> không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" disabled={importing} onClick={() => setConfirming(false)}>Hủy</Button>
            <Button
              disabled={importing}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void doImport();
              }}
            >
              {importing ? 'Đang import...' : 'Xác nhận'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}