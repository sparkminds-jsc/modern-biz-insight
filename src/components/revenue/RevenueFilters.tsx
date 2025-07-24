
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Search, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface RevenueFiltersProps {
  onFilter: (filters: {
    startDate?: Date;
    endDate?: Date;
    revenueType?: string;
    needsDebtCollection?: string;
    content?: string;
  }) => void;
  onAddRevenue: () => void;
}

export function RevenueFilters({ onFilter, onAddRevenue }: RevenueFiltersProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [revenueType, setRevenueType] = useState<string>('all');
  const [needsDebtCollection, setNeedsDebtCollection] = useState<string>('all');
  const [content, setContent] = useState<string>('');

  const handleSearch = () => {
    onFilter({
      startDate,
      endDate,
      revenueType: revenueType === 'all' ? undefined : revenueType,
      needsDebtCollection: needsDebtCollection === 'all' ? undefined : needsDebtCollection,
      content: content.trim() || undefined
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 items-end">
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

        {/* Loại Doanh Thu */}
        <div className="space-y-2">
          <Label>Loại Doanh Thu</Label>
          <Select value={revenueType} onValueChange={setRevenueType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Lãi Ngân Hàng">Lãi Ngân Hàng</SelectItem>
              <SelectItem value="Invoice">Invoice</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cần đòi nợ */}
        <div className="space-y-2">
          <Label>Cần đòi nợ</Label>
          <Select value={needsDebtCollection} onValueChange={setNeedsDebtCollection}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="true">Có</SelectItem>
              <SelectItem value="false">Không</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nội dung doanh thu */}
        <div className="space-y-2">
          <Label>Nội dung doanh thu</Label>
          <Input
            placeholder="Tìm kiếm nội dung..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>

        {/* Add Revenue Button */}
        <Button onClick={onAddRevenue} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Thêm doanh thu
        </Button>
      </div>
    </div>
  );
}
