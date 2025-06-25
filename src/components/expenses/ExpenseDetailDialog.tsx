
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ExpenseDetailDialogProps {
  open: boolean;
  onClose: () => void;
  expense: any;
}

export function ExpenseDetailDialog({ open, onClose, expense }: ExpenseDetailDialogProps) {
  if (!expense) return null;

  const formatCurrency = (amount: number, currency: string) => {
    const rounded = Math.round(amount);
    if (currency === 'USDT') {
      return `${rounded.toLocaleString('vi-VN')} USDT`;
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rounded);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết chi phí</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Ngày tạo chi phí</label>
              <p className="text-lg font-semibold">
                {format(new Date(expense.created_date), 'dd/MM/yyyy', { locale: vi })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Loại Chi Phí</label>
              <div className="mt-1">
                <Badge variant="secondary">
                  {expense.expense_type}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Nội dung chi phí</label>
            <p className="text-lg mt-1 p-3 bg-gray-50 rounded-lg">{expense.content}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Số tiền VND</label>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(expense.amount_vnd, 'VND')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Số tiền USD</label>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(expense.amount_usd, 'USD')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Số tiền USDT</label>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(expense.amount_usdt, 'USDT')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Từ Ví</label>
              <div className="mt-1">
                <Badge variant="outline">{expense.wallet_type}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Hóa đơn</label>
              <p className="text-lg">
                {expense.invoice_files && expense.invoice_files.length > 0 
                  ? `${expense.invoice_files.length} file(s)` 
                  : 'Không có'}
              </p>
            </div>
          </div>

          {expense.notes && (
            <div>
              <label className="text-sm font-medium text-gray-500">Chú thích</label>
              <p className="text-lg mt-1 p-3 bg-gray-50 rounded-lg">{expense.notes}</p>
            </div>
          )}

          {expense.is_finalized && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">✅ Chi phí đã được chốt</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <label>Ngày tạo</label>
              <p>{format(new Date(expense.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
            </div>
            <div>
              <label>Ngày cập nhật</label>
              <p>{format(new Date(expense.updated_at), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
