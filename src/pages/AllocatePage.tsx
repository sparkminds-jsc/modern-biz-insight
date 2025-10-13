import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AllocateFilters } from '@/components/allocate/AllocateFilters';
import { AllocateTable } from '@/components/allocate/AllocateTable';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  team: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface AllocateData {
  employee_code: string;
  role: string;
  position: string;
  call_kh: boolean;
  project_allocations: Record<string, string>;
}

export default function AllocatePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allocates, setAllocates] = useState<Record<string, AllocateData>>({});
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchName, setSearchName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [teams, setTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch employees
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'Đang làm')
        .order('employee_code');

      if (employeesError) throw employeesError;
      
      setEmployees(employeesData || []);
      setFilteredEmployees(employeesData || []);
      
      // Extract unique teams
      const uniqueTeams = [...new Set(employeesData?.map(e => e.team) || [])];
      setTeams(uniqueTeams);

      // Fetch active projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'Đang chạy')
        .order('name');

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      // Fetch allocates
      const { data: allocatesData, error: allocatesError } = await supabase
        .from('allocates')
        .select('*');

      if (allocatesError) throw allocatesError;
      
      const allocatesMap: Record<string, AllocateData> = {};
      allocatesData?.forEach((allocate: any) => {
        allocatesMap[allocate.employee_code] = {
          employee_code: allocate.employee_code,
          role: allocate.role,
          position: allocate.position,
          call_kh: allocate.call_kh,
          project_allocations: allocate.project_allocations || {}
        };
      });
      setAllocates(allocatesMap);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = employees;

    if (selectedTeam !== 'all') {
      filtered = filtered.filter(e => e.team === selectedTeam);
    }

    if (searchName.trim()) {
      filtered = filtered.filter(e => 
        e.full_name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  };

  const handleAllocateChange = (employeeCode: string, field: keyof AllocateData, value: any) => {
    setAllocates(prev => ({
      ...prev,
      [employeeCode]: {
        ...prev[employeeCode],
        employee_code: employeeCode,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Prepare data for upsert
      const allocateRecords = Object.values(allocates);

      // Use upsert to update existing records and insert new ones
      const { error: upsertError } = await supabase
        .from('allocates')
        .upsert(allocateRecords, {
          onConflict: 'employee_code'
        });

      if (upsertError) throw upsertError;

      toast.success('Lưu dữ liệu thành công');
      fetchData();
    } catch (error) {
      console.error('Error saving allocates:', error);
      toast.error('Có lỗi xảy ra khi lưu dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Allocate</h1>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Lưu
          </Button>
        </div>

        <AllocateFilters
          searchName={searchName}
          onSearchNameChange={setSearchName}
          selectedTeam={selectedTeam}
          onTeamChange={setSelectedTeam}
          teams={teams}
          onSearch={handleSearch}
        />

        <AllocateTable
          employees={filteredEmployees}
          allocates={allocates}
          projects={projects}
          onAllocateChange={handleAllocateChange}
        />
      </div>
    </AppLayout>
  );
}
