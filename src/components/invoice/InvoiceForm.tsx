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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';
import { Customer } from '@/types/customer';

interface InvoiceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInvoiceData, items: CreateInvoiceItemData[]) => void;
  invoice?: Invoice;
  invoiceItems?: InvoiceItem[];
  mode: 'create' | 'edit';
}

export function InvoiceForm({ open, onClose, onSubmit, invoice, invoiceItems = [], mode }: InvoiceFormProps) {
  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Project[];
    }
  });

  // Fetch customers
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Customer[];
    }
  });

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
    is_crypto: false,
    project_id: undefined
  });

  const [items, setItems] = useState<CreateInvoiceItemData[]>([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [createdDate, setCreatedDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date());

  useEffect(() => {
    if (invoice && mode === 'edit') {
      const invoiceCreatedDate = new Date(invoice.created_date);
      const invoiceDueDate = new Date(invoice.due_date);
      
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
        is_crypto: invoice.is_crypto,
        project_id: invoice.project_id || undefined
      });
      setCreatedDate(invoiceCreatedDate);
      setDueDate(invoiceDueDate);
      
      setItems(invoiceItems.map(item => ({
        description: item.description,
        unit: item.unit,
        qty: item.qty,
        unit_price: item.unit_price,
        note: item.note || ''
      })));
    } else if (mode === 'create') {
      // Reset to default values for create mode
      const today = new Date();
      setCreatedDate(today);
      setDueDate(today);
      setFormData({
        customer_name: '',
        customer_address: '',
        additional_info: '',
        invoice_name: '',
        payment_unit: 'VND',
        created_date: format(today, 'yyyy-MM-dd'),
        due_date: format(today, 'yyyy-MM-dd'),
        status: 'Mới tạo',
        vnd_exchange_rate: undefined,
        payment_status: 'Chưa thu',
        remaining_amount: 0,
        is_crypto: false,
        project_id: undefined
      });
      setItems([]);
    }
  }, [invoice, invoiceItems, mode, open]);

  const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0);

  const handleInputChange = (field: keyof CreateInvoiceData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreatedDateChange = (date: Date | undefined) => {
    if (date) {
      setCreatedDate(date);
      setFormData(prev => ({ ...prev, created_date: format(date, 'yyyy-MM-dd') }));
    }
  };

  const handleDueDateChange = (date: Date | undefined) => {
    if (date) {
      setDueDate(date);
      setFormData(prev => ({ ...prev, due_date: format(date, 'yyyy-MM-dd') }));
    }
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
      created_date: format(createdDate, 'yyyy-MM-dd'),
      due_date: format(dueDate, 'yyyy-MM-dd'),
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên khách hàng *</label>
                <Select 
                  value={formData.customer_name} 
                  onValueChange={(value) => handleInputChange('customer_name', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.name}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tên Invoice *</label>
                <Input
                  value={formData.invoice_name}
                  onChange={(e) => handleInputChange('invoice_name', e.target.value)}
                  placeholder="Nhập tên invoice"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dự án</label>
                <Select value={formData.project_id || 'none'} onValueChange={(value) => handleInputChange('project_id', value === 'none' ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn dự án" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không chọn dự án</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={createdDate}
                      onSelect={handleCreatedDateChange}
                      initialFocus
                      className="pointer-events-auto"
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={handleDueDateChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                <Select value={formData.status} onValueChange={(value: 'Mới tạo' | 'Đã xuất hóa đơn' | 'Không xuất hóa đơn') => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mới tạo">Mới tạo</SelectItem>
                    <SelectItem value="Đã xuất hóa đơn">Đã xuất hóa đơn</SelectItem>
                    <SelectItem value="Không xuất hóa đơn">Không xuất hóa đơn</SelectItem>
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
                  placeholder="Nhập giá trị quy đổi"
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
