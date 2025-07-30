import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProjectFiltersProps {
  nameFilter: string;
  onNameFilterChange: (value: string) => void;
}

export function ProjectFilters({ nameFilter, onNameFilterChange }: ProjectFiltersProps) {
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
    </div>
  );
}