import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImportRow {
  created_date: string; // yyyy-mm-dd
  content: string;
  amount_vnd: number;
  transaction_number: string;
  notes: string;
  kind: 'revenue' | 'expense';
}

interface Props {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
}

const parseDMY = (s: any): string | null => {
  if (!s) return null;
  if (s instanceof Date) {
    const y = s.getFullYear();
    const m = String(s.getMonth() + 1).padStart(2, '0');
    const d = String(s.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
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

export function ImportTransactionsDialog({ open, onClose, onImported }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ImportRow[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [importing, setImporting] = useState(false);

  const reset = () => {
    setFile(null);
    setParsed([]);
    setConfirming(false);
    setImporting(false);
  };

  const handleClose = () => {
    if (importing) return;
    reset();
    onClose();
  };

  const handleFile = async (f: File) => {
    setFile(f);
    try {
      const buf = await f.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array', cellDates: true });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: true });
      const out: ImportRow[] = [];
      // Data starts at Excel row 9 (index 8)
      for (let i = 8; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;
        const effectiveDate = parseDMY(row[0]);
        const txDate = row[1] ? String(row[1]) : '';
        const txNumber = row[2] ? String(row[2]).trim() : '';
        const content = row[3] ? String(row[3]).trim() : '';
        const withdraw = toNumber(row[4]);
        const deposit = toNumber(row[5]);
        if (!effectiveDate || !txNumber) continue;
        if (withdraw > 0) {
          out.push({
            created_date: effectiveDate,
            content,
            amount_vnd: withdraw,
            transaction_number: txNumber,
            notes: txDate,
            kind: 'expense',
          });
        } else if (deposit > 0) {
          out.push({
            created_date: effectiveDate,
            content,
            amount_vnd: deposit,
            transaction_number: txNumber,
            notes: txDate,
            kind: 'revenue',
          });
        }
      }
      setParsed(out);
    } catch (e) {
      console.error(e);
      toast.error('Không đọc được file. Vui lòng kiểm tra định dạng.');
    }
  };

  const doImport = async () => {
    setImporting(true);
    try {
      const txNumbers = parsed.map((r) => r.transaction_number);
      const [existingRev, existingExp] = await Promise.all([
        supabase.from('revenue').select('transaction_number').in('transaction_number', txNumbers),
        supabase.from('expenses').select('transaction_number').in('transaction_number', txNumbers),
      ]);
      const existing = new Set<string>([
        ...(existingRev.data || []).map((r: any) => r.transaction_number).filter(Boolean),
        ...(existingExp.data || []).map((r: any) => r.transaction_number).filter(Boolean),
      ]);

      const revenues = parsed
        .filter((r) => r.kind === 'revenue' && !existing.has(r.transaction_number))
        .map((r) => ({
          created_date: r.created_date,
          content: r.content,
          revenue_type: 'Chưa phân loại',
          amount_vnd: r.amount_vnd,
          amount_usd: 0,
          amount_usdt: 0,
          wallet_type: 'Ngân Hàng',
          transaction_number: r.transaction_number,
        }));
      const expenses = parsed
        .filter((r) => r.kind === 'expense' && !existing.has(r.transaction_number))
        .map((r) => ({
          created_date: r.created_date,
          content: r.content,
          expense_type: 'Chưa phân loại',
          amount_vnd: r.amount_vnd,
          amount_usd: 0,
          amount_usdt: 0,
          wallet_type: 'Ngân Hàng',
          transaction_number: r.transaction_number,
          notes: r.notes,
        }));

      let revOk = 0;
      let expOk = 0;
      if (revenues.length > 0) {
        const { error } = await supabase.from('revenue').insert(revenues);
        if (error) throw error;
        revOk = revenues.length;
      }
      if (expenses.length > 0) {
        const { error } = await supabase.from('expenses').insert(expenses);
        if (error) throw error;
        expOk = expenses.length;
      }
      const skipped = parsed.length - revOk - expOk;
      toast.success(`Import thành công: ${revOk} doanh thu, ${expOk} chi phí${skipped > 0 ? `, bỏ qua ${skipped} bản ghi trùng` : ''}`);
      onImported();
      reset();
      onClose();
    } catch (e: any) {
      console.error(e);
      toast.error('Import thất bại: ' + (e?.message || 'Lỗi không xác định'));
    } finally {
      setImporting(false);
      setConfirming(false);
      // Reset any lingering pointer-events lock from Radix dialogs
      setTimeout(() => {
        document.body.style.pointerEvents = '';
      }, 100);
    }
  };

  const revCount = parsed.filter((r) => r.kind === 'revenue').length;
  const expCount = parsed.filter((r) => r.kind === 'expense').length;

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Thu Chi từ file Excel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Chọn file Excel (.xlsx)</Label>
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
            {file && (
              <div className="text-sm text-gray-700 bg-gray-50 rounded p-3 space-y-1">
                <div>File: <span className="font-medium">{file.name}</span></div>
                <div>Số dòng đọc được: <span className="font-medium">{parsed.length}</span></div>
                <div>Doanh thu: <span className="font-medium text-green-600">{revCount}</span></div>
                <div>Chi phí: <span className="font-medium text-red-600">{expCount}</span></div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={importing}>
              Hủy
            </Button>
            <Button
              onClick={() => setConfirming(true)}
              disabled={parsed.length === 0 || importing}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận import</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn import <b>{revCount}</b> doanh thu và <b>{expCount}</b> chi phí?
              Các bản ghi có Số giao dịch đã tồn tại sẽ được bỏ qua.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={importing}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={doImport} disabled={importing}>
              {importing ? 'Đang import...' : 'Xác nhận'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}