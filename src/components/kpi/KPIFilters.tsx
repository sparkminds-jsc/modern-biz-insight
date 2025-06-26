
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Search } from 'lucide-react';

interface KPIFiltersProps {
  selectedMonths: number[];
  selectedYears: number[];
  onMonthsChange: (months: number[]) => void;
  onYearsChange: (years: number[]) => void;
}

const MONTHS = [
  { value: 1, label: 'Tháng 1' },
  { value: 2, label: 'Tháng 2' },
  { value: 3, label: 'Tháng 3' },
  { value: 4, label: 'Tháng 4' },
  { value: 5, label: 'Tháng 5' },
  { value: 6, label: 'Tháng 6' },
  { value: 7, label: 'Tháng 7' },
  { value: 8, label: 'Tháng 8' },
  { value: 9, label: 'Tháng 9' },
  { value: 10, label: 'Tháng 10' },
  { value: 11, label: 'Tháng 11' },
  { value: 12, label: 'Tháng 12' },
];

const YEARS = [2024, 2023, 2022, 2021, 2020];

export function KPIFilters({ 
  selectedMonths, 
  selectedYears, 
  onMonthsChange, 
  onYearsChange 
}: KPIFiltersProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const handleAddMonth = (monthValue: string) => {
    const month = parseInt(monthValue);
    if (!selectedMonths.includes(month)) {
      onMonthsChange([...selectedMonths, month]);
    }
    setSelectedMonth('');
  };

  const handleAddYear = (yearValue: string) => {
    const year = parseInt(yearValue);
    if (!selectedYears.includes(year)) {
      onYearsChange([...selectedYears, year]);
    }
    setSelectedYear('');
  };

  const handleRemoveMonth = (month: number) => {
    onMonthsChange(selectedMonths.filter(m => m !== month));
  };

  const handleRemoveYear = (year: number) => {
    onYearsChange(selectedYears.filter(y => y !== year));
  };

  const clearAllFilters = () => {
    onMonthsChange([]);
    onYearsChange([]);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Bộ lọc</h3>
            {(selectedMonths.length > 0 || selectedYears.length > 0) && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Xóa tất cả
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Month filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tháng</label>
              <Select value={selectedMonth} onValueChange={handleAddMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tháng" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.filter(month => !selectedMonths.includes(month.value)).map(month => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedMonths.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedMonths.map(month => (
                    <Badge key={month} variant="secondary" className="flex items-center gap-1">
                      Tháng {month}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleRemoveMonth(month)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Year filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Năm</label>
              <Select value={selectedYear} onValueChange={handleAddYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn năm" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.filter(year => !selectedYears.includes(year)).map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedYears.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedYears.map(year => (
                    <Badge key={year} variant="secondary" className="flex items-center gap-1">
                      {year}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleRemoveYear(year)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
