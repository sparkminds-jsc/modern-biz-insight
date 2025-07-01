
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface KPIFiltersProps {
  selectedMonths: number[];
  selectedYears: number[];
  onMonthsChange: (months: number[]) => void;
  onYearsChange: (years: number[]) => void;
  onCreateKPI: () => void;
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

const YEARS = [2023, 2024, 2025, 2026];

export function KPIFilters({
  selectedMonths,
  selectedYears,
  onMonthsChange,
  onYearsChange,
  onCreateKPI
}: KPIFiltersProps) {
  const [showMonthFilter, setShowMonthFilter] = useState(false);
  const [showYearFilter, setShowYearFilter] = useState(false);

  const toggleMonth = (month: number) => {
    if (selectedMonths.includes(month)) {
      onMonthsChange(selectedMonths.filter(m => m !== month));
    } else {
      onMonthsChange([...selectedMonths, month]);
    }
  };

  const toggleYear = (year: number) => {
    if (selectedYears.includes(year)) {
      onYearsChange(selectedYears.filter(y => y !== year));
    } else {
      onYearsChange([...selectedYears, year]);
    }
  };

  const clearMonths = () => {
    onMonthsChange([]);
  };

  const clearYears = () => {
    onYearsChange([]);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Month Filter */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowMonthFilter(!showMonthFilter)}
                className="min-w-[120px] justify-start"
              >
                Tháng ({selectedMonths.length})
              </Button>
              
              {showMonthFilter && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-10 p-4">
                  <div className="grid grid-cols-3 gap-2">
                    {MONTHS.map(month => (
                      <Button
                        key={month.value}
                        variant={selectedMonths.includes(month.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleMonth(month.value)}
                        className="text-xs"
                      >
                        {month.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMonthFilter(false)}
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Year Filter */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowYearFilter(!showYearFilter)}
                className="min-w-[120px] justify-start"
              >
                Năm ({selectedYears.length})
              </Button>
              
              {showYearFilter && (
                <div className="absolute top-full left-0 mt-2 w-60 bg-white border rounded-lg shadow-lg z-10 p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {YEARS.map(year => (
                      <Button
                        key={year}
                        variant={selectedYears.includes(year) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleYear(year)}
                      >
                        {year}
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowYearFilter(false)}
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Filters Display */}
            <div className="flex items-center gap-2 flex-wrap">
              {selectedMonths.map(month => (
                <Badge key={`month-${month}`} variant="secondary" className="flex items-center gap-1">
                  Tháng {month}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleMonth(month)}
                  />
                </Badge>
              ))}
              {selectedYears.map(year => (
                <Badge key={`year-${year}`} variant="secondary" className="flex items-center gap-1">
                  {year}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleYear(year)}
                  />
                </Badge>
              ))}
              
              {(selectedMonths.length > 0 || selectedYears.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearMonths();
                    clearYears();
                  }}
                  className="text-xs"
                >
                  Xóa tất cả
                </Button>
              )}
            </div>
          </div>

          {/* Create KPI Button - aligned with filters */}
          <Button onClick={onCreateKPI} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tạo KPI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
