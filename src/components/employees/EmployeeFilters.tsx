
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EmployeeFiltersProps {
  filters: {
    name: string;
    team: string;
    email: string;
    status: string;
  };
  onFiltersChange: (filters: { name: string; team: string; email: string; status: string }) => void;
  onSearch: () => void;
  onAddEmployee: () => void;
}

export function EmployeeFilters({ filters, onFiltersChange, onSearch, onAddEmployee }: EmployeeFiltersProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc tìm kiếm</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên nhân viên
          </label>
          <Input
            type="text"
            placeholder="Nhập tên nhân viên"
            value={filters.name}
            onChange={(e) => onFiltersChange({ ...filters, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team
          </label>
          <Input
            type="text"
            placeholder="Nhập tên team"
            value={filters.team}
            onChange={(e) => onFiltersChange({ ...filters, team: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            type="email"
            placeholder="Nhập email"
            value={filters.email}
            onChange={(e) => onFiltersChange({ ...filters, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Đang làm">Đang làm</SelectItem>
              <SelectItem value="Đã nghỉ">Đã nghỉ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col justify-end">
          <div className="flex gap-2">
            <Button onClick={onSearch} className="flex-1">
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
            <Button onClick={onAddEmployee} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Thêm nhân viên
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
