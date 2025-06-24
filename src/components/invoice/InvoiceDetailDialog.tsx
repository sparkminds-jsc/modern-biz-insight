
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Invoice, InvoiceItem } from '@/types/invoice';

interface InvoiceDetailDialogProps {
  open: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  invoiceItems: InvoiceItem[];
}

export function InvoiceDetailDialog({ open, onClose, invoice, invoiceItems }: InvoiceDetailDialogProps) {
  if (!invoice) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ' + currency;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết Invoice: {invoice.invoice_name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
              <div>
                <p className="text-sm text-gray-600">Tên khách hàng</p>
                <p className="font-medium">{invoice.customer_name}</p>
              </div>
              {invoice.customer_address && (
                <div>
                  <p className="text-sm text-gray-600">Địa chỉ</p>
                  <p className="font-medium">{invoice.customer_address}</p>
                </div>
              )}
              {invoice.additional_info && (
                <div>
                  <p className="text-sm text-gray-600">Thông tin bổ sung</p>
                  <p className="font-medium">{invoice.additional_info}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin invoice</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Ngày tạo</p>
                  <p className="font-medium">{formatDate(invoice.created_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày đến hạn</p>
                  <p className="font-medium">{formatDate(invoice.due_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    invoice.status === 'Mới tạo' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Thu tiền</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    invoice.payment_status === 'Chưa thu' 
                      ? 'bg-red-100 text-red-800' 
                      : invoice.payment_status === 'Đã thu đủ'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invoice.payment_status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đơn vị thanh toán</p>
                  <p className="font-medium">{invoice.payment_unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Là Crypto</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    invoice.is_crypto 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {invoice.is_crypto ? 'Đúng' : 'Không'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Nội dung Invoice</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{formatAmount(item.unit_price, invoice.payment_unit)}</TableCell>
                    <TableCell>{formatAmount(item.amount, invoice.payment_unit)}</TableCell>
                    <TableCell>{item.note || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Tổng tiền</p>
                <p className="text-xl font-bold">{formatAmount(invoice.total_amount, invoice.payment_unit)}</p>
              </div>
              {invoice.vnd_exchange_rate && (
                <div>
                  <p className="text-sm text-gray-600">Quy đổi VND</p>
                  <p className="text-lg font-medium">{new Intl.NumberFormat('vi-VN').format(invoice.vnd_exchange_rate)}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Còn thiếu</p>
                <p className="text-lg font-medium text-red-600">{formatAmount(invoice.remaining_amount, invoice.payment_unit)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
