
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ArrowUpDown, Lock, Unlock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TeamReportDetailTableProps {
  data: any[];
  onEdit: (detail: any) => void;
  onDelete: (detail: any) => void;
  onToggleLock: (detail: any) => void;
}

export function TeamReportDetailTable({ data, onEdit, onDelete, onToggleLock }: TeamReportDetailTableProps) {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [projects, setProjects] = useState<any[]>([]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: projectsData, error } = await supabase
          .from('projects')
          .select('id, name');
        
        if (error) throw error;
        setProjects(projectsData || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const getProjectName = (projectId: string) => {
    if (!projectId) return '-';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : '-';
  };

  const formatCurrency = (amount: number) => {
    const rounded = Math.round(amount || 0);
    return rounded.toLocaleString('vi-VN');
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value || 0)}%`;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown className="h-4 w-4" />
      </div>
    </TableHead>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">STT</TableHead>
            <SortableHeader field="employee_code">Mã nhân viên</SortableHeader>
            <SortableHeader field="employee_name">Tên nhân viên</SortableHeader>
            <SortableHeader field="project_id">Dự án</SortableHeader>
            <SortableHeader field="month">Tháng</SortableHeader>
            <SortableHeader field="year">Năm</SortableHeader>
            <SortableHeader field="billable_hours">Giờ có bill</SortableHeader>
            <SortableHeader field="rate">Rate</SortableHeader>
            <SortableHeader field="fx_rate">FX Rate</SortableHeader>
            <SortableHeader field="percentage">Percentage</SortableHeader>
            <SortableHeader field="converted_vnd">Qui đổi VND</SortableHeader>
            <SortableHeader field="package_vnd">Trọn gói VND</SortableHeader>
            <SortableHeader field="has_salary">Có tính lương</SortableHeader>
            <SortableHeader field="gross_salary">Lương Gross</SortableHeader>
            <SortableHeader field="company_payment">Công ty chi trả</SortableHeader>
            <SortableHeader field="salary_13">Tăng ca</SortableHeader>
            <SortableHeader field="total_payment">Tổng chi trả</SortableHeader>
            <SortableHeader field="storage_usd">Lưu trữ USD</SortableHeader>
            <SortableHeader field="storage_usdt">Lưu trữ USDT</SortableHeader>
            <SortableHeader field="earn_vnd">Earn VND</SortableHeader>
            <SortableHeader field="earn_usdt">Earn USDT</SortableHeader>
            <TableHead>Chú thích</TableHead>
            <TableHead className="w-32">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item, index) => (
            <TableRow key={item.id} className={item.is_locked ? "bg-green-100" : ""}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.employee_code}</TableCell>
              <TableCell>{item.employee_name}</TableCell>
              <TableCell>{getProjectName(item.project_id)}</TableCell>
              <TableCell>{String(item.month).padStart(2, '0')}</TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>{formatCurrency(item.billable_hours)}</TableCell>
              <TableCell>{formatCurrency(item.rate)}</TableCell>
              <TableCell>{formatCurrency(item.fx_rate)}</TableCell>
              <TableCell>{item.percentage}%</TableCell>
              <TableCell>{formatCurrency(item.converted_vnd)}</TableCell>
              <TableCell>{formatCurrency(item.package_vnd)}</TableCell>
              <TableCell>{item.has_salary ? 'Có' : 'Không'}</TableCell>
              <TableCell>{formatCurrency(item.gross_salary)}</TableCell>
              <TableCell>{formatCurrency(item.company_payment)}</TableCell>
              <TableCell>{formatCurrency(item.salary_13)}</TableCell>
              <TableCell>{formatCurrency(item.total_payment)}</TableCell>
              <TableCell>{formatCurrency(item.storage_usd)}</TableCell>
              <TableCell>{formatCurrency(item.storage_usdt)}</TableCell>
              <TableCell>{formatCurrency(item.earn_vnd)}</TableCell>
              <TableCell>{formatCurrency(item.earn_usdt)}</TableCell>
              <TableCell className="max-w-32 truncate">
                {item.notes || '-'}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(item)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(item)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onToggleLock(item)}
                    className={item.is_locked ? "text-green-600 hover:text-green-700 hover:bg-green-50" : ""}
                  >
                    {item.is_locked ? (
                      <Unlock className="h-3 w-3" />
                    ) : (
                      <Lock className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
