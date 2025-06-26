
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface KPIFiltersProps {
  selectedMonths: number[];
  selectedYears: number[];
  onMonthsChange: (months: number[]) => void;
  onYearsChange: (years: number[]) => void;
  onCreateKPI: () => void;
}

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
  { value: 12, label: '12' },
];

const years = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031];

export function KPIFilters({
  selectedMonths,
  selectedYears,
  onMonthsChange,
  onYearsChange,
  onCreateKPI
}: KPIFiltersProps) {
  const handleMonthSelect = (monthValue: string) => {
    const month = parseInt(monthValue);
    if (!selectedMonths.includes(month)) {
      onMonthsChange([...selectedMonths, month]);
    }
  };

  const handleYearSelect = (yearValue: string) => {
    const year = parseInt(yearValue);
    if (!selectedYears.includes(year)) {
      onYearsChange([...selectedYears, year]);
    }
  };

  const removeMonth = (month: number) => {
    onMonthsChange(selectedMonths.filter(m => m !== month));
  };

  const removeYear = (year: number) => {
    onYearsChange(selectedYears.filter(y => y !== year));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Month Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tháng</label>
          <Select onValueChange={handleMonthSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn tháng" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-1">
            {selectedMonths.map((month) => (
              <Badge key={month} variant="secondary" className="flex items-center gap-1">
                {months.find(m => m.value === month)?.label}
                <button onClick={() => removeMonth(month)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Year Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Năm</label>
          <Select onValueChange={handleYearSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-1">
            {selectedYears.map((year) => (
              <Badge key={year} variant="secondary" className="flex items-center gap-1">
                {year}
                <button onClick={() => removeYear(year)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Create Button */}
        <div className="flex items-end">
          <Button onClick={onCreateKPI} className="w-full">
            Tạo KPI
          </Button>
        </div>
      </div>
    </div>
  );
}
