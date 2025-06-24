
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface RevenueDetailDialogProps {
  open: boolean;
  onClose: () => void;
  revenue: any;
}

export function RevenueDetailDialog({ open, onClose, revenue }: RevenueDetailDialogProps) {
  if (!revenue) return null;

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
          <DialogTitle>Chi tiết doanh thu</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Ngày tạo doanh thu</label>
              <p className="text-lg font-semibold">
                {format(new Date(revenue.created_date), 'dd/MM/yyyy', { locale: vi })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Loại Doanh Thu</label>
              <div className="mt-1">
                <Badge variant={revenue.revenue_type === 'Invoice' ? 'default' : 'secondary'}>
                  {revenue.revenue_type}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Nội dung doanh thu</label>
            <p className="text-lg mt-1 p-3 bg-gray-50 rounded-lg">{revenue.content}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Số tiền VND</label>
              <p className="text-lg font-semibold text-blue-600">
                {formatCurrency(revenue.amount_vnd, 'VND')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Số tiền USD</label>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(revenue.amount_usd, 'USD')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Số tiền USDT</label>
              <p className="text-lg font-semibold text-yellow-600">
                {formatCurrency(revenue.amount_usdt, 'USDT')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Lưu Ví</label>
              <div className="mt-1">
                <Badge variant="outline">{revenue.wallet_type}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Cần Đòi Nợ</label>
              <div className="mt-1">
                <Badge variant={revenue.needs_debt_collection ? 'destructive' : 'secondary'}>
                  {revenue.needs_debt_collection ? 'Có' : 'Không'}
                </Badge>
              </div>
            </div>
          </div>

          {revenue.is_finalized && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">✅ Doanh thu đã được chốt</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <label>Ngày tạo</label>
              <p>{format(new Date(revenue.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
            </div>
            <div>
              <label>Ngày cập nhật</label>
              <p>{format(new Date(revenue.updated_at), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
