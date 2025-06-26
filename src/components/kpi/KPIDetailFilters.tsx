
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Copy } from 'lucide-react';

interface KPIDetailFiltersProps {
  employeeCode: string;
  employeeName: string;
  hasKPIGap: string;
  onEmployeeCodeChange: (value: string) => void;
  onEmployeeNameChange: (value: string) => void;
  onHasKPIGapChange: (value: string) => void;
  onSearch: () => void;
  onAddKPI: () => void;
  onCopyKPI: () => void;
}

export function KPIDetailFilters({
  employeeCode,
  employeeName,
  hasKPIGap,
  onEmployeeCodeChange,
  onEmployeeNameChange,
  onHasKPIGapChange,
  onSearch,
  onAddKPI,
  onCopyKPI
}: KPIDetailFiltersProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Mã nhân viên
          </label>
          <Input
            placeholder="Nhập mã nhân viên"
            value={employeeCode}
            onChange={(e) => onEmployeeCodeChange(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Tên nhân viên
          </label>
          <Input
            placeholder="Nhập tên nhân viên"
            value={employeeName}
            onChange={(e) => onEmployeeNameChange(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Lệch KPI
          </label>
          <Select value={hasKPIGap} onValueChange={onHasKPIGapChange}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="yes">Có</SelectItem>
              <SelectItem value="no">Không</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button onClick={onSearch} className="w-full flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>

        <div className="flex items-end">
          <Button onClick={onAddKPI} variant="outline" className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Thêm KPI
          </Button>
        </div>

        <div className="flex items-end">
          <Button onClick={onCopyKPI} variant="outline" className="w-full flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Copy KPI
          </Button>
        </div>
      </div>
    </div>
  );
}
