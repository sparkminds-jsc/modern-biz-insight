
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  expense?: any;
  onSuccess: () => void;
}

export function ExpenseForm({ open, onClose, expense, onSuccess }: ExpenseFormProps) {
  const [loading, setLoading] = useState(false);
  const [createdDate, setCreatedDate] = useState<Date>(new Date());
  const [content, setContent] = useState('');
  const [expenseType, setExpenseType] = useState('');
  const [amountVnd, setAmountVnd] = useState('');
  const [amountUsd, setAmountUsd] = useState('');
  const [amountUsdt, setAmountUsdt] = useState('');
  const [walletType, setWalletType] = useState('');
  const [notes, setNotes] = useState('');

  const expenseTypes = [
    'Lương', 'Bảo Hiểm', 'Thuế TNCN', 'Chia cổ tức', 'Chi phí Luật', 'Ứng Lương', 
    'Chi phí Tool', 'Mua thiết bị', 'Sửa chữa thiết bị', 'Thuê văn phòng', 'Tuyển dụng', 
    'Chi phí ngân hàng', 'Đồng Phục', 'Quà Tết', 'Team Building', 'Ăn uống', 'Điện', 
    'Giữ xe', 'Quà SN', 'Quà tặng KH', 'Trang trí', 'Nước uống', 'Rút tiền mặt'
  ];

  const walletTypes = ['Ngân Hàng', 'Binance', 'Upwork', 'Tiền Mặt'];

  useEffect(() => {
    if (expense) {
      setCreatedDate(new Date(expense.created_date));
      setContent(expense.content);
      setExpenseType(expense.expense_type);
      setAmountVnd(expense.amount_vnd.toString());
      setAmountUsd(expense.amount_usd.toString());
      setAmountUsdt(expense.amount_usdt.toString());
      setWalletType(expense.wallet_type);
      setNotes(expense.notes || '');
    } else {
      // Reset form for new expense
      setCreatedDate(new Date());
      setContent('');
      setExpenseType('');
      setAmountVnd('');
      setAmountUsd('');
      setAmountUsdt('');
      setWalletType('');
      setNotes('');
    }
  }, [expense, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const expenseData = {
        created_date: format(createdDate, 'yyyy-MM-dd'),
        content,
        expense_type: expenseType,
        amount_vnd: parseFloat(amountVnd) || 0,
        amount_usd: parseFloat(amountUsd) || 0,
        amount_usdt: parseFloat(amountUsdt) || 0,
        wallet_type: walletType,
        notes: notes || null,
      };

      let error;
      if (expense) {
        // Update existing expense
        const { error: updateError } = await supabase
          .from('expenses')
          .update(expenseData)
          .eq('id', expense.id);
        error = updateError;
      } else {
        // Create new expense
        const { error: insertError } = await supabase
          .from('expenses')
          .insert([expenseData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(expense ? 'Cập nhật chi phí thành công!' : 'Thêm chi phí thành công!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Có lỗi xảy ra khi lưu chi phí');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{expense ? 'Chỉnh sửa chi phí' : 'Thêm chi phí mới'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ngày tạo chi phí *</Label>
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
                    {createdDate ? format(createdDate, 'dd/MM/yyyy', { locale: vi }) : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={createdDate}
                    onSelect={(date) => date && setCreatedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Loại Chi Phí *</Label>
              <Select value={expenseType} onValueChange={setExpenseType}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại chi phí" />
                </SelectTrigger>
                <SelectContent>
                  {expenseTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nội dung chi phí *</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung chi phí"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Số tiền VND</Label>
              <Input
                type="number"
                value={amountVnd}
                onChange={(e) => setAmountVnd(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>Số tiền USD</Label>
              <Input
                type="number"
                value={amountUsd}
                onChange={(e) => setAmountUsd(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>Số tiền USDT</Label>
              <Input
                type="number"
                value={amountUsdt}
                onChange={(e) => setAmountUsdt(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Từ Ví *</Label>
            <Select value={walletType} onValueChange={setWalletType}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn ví" />
              </SelectTrigger>
              <SelectContent>
                {walletTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Chú thích</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập chú thích (tùy chọn)"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : (expense ? 'Cập nhật' : 'Thêm chi phí')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
