
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Copy } from 'lucide-react';

interface TeamReportDetailFiltersProps {
  employees: any[];
  onFilter: (employeeCode?: string) => void;
  onCreateBill: () => void;
  onCopyReport: () => void;
}

export function TeamReportDetailFilters({ 
  employees, 
  onFilter, 
  onCreateBill, 
  onCopyReport 
}: TeamReportDetailFiltersProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  const handleSearch = () => {
    onFilter(selectedEmployee);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Employee Code */}
        <div className="space-y-2">
          <Label>Mã nhân viên</Label>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.employee_code} value={employee.employee_code}>
                  {employee.employee_code} - {employee.full_name}
                </SelectItem>
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
        <Button onClick={onCreateBill} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Thêm Bill
        </Button>

        <Button onClick={onCopyReport} variant="outline" className="w-full">
          <Copy className="mr-2 h-4 w-4" />
          Copy báo cáo
        </Button>
      </div>
    </div>
  );
}
