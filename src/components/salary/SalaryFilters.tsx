
import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SalaryFilters as SalaryFiltersType } from '@/types/salary';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface SalaryFiltersProps {
  filters: SalaryFiltersType;
  onFiltersChange: (filters: SalaryFiltersType) => void;
  onSearch: () => void;
  onCreateSalarySheet: () => void;
}

export function SalaryFilters({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  onCreateSalarySheet 
}: SalaryFiltersProps) {
  const months = [
    { value: 1, label: '01' },
    { value: 2, label: '02' },
    { value: 3, label: '03' },
    { value: 4, label: '04' },
    { value: 5, label: '05' },
    { value: 6, label: '06' },
    { value: 7, label: '07' },
    { value: 8, label: '08' },
    { value: 9, label: '09' },
    { value: 10, label: '10' },
    { value: 11, label: '11' },
    { value: 12, label: '12' }
  ];

  const years = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031];

  const handleMonthToggle = (month: number) => {
    const updatedMonths = filters.months.includes(month)
      ? filters.months.filter(m => m !== month)
      : [...filters.months, month];
    
    onFiltersChange({ ...filters, months: updatedMonths });
  };

  const handleYearToggle = (year: number) => {
    const updatedYears = filters.years.includes(year)
      ? filters.years.filter(y => y !== year)
      : [...filters.years, year];
    
    onFiltersChange({ ...filters, years: updatedYears });
  };

  const getSelectedMonthsText = () => {
    if (filters.months.length === 0) return 'Chọn tháng';
    if (filters.months.length === 1) return `Tháng ${filters.months[0].toString().padStart(2, '0')}`;
    return `${filters.months.length} tháng đã chọn`;
  };

  const getSelectedYearsText = () => {
    if (filters.years.length === 0) return 'Chọn năm';
    if (filters.years.length === 1) return filters.years[0].toString();
    return `${filters.years.length} năm đã chọn`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tháng
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between bg-white"
              >
                {getSelectedMonthsText()}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white">
              {months.map((month) => (
                <DropdownMenuCheckboxItem
                  key={month.value}
                  checked={filters.months.includes(month.value)}
                  onCheckedChange={() => handleMonthToggle(month.value)}
                >
                  Tháng {month.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Năm
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between bg-white"
              >
                {getSelectedYearsText()}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white">
              {years.map((year) => (
                <DropdownMenuCheckboxItem
                  key={year}
                  checked={filters.years.includes(year)}
                  onCheckedChange={() => handleYearToggle(year)}
                >
                  {year}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-end">
          <Button onClick={onSearch} className="w-full">
            <Search className="w-4 h-4 mr-2" />
            Tìm kiếm
          </Button>
        </div>

        <div className="flex items-end">
          <Button onClick={onCreateSalarySheet} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Tạo bảng lương
          </Button>
        </div>
      </div>
    </div>
  );
}
