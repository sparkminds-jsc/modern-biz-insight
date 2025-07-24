
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Search, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface ReportsFiltersProps {
  onFilter: (filters: {
    startDate?: Date;
    endDate?: Date;
    walletType?: string;
    content?: string;
    selectedTypes?: string[];
  }) => void;
}

export function ReportsFilters({ onFilter }: ReportsFiltersProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [walletType, setWalletType] = useState<string>('all');
  const [content, setContent] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [revenueTypes, setRevenueTypes] = useState<string[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<string[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const walletTypes = ['Ngân Hàng', 'Binance', 'Upwork', 'Tiền Mặt'];

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const [revenueResult, expenseTypesResult] = await Promise.all([
        supabase.from('revenue').select('revenue_type').order('revenue_type'),
        supabase.from('expense_types').select('name').order('name')
      ]);

      if (revenueResult.data) {
        const uniqueRevenueTypes = [...new Set(revenueResult.data.map(item => item.revenue_type))];
        setRevenueTypes(uniqueRevenueTypes);
      }

      if (expenseTypesResult.data) {
        const expenseTypeNames = expenseTypesResult.data.map(item => item.name);
        setExpenseTypes(expenseTypeNames);
      }
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getSelectedTypesDisplay = () => {
    if (selectedTypes.length === 0) return 'Tất cả loại thu chi';
    if (selectedTypes.length === 1) return selectedTypes[0];
    return `${selectedTypes.length} loại đã chọn`;
  };

  const handleSearch = () => {
    onFilter({
      startDate,
      endDate,
      walletType: walletType === 'all' ? undefined : walletType,
      content: content.trim() || undefined,
      selectedTypes: selectedTypes.length > 0 ? selectedTypes : undefined
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
                className="pointer-events-auto"
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
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Loại Ví */}
        <div className="space-y-2">
          <Label>Loại Ví</Label>
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

        {/* Nội dung thu chi */}
        <div className="space-y-2">
          <Label>Nội dung thu chi</Label>
          <Input
            placeholder="Tìm kiếm nội dung..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Loại thu chi */}
        <div className="space-y-2">
          <Label>Loại thu chi</Label>
          <Popover open={showTypeDropdown} onOpenChange={setShowTypeDropdown}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
              >
                <span className="truncate">{getSelectedTypesDisplay()}</span>
                <ChevronDown className="h-4 w-4 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Loại Doanh Thu</h4>
                  <div className="space-y-2">
                    {revenueTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`revenue-${type}`}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => handleTypeToggle(type)}
                        />
                        <Label htmlFor={`revenue-${type}`} className="text-sm">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Loại Chi Phí</h4>
                  <div className="space-y-2">
                    {expenseTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`expense-${type}`}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => handleTypeToggle(type)}
                        />
                        <Label htmlFor={`expense-${type}`} className="text-sm">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
}
