import { Eye, Edit, UserX, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Employee, SortConfig } from '@/types/employee';

interface EmployeeTableProps {
  employees: Employee[];
  onViewDetail: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onTerminate: (employee: Employee) => void;
  sortConfig: SortConfig;
  onSort: (key: keyof Employee) => void;
}

export function EmployeeTable({ 
  employees, 
  onViewDetail, 
  onEdit, 
  onTerminate,
  sortConfig,
  onSort
}: EmployeeTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === 'Đang làm';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {status}
      </span>
    );
  };

  const getSortIcon = (columnKey: keyof Employee) => {
    if (sortConfig.key !== columnKey) {
      return null;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  const SortableHeader = ({ children, sortKey }: { children: React.ReactNode; sortKey: keyof Employee }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center">
        {children}
        {getSortIcon(sortKey)}
      </div>
    </TableHead>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Danh sách nhân viên</h2>
        <p className="text-gray-600">Quản lý thông tin nhân viên trong hệ thống</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader sortKey="employee_code">Mã nhân viên</SortableHeader>
              <SortableHeader sortKey="full_name">Họ và tên</SortableHeader>
              <SortableHeader sortKey="email">Email</SortableHeader>
              <SortableHeader sortKey="birth_date">Ngày sinh</SortableHeader>
              <SortableHeader sortKey="contract_type">Loại HĐ</SortableHeader>
              <SortableHeader sortKey="contract_end_date">Ngày kết thúc HĐ</SortableHeader>
              <SortableHeader sortKey="position">Chức vụ</SortableHeader>
              <SortableHeader sortKey="team">Team</SortableHeader>
              <SortableHeader sortKey="status">Trạng thái</SortableHeader>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.employee_code}</TableCell>
                <TableCell>{employee.full_name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{formatDate(employee.birth_date)}</TableCell>
                <TableCell>{employee.contract_type}</TableCell>
                <TableCell>{formatDate(employee.contract_end_date)}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.team}</TableCell>
                <TableCell>{getStatusBadge(employee.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetail(employee)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(employee)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {employee.status === 'Đang làm' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onTerminate(employee)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
