
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Invoice, InvoiceItem, CreateInvoiceData, CreateInvoiceItemData } from '@/types/invoice';
import { InvoiceItemForm } from './InvoiceItemForm';

interface InvoiceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInvoiceData, items: CreateInvoiceItemData[]) => void;
  invoice?: Invoice;
  invoiceItems?: InvoiceItem[];
  mode: 'create' | 'edit';
}

export function InvoiceForm({ open, onClose, onSubmit, invoice, invoiceItems = [], mode }: InvoiceFormProps) {
  const [formData, setFormData] = useState<CreateInvoiceData>({
    customer_name: '',
    customer_address: '',
    additional_info: '',
    invoice_name: '',
    payment_unit: 'VND',
    created_date: format(new Date(), 'yyyy-MM-dd'),
    due_date: format(new Date(), 'yyyy-MM-dd'),
    status: 'Mới tạo',
    vnd_exchange_rate: undefined,
    payment_status: 'Chưa thu',
    remaining_amount: 0,
    is_crypto: false
  });

  const [items, setItems] = useState<CreateInvoiceItemData[]>([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [createdDate, setCreatedDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();

  useEffect(() => {
    if (invoice && mode === 'edit') {
      setFormData({
        customer_name: invoice.customer_name,
        customer_address: invoice.customer_address || '',
        additional_info: invoice.additional_info || '',
        invoice_name: invoice.invoice_name,
        payment_unit: invoice.payment_unit,
        created_date: invoice.created_date,
        due_date: invoice.due_date,
        status: invoice.status,
        vnd_exchange_rate: invoice.vnd_exchange_rate || undefined,
        payment_status: invoice.payment_status,
        remaining_amount: invoice.remaining_amount,
        is_crypto: invoice.is_crypto
      });
      setCreatedDate(new Date(invoice.created_date));
      setDueDate(new Date(invoice.due_date));
      
      setItems(invoiceItems.map(item => ({
        description: item.description,
        unit: item.unit,
        qty: item.qty,
        unit_price: item.unit_price,
        note: item.note || ''
      })));
    }
  }, [invoice, invoiceItems, mode]);

  const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0);

  const handleInputChange = (field: keyof CreateInvoiceData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = (itemData: CreateInvoiceItemData) => {
    if (editingItem !== null) {
      const updatedItems = [...items];
      updatedItems[editingItem] = itemData;
      setItems(updatedItems);
      setEditingItem(null);
    } else {
      setItems([...items, itemData]);
    }
    setShowItemForm(false);
  };

  const handleEditItem = (index: number) => {
    setEditingItem(index);
    setShowItemForm(true);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      created_date: createdDate ? format(createdDate, 'yyyy-MM-dd') : formData.created_date,
      due_date: dueDate ? format(dueDate, 'yyyy-MM-dd') : formData.due_date,
    };
    onSubmit(submitData, items);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Thêm Invoice mới' : 'Chỉnh sửa Invoice'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên khách hàng *</label>
                <Input
                  value={formData.customer_name}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                  placeholder="Nhập tên khách hàng"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tên Invoice *</label>
                <Input
                  value={formData.invoice_name}
                  onChange={(e) => handleInputChange('invoice_name', e.target.value)}
                  placeholder="Nhập tên invoice"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Địa chỉ khách hàng</label>
              <Textarea
                value={formData.customer_address}
                onChange={(e) => handleInputChange('customer_address', e.target.value)}
                placeholder="Nhập địa chỉ khách hàng"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Thông tin bổ sung</label>
              <Textarea
                value={formData.additional_info}
                onChange={(e) => handleInputChange('additional_info', e.target.value)}
                placeholder="Nhập thông tin bổ sung"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Đơn vị thanh toán</label>
                <Select value={formData.payment_unit} onValueChange={(value: 'USD' | 'VND') => handleInputChange('payment_unit', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="VND">VND</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ngày tạo</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !createdDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {createdDate ? format(createdDate, 'PPP', { locale: vi }) : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={createdDate}
                      onSelect={setCreatedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ngày đến hạn</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, 'PPP', { locale: vi }) : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                <Select value={formData.status} onValueChange={(value: 'Mới tạo' | 'Đã xuất hóa đơn') => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mới tạo">Mới tạo</SelectItem>
                    <SelectItem value="Đã xuất hóa đơn">Đã xuất hóa đơn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Quy đổi VND</label>
                <Input
                  type="number"
                  value={formData.vnd_exchange_rate || ''}
                  onChange={(e) => handleInputChange('vnd_exchange_rate', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Nhập tỷ giá quy đổi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Thu tiền</label>
                <Select value={formData.payment_status} onValueChange={(value: 'Chưa thu' | 'Đã thu đủ' | 'Thu một phần') => handleInputChange('payment_status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chưa thu">Chưa thu</SelectItem>
                    <SelectItem value="Đã thu đủ">Đã thu đủ</SelectItem>
                    <SelectItem value="Thu một phần">Thu một phần</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Còn thiếu</label>
                <Input
                  type="number"
                  value={formData.remaining_amount}
                  onChange={(e) => handleInputChange('remaining_amount', Number(e.target.value))}
                  placeholder="Số tiền còn thiếu"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_crypto}
                  onChange={(e) => handleInputChange('is_crypto', e.target.checked)}
                />
                <span className="text-sm font-medium">Là Crypto</span>
              </label>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Nội dung Invoice</h3>
                <Button onClick={() => setShowItemForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{new Intl.NumberFormat('vi-VN').format(item.unit_price)}</TableCell>
                      <TableCell>{new Intl.NumberFormat('vi-VN').format(item.qty * item.unit_price)}</TableCell>
                      <TableCell>{item.note}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditItem(index)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteItem(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 text-right">
                <p className="text-lg font-bold">
                  Tổng tiền: {new Intl.NumberFormat('vi-VN').format(totalAmount)} {formData.payment_unit}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button onClick={handleSubmit}>
                {mode === 'create' ? 'Tạo Invoice' : 'Cập nhật Invoice'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <InvoiceItemForm
        open={showItemForm}
        onClose={() => {
          setShowItemForm(false);
          setEditingItem(null);
        }}
        onSubmit={handleAddItem}
        item={editingItem !== null ? items[editingItem] : undefined}
      />
    </>
  );
}
