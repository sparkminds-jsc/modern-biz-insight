
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Copy, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TeamReportDetailFiltersProps {
  employees: any[];
  onFilter: (employeeCode?: string, notes?: string, projectId?: string) => void;
  onCreateBill: () => void;
  onCopyReport: () => void;
  onExportCSV: () => void;
}

export function TeamReportDetailFilters({ 
  employees, 
  onFilter, 
  onCreateBill, 
  onCopyReport,
  onExportCSV 
}: TeamReportDetailFiltersProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [notesFilter, setNotesFilter] = useState<string>('');
  const [projects, setProjects] = useState<any[]>([]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleSearch = () => {
    onFilter(selectedEmployee, notesFilter, selectedProject);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 items-end">
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

        {/* Project Filter */}
        <div className="space-y-2">
          <Label>Dự án</Label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="none">Không có dự án</SelectItem>
              {Array.isArray(projects) && projects.map((project) => (
                project && project.id && project.name ? (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ) : null
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notes Filter */}
        <div className="space-y-2">
          <Label>Chú thích</Label>
          <Input
            placeholder="Tìm theo chú thích"
            value={notesFilter}
            onChange={(e) => setNotesFilter(e.target.value)}
          />
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

        <Button onClick={onExportCSV} variant="outline" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
