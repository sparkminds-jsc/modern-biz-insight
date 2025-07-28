
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Search, FileText } from 'lucide-react';

interface TeamFiltersProps {
  onFilter: (filters: {
    months: number[];
    years: number[];
    team?: string;
  }) => void;
  onFilterChange?: (selectedMonths: number[], selectedYears: number[]) => void;
  onCreateReport: () => void;
  onCreateTeam: () => void;
  onExportCSV: () => void;
  teams: string[];
}

export function TeamFilters({ onFilter, onFilterChange, onCreateReport, onCreateTeam, onExportCSV, teams }: TeamFiltersProps) {
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

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
    const newSelectedMonths = selectedMonths.includes(month)
      ? selectedMonths.filter(m => m !== month)
      : [...selectedMonths, month];
    setSelectedMonths(newSelectedMonths);
    onFilterChange?.(newSelectedMonths, selectedYears);
  };

  const handleYearToggle = (year: number) => {
    const newSelectedYears = selectedYears.includes(year)
      ? selectedYears.filter(y => y !== year)
      : [...selectedYears, year];
    setSelectedYears(newSelectedYears);
    onFilterChange?.(selectedMonths, newSelectedYears);
  };

  const handleSearch = () => {
    onFilter({
      months: selectedMonths,
      years: selectedYears,
      team: selectedTeam === 'all' ? undefined : selectedTeam
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Tháng */}
        <div className="space-y-2">
          <Label>Tháng</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {selectedMonths.length === 0 
                  ? "Chọn tháng" 
                  : `${selectedMonths.length} tháng đã chọn`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="grid grid-cols-3 gap-2">
                {months.map((month) => (
                  <div key={month.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`month-${month.value}`}
                      checked={selectedMonths.includes(month.value)}
                      onCheckedChange={() => handleMonthToggle(month.value)}
                    />
                    <Label htmlFor={`month-${month.value}`} className="text-sm">
                      {month.label}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Năm */}
        <div className="space-y-2">
          <Label>Năm</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {selectedYears.length === 0 
                  ? "Chọn năm" 
                  : `${selectedYears.length} năm đã chọn`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="grid grid-cols-2 gap-2">
                {years.map((year) => (
                  <div key={year} className="flex items-center space-x-2">
                    <Checkbox
                      id={`year-${year}`}
                      checked={selectedYears.includes(year)}
                      onCheckedChange={() => handleYearToggle(year)}
                    />
                    <Label htmlFor={`year-${year}`} className="text-sm">
                      {year}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Team */}
        <div className="space-y-2">
          <Label>Team</Label>
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team} value={team}>{team}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={onCreateReport} variant="outline" className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            Tạo báo cáo
          </Button>
          <Button onClick={onCreateTeam} variant="outline" className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            Tạo Team
          </Button>
          <Button onClick={onExportCSV} variant="outline" className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
