
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Search, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ExpenseFiltersProps {
  onFilter: (filters: {
    startDate?: Date;
    endDate?: Date;
    expenseType?: string;
    walletType?: string;
  }) => void;
  onAddExpense: () => void;
}

export function ExpenseFilters({ onFilter, onAddExpense }: ExpenseFiltersProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [expenseType, setExpenseType] = useState<string>('all');
  const [walletType, setWalletType] = useState<string>('all');

  const expenseTypes = [
    'Lương', 'Bảo Hiểm', 'Thuế TNCN', 'Chia cổ tức', 'Chi phí Luật', 'Ứng Lương', 
    'Chi phí Tool', 'Mua thiết bị', 'Sửa chữa thiết bị', 'Thuê văn phòng', 'Tuyển dụng', 
    'Chi phí ngân hàng', 'Đồng Phục', 'Quà Tết', 'Team Building', 'Ăn uống', 'Điện', 
    'Giữ xe', 'Quà SN', 'Quà tặng KH', 'Trang trí', 'Nước uống', 'Rút tiền mặt'
  ];

  const walletTypes = ['Ngân Hàng', 'Binance', 'Upwork', 'Tiền Mặt'];

  const handleSearch = () => {
    onFilter({
      startDate,
      endDate,
      expenseType: expenseType === 'all' ? undefined : expenseType,
      walletType: walletType === 'all' ? undefined : walletType
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
        {/* Ngày bắt đầu */}
        <div className="space-y-2">
          <Label>Ngày bắt đầu</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'dd/MM/yyyy', { locale: vi }) : "Chọn ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Ngày đến */}
        <div className="space-y-2">
          <Label>Ngày đến</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'dd/MM/yyyy', { locale: vi }) : "Chọn ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Loại Chi Phí */}
        <div className="space-y-2">
          <Label>Loại Chi Phí</Label>
          <Select value={expenseType} onValueChange={setExpenseType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {expenseTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Từ Ví */}
        <div className="space-y-2">
          <Label>Từ Ví</Label>
          <Select value={walletType} onValueChange={setWalletType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {walletTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>

        {/* Add Expense Button */}
        <Button onClick={onAddExpense} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Thêm chi phí
        </Button>
      </div>
    </div>
  );
}
