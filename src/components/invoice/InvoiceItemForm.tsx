
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateInvoiceItemData } from '@/types/invoice';

interface InvoiceItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInvoiceItemData) => void;
  item?: CreateInvoiceItemData;
}

export function InvoiceItemForm({ open, onClose, onSubmit, item }: InvoiceItemFormProps) {
  const [formData, setFormData] = useState<CreateInvoiceItemData>({
    description: '',
    unit: '',
    qty: 1,
    unit_price: 0,
    note: ''
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        description: '',
        unit: '',
        qty: 1,
        unit_price: 0,
        note: ''
      });
    }
  }, [item, open]);

  const handleInputChange = (field: keyof CreateInvoiceItemData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      description: '',
      unit: '',
      qty: 1,
      unit_price: 0,
      note: ''
    });
  };

  const amount = formData.qty * formData.unit_price;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Chỉnh sửa mục' : 'Thêm mục mới'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <Input
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Nhập mô tả"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Unit *</label>
            <Input
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              placeholder="Nhập đơn vị"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Qty *</label>
            <Input
              type="number"
              value={formData.qty}
              onChange={(e) => handleInputChange('qty', Number(e.target.value))}
              placeholder="Nhập số lượng"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Unit Price *</label>
            <Input
              type="number"
              value={formData.unit_price}
              onChange={(e) => handleInputChange('unit_price', Number(e.target.value))}
              placeholder="Nhập đơn giá"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <Input
              value={new Intl.NumberFormat('vi-VN').format(amount)}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Note</label>
            <Input
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              placeholder="Nhập ghi chú"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>
              {item ? 'Cập nhật' : 'Thêm'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
