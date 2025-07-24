
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Search, Plus, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { AddExpenseTypeDialog } from './AddExpenseTypeDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExpenseFiltersProps {
  onFilter: (filters: {
    startDate?: Date;
    endDate?: Date;
    expenseTypes?: string[];
    walletType?: string;
    content?: string;
  }) => void;
  onAddExpense: () => void;
}

export function ExpenseFilters({ onFilter, onAddExpense }: ExpenseFiltersProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedExpenseTypes, setSelectedExpenseTypes] = useState<string[]>([]);
  const [walletType, setWalletType] = useState<string>('all');
  const [content, setContent] = useState<string>('');
  const [showExpenseTypes, setShowExpenseTypes] = useState(false);
  const [expenseTypes, setExpenseTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchExpenseTypes();
  }, []);

  const fetchExpenseTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('expense_types')
        .select('name')
        .order('name');

      if (error) throw error;
      setExpenseTypes(data?.map(item => item.name) || []);
    } catch (error) {
      console.error('Error fetching expense types:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách loại chi phí');
    }
  };

  const walletTypes = ['Ngân Hàng', 'Binance', 'Upwork', 'Tiền Mặt'];

  const handleExpenseTypeToggle = (type: string) => {
    setSelectedExpenseTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSearch = () => {
    onFilter({
      startDate,
      endDate,
      expenseTypes: selectedExpenseTypes.length > 0 ? selectedExpenseTypes : undefined,
      walletType: walletType === 'all' ? undefined : walletType,
      content: content.trim() || undefined
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 items-end">
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

        {/* Nội dung chi phí */}
        <div className="space-y-2">
          <Label>Nội dung chi phí</Label>
          <Input
            placeholder="Tìm kiếm nội dung..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Loại Chi Phí */}
        <div className="space-y-2">
          <Label>Loại Chi Phí</Label>
          <Popover open={showExpenseTypes} onOpenChange={setShowExpenseTypes}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-left font-normal"
              >
                {selectedExpenseTypes.length === 0 
                  ? "Chọn loại chi phí"
                  : `${selectedExpenseTypes.length} loại được chọn`
                }
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {expenseTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={selectedExpenseTypes.includes(type)}
                      onCheckedChange={() => handleExpenseTypeToggle(type)}
                    />
                    <Label htmlFor={type} className="text-sm font-normal cursor-pointer flex-1">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedExpenseTypes.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedExpenseTypes([])}
                    className="w-full"
                  >
                    Xóa tất cả
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
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

        {/* Add Expense Type Button */}
        <div className="space-y-2">
          <Label className="invisible">-</Label>
          <AddExpenseTypeDialog onExpenseTypeAdded={fetchExpenseTypes} />
        </div>
      </div>
    </div>
  );
}
