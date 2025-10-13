import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/types/project';

interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  team: string;
}

interface AllocateData {
  employee_code: string;
  role: string;
  position: string;
  call_kh: boolean;
  project_allocations: Record<string, string>;
}

interface AllocateTableProps {
  employees: Employee[];
  allocates: Record<string, AllocateData>;
  projects: Project[];
  onAllocateChange: (employeeCode: string, field: keyof AllocateData, value: any) => void;
}

type SortField = 'employee_code' | 'full_name' | 'team';
type SortDirection = 'asc' | 'desc';

const ROLE_OPTIONS = ['Leader', 'Member'];
const POSITION_OPTIONS = ['BE', 'FE', 'Mobile', 'Fullstack Web/Mobile', 'Fullstack BE/Web', 'Fullstack All', 'BA', 'QC', 'BA/QC', 'BA/PM', 'PM/QC'];
const CALL_KH_OPTIONS = [
  { value: 'true', label: 'Có' },
  { value: 'false', label: 'Không' }
];
const ALLOCATION_OPTIONS = ['25%', '50%', '75%', '100%'];

export function AllocateTable({ employees, allocates, projects, onAllocateChange }: AllocateTableProps) {
  const [sortField, setSortField] = useState<SortField>('employee_code');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
        )}
      </div>
    </TableHead>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">STT</TableHead>
              <SortableHeader field="employee_code">Mã nhân viên</SortableHeader>
              <SortableHeader field="full_name">Tên nhân viên</SortableHeader>
              <SortableHeader field="team">Team</SortableHeader>
              <TableHead>Role</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Call KH</TableHead>
              {projects.map((project) => (
                <TableHead key={project.id}>{project.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7 + projects.length} className="text-center py-8 text-gray-500">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              sortedEmployees.map((employee, index) => {
                const allocate = allocates[employee.employee_code] || {
                  role: 'Member',
                  position: 'BE',
                  call_kh: false,
                  project_allocations: {}
                };

                return (
                  <TableRow key={employee.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{employee.employee_code}</TableCell>
                    <TableCell>{employee.full_name}</TableCell>
                    <TableCell>{employee.team}</TableCell>
                    <TableCell>
                      <Select
                        value={allocate.role}
                        onValueChange={(value) => onAllocateChange(employee.employee_code, 'role', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={allocate.position}
                        onValueChange={(value) => onAllocateChange(employee.employee_code, 'position', value)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {POSITION_OPTIONS.map((position) => (
                            <SelectItem key={position} value={position}>{position}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={allocate.call_kh.toString()}
                        onValueChange={(value) => onAllocateChange(employee.employee_code, 'call_kh', value === 'true')}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CALL_KH_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    {projects.map((project) => (
                      <TableCell key={project.id}>
                        <Select
                          value={allocate.project_allocations[project.id] || 'none'}
                          onValueChange={(value) => {
                            const newAllocations = { ...allocate.project_allocations };
                            if (value && value !== 'none') {
                              newAllocations[project.id] = value;
                            } else {
                              delete newAllocations[project.id];
                            }
                            onAllocateChange(employee.employee_code, 'project_allocations', newAllocations);
                          }}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            {ALLOCATION_OPTIONS.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
