import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProjectFiltersProps {
  nameFilter: string;
  statusFilter: string;
  onNameFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

export function ProjectFilters({ nameFilter, statusFilter, onNameFilterChange, onStatusFilterChange }: ProjectFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="space-y-2">
        <Label htmlFor="name-filter">Tên dự án</Label>
        <Input
          id="name-filter"
          placeholder="Tìm kiếm theo tên dự án..."
          value={nameFilter}
          onChange={(e) => onNameFilterChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status-filter">Trạng thái</Label>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger id="status-filter" className="bg-background">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="Đang chạy">Đang chạy</SelectItem>
            <SelectItem value="Kết thúc">Kết thúc</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}