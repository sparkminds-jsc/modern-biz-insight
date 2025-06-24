
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '../components/layout/AppLayout';
import { EmployeeFilters } from '../components/employees/EmployeeFilters';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { EmployeeForm } from '../components/employees/EmployeeForm';
import { EmployeeDetail } from '../components/employees/EmployeeDetail';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  birth_date: string | null;
  contract_type: string;
  contract_end_date: string | null;
  position: string;
  team: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const EmployeesPage = () => {
  const [filters, setFilters] = useState({
    name: '',
    team: '',
    email: ''
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  const queryClient = useQueryClient();

  // Fetch employees
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees', filters],
    queryFn: async () => {
      let query = supabase.from('employees').select('*');
      
      if (filters.name) {
        query = query.ilike('full_name', `%${filters.name}%`);
      }
      if (filters.team) {
        query = query.ilike('team', `%${filters.team}%`);
      }
      if (filters.email) {
        query = query.ilike('email', `%${filters.email}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Employee[];
    }
  });

  // Create employee
  const createEmployeeMutation = useMutation({
    mutationFn: async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('employees')
        .insert([employee])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: 'Thành công',
        description: 'Thêm nhân viên mới thành công!'
      });
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi thêm nhân viên',
        variant: 'destructive'
      });
    }
  });

  // Update employee
  const updateEmployeeMutation = useMutation({
    mutationFn: async (employee: Employee) => {
      const { data, error } = await supabase
        .from('employees')
        .update(employee)
        .eq('id', employee.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: 'Thành công',
        description: 'Cập nhật thông tin nhân viên thành công!'
      });
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật thông tin nhân viên',
        variant: 'destructive'
      });
    }
  });

  // Terminate employee
  const terminateEmployeeMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      const { data, error } = await supabase
        .from('employees')
        .update({ status: 'Đã nghỉ' })
        .eq('id', employeeId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật trạng thái nghỉ việc cho nhân viên!'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật trạng thái nhân viên',
        variant: 'destructive'
      });
    }
  });

  const handleSearch = () => {
    // Query will be refetched automatically due to filters dependency
  };

  const handleAddEmployee = () => {
    setFormMode('add');
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setFormMode('edit');
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleViewDetail = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailOpen(true);
  };

  const handleTerminateEmployee = (employee: Employee) => {
    if (confirm(`Bạn có chắc chắn muốn cho nhân viên ${employee.full_name} nghỉ việc?`)) {
      terminateEmployeeMutation.mutate(employee.id);
    }
  };

  const handleFormSubmit = (employee: Employee) => {
    if (formMode === 'add') {
      const { id, created_at, updated_at, ...newEmployee } = employee;
      createEmployeeMutation.mutate(newEmployee);
    } else {
      updateEmployeeMutation.mutate(employee);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý nhân viên</h1>
          <p className="text-gray-600">Quản lý thông tin và hồ sơ nhân viên</p>
        </div>

        <EmployeeFilters
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          onAddEmployee={handleAddEmployee}
        />

        <EmployeeTable
          employees={employees}
          onViewDetail={handleViewDetail}
          onEdit={handleEditEmployee}
          onTerminate={handleTerminateEmployee}
        />

        <EmployeeForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          employee={selectedEmployee}
          title={formMode === 'add' ? 'Thêm nhân viên mới' : 'Chỉnh sửa thông tin nhân viên'}
        />

        <EmployeeDetail
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          employee={selectedEmployee}
        />
      </div>
    </AppLayout>
  );
};

export default EmployeesPage;
