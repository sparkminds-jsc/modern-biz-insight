
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface RevenueFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  revenue?: any;
  mode: 'create' | 'edit';
}

export function RevenueForm({ open, onClose, onSubmit, revenue, mode }: RevenueFormProps) {
  const [formData, setFormData] = useState({
    content: '',
    revenue_type: 'Invoice',
    amount_vnd: 0,
    amount_usd: 0,
    amount_usdt: 0,
    wallet_type: 'Ngân Hàng',
    needs_debt_collection: false,
    created_date: format(new Date(), 'yyyy-MM-dd')
  });
  const [createdDate, setCreatedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (revenue && mode === 'edit') {
      const revenueCreatedDate = new Date(revenue.created_date);
      setFormData({
        content: revenue.content,
        revenue_type: revenue.revenue_type,
        amount_vnd: revenue.amount_vnd,
        amount_usd: revenue.amount_usd,
        amount_usdt: revenue.amount_usdt,
        wallet_type: revenue.wallet_type,
        needs_debt_collection: revenue.needs_debt_collection,
        created_date: format(revenueCreatedDate, 'yyyy-MM-dd')
      });
      setCreatedDate(revenueCreatedDate);
    } else if (mode === 'create') {
      const today = new Date();
      setFormData({
        content: '',
        revenue_type: 'Invoice',
        amount_vnd: 0,
        amount_usd: 0,
        amount_usdt: 0,
        wallet_type: 'Ngân Hàng',
        needs_debt_collection: false,
        created_date: format(today, 'yyyy-MM-dd')
      });
      setCreatedDate(today);
    }
  }, [revenue, mode, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreatedDateChange = (date: Date | undefined) => {
    if (date) {
      setCreatedDate(date);
      setFormData(prev => ({ ...prev, created_date: format(date, 'yyyy-MM-dd') }));
    }
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      created_date: format(createdDate, 'yyyy-MM-dd'),
    };
    onSubmit(submitData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Thêm doanh thu' : 'Chỉnh sửa doanh thu'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Ngày tạo doanh thu */}
          <div className="space-y-2">
            <Label>Ngày tạo doanh thu *</Label>
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

          {/* Nội dung doanh thu */}
          <div className="space-y-2">
            <Label>Nội dung doanh thu *</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Nhập nội dung doanh thu..."
              rows={3}
            />
          </div>

          {/* Loại Doanh Thu */}
          <div className="space-y-2">
            <Label>Loại Doanh Thu *</Label>
            <Select value={formData.revenue_type} onValueChange={(value) => handleInputChange('revenue_type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lãi Ngân Hàng">Lãi Ngân Hàng</SelectItem>
                <SelectItem value="Invoice">Invoice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Số tiền */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Số tiền VND</Label>
              <Input
                type="number"
                value={formData.amount_vnd}
                onChange={(e) => handleInputChange('amount_vnd', Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Số tiền USD</Label>
              <Input
                type="number"
                value={formData.amount_usd}
                onChange={(e) => handleInputChange('amount_usd', Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Số tiền USDT</Label>
              <Input
                type="number"
                value={formData.amount_usdt}
                onChange={(e) => handleInputChange('amount_usdt', Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>

          {/* Lưu Ví */}
          <div className="space-y-2">
            <Label>Lưu Ví *</Label>
            <Select value={formData.wallet_type} onValueChange={(value) => handleInputChange('wallet_type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ngân Hàng">Ngân Hàng</SelectItem>
                <SelectItem value="Binance">Binance</SelectItem>
                <SelectItem value="Upwork">Upwork</SelectItem>
                <SelectItem value="Tiền Mặt">Tiền Mặt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cần Đòi Nợ */}
          <div className="space-y-2">
            <Label>Cần Đòi Nợ</Label>
            <Select 
              value={formData.needs_debt_collection ? 'true' : 'false'} 
              onValueChange={(value) => handleInputChange('needs_debt_collection', value === 'true')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Không</SelectItem>
                <SelectItem value="true">Có</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            {mode === 'create' ? 'Thêm' : 'Cập nhật'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
