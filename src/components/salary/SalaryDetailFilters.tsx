import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Copy } from 'lucide-react';
import type { SalaryDetailFilters } from '@/types/salary';

interface SalaryDetailFiltersProps {
  filters: SalaryDetailFilters;
  onFiltersChange: (filters: SalaryDetailFilters) => void;
  onSearch: () => void;
  onAddEmployee: () => void;
  onCopySalarySheet: () => void;
}

export function SalaryDetailFilters({
  filters,
  onFiltersChange,
  onSearch,
  onAddEmployee,
  onCopySalarySheet
}: SalaryDetailFiltersProps) {
  const teams = [
    'Tất cả',
    'Frontend',
    'Backend',
    'Mobile',
    'DevOps',
    'QA',
    'BA',
    'Design',
    'Marketing',
    'Sales',
    'HR',
    'Admin'
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="employee-code">Mã nhân viên</Label>
          <Input
            id="employee-code"
            placeholder="Nhập mã nhân viên"
            value={filters.employee_code}
            onChange={(e) =>
              onFiltersChange({ ...filters, employee_code: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employee-name">Tên nhân viên</Label>
          <Input
            id="employee-name"
            placeholder="Nhập tên nhân viên"
            value={filters.employee_name}
            onChange={(e) =>
              onFiltersChange({ ...filters, employee_name: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="team">Team</Label>
          <Select
            value={filters.team}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, team: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn team" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {teams.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end space-x-2">
          <Button onClick={onSearch} className="flex-1">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={onAddEmployee} variant="default">
          <Plus className="w-4 h-4 mr-2" />
          Thêm lương nhân viên
        </Button>
        <Button onClick={onCopySalarySheet} variant="outline">
          <Copy className="w-4 h-4 mr-2" />
          Copy bảng lương
        </Button>
      </div>
    </div>
  );
}
