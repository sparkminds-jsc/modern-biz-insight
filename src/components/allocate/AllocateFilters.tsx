import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AllocateFiltersProps {
  searchName: string;
  onSearchNameChange: (value: string) => void;
  selectedTeam: string;
  onTeamChange: (value: string) => void;
  teams: string[];
  onSearch: () => void;
}

export function AllocateFilters({
  searchName,
  onSearchNameChange,
  selectedTeam,
  onTeamChange,
  teams,
  onSearch,
}: AllocateFiltersProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Team</label>
          <Select value={selectedTeam} onValueChange={onTeamChange}>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tên nhân viên</label>
          <Input
            placeholder="Nhập tên nhân viên..."
            value={searchName}
            onChange={(e) => onSearchNameChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="flex items-end">
          <Button onClick={onSearch} className="w-full">
            <Search className="w-4 h-4 mr-2" />
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
}
