
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, CheckCircle, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface RevenueTableProps {
  data: any[];
  onViewDetail: (revenue: any) => void;
  onEdit: (revenue: any) => void;
  onFinalize: (revenue: any) => void;
  onRefresh?: () => void;
}

const REVENUE_TYPE_OPTIONS = ['Invoice', 'Lãi Ngân Hàng', 'Chưa phân loại'];

export function RevenueTable({ data, onViewDetail, onEdit, onFinalize, onRefresh }: RevenueTableProps) {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch projects to display project names
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Project[];
    }
  });

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return '';
    const project = projects.find(p => p.id === projectId);
    return project?.name || '';
  };

  const formatCurrency = (amount: number) => {
    return Math.round(amount).toLocaleString('vi-VN');
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

  const handleTypeChange = async (revenue: any, newType: string) => {
    if (newType === revenue.revenue_type) return;
    try {
      const { error } = await supabase
        .from('revenue')
        .update({ revenue_type: newType })
        .eq('id', revenue.id);
      if (error) throw error;
      toast.success('Đã cập nhật loại doanh thu');
      onRefresh?.();
    } catch (e) {
      console.error(e);
      toast.error('Không thể cập nhật loại doanh thu');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Số TT</TableHead>
            <SortableHeader field="created_date">Ngày tạo doanh thu</SortableHeader>
            <SortableHeader field="transaction_number">Số GD</SortableHeader>
            <SortableHeader field="content">Nội dung doanh thu</SortableHeader>
            <SortableHeader field="revenue_type">Loại Doanh Thu</SortableHeader>
            <TableHead>Dự án</TableHead>
            <SortableHeader field="amount_vnd">Số tiền VND</SortableHeader>
            <SortableHeader field="amount_usd">Số tiền USD</SortableHeader>
            <SortableHeader field="amount_usdt">Số tiền USDT</SortableHeader>
            <SortableHeader field="wallet_type">Lưu Ví</SortableHeader>
            <SortableHeader field="needs_debt_collection">Cần Đòi Nợ</SortableHeader>
            <TableHead className="w-32">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((revenue, index) => (
            <TableRow key={revenue.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {format(new Date(revenue.created_date), 'dd/MM/yyyy', { locale: vi })}
              </TableCell>
              <TableCell className="text-sm">{revenue.transaction_number || '-'}</TableCell>
              <TableCell className="max-w-96 whitespace-normal break-words">{revenue.content}</TableCell>
              <TableCell>
                {revenue.is_finalized ? (
                  <Badge variant={revenue.revenue_type === 'Invoice' ? 'default' : 'secondary'}>
                    {revenue.revenue_type}
                  </Badge>
                ) : (
                  <Select
                    value={revenue.revenue_type}
                    onValueChange={(v) => handleTypeChange(revenue, v)}
                  >
                    <SelectTrigger className="h-8 w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(REVENUE_TYPE_OPTIONS.includes(revenue.revenue_type) ? REVENUE_TYPE_OPTIONS : [revenue.revenue_type, ...REVENUE_TYPE_OPTIONS]).map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
              <TableCell>{getProjectName(revenue.project_id)}</TableCell>
              <TableCell>{formatCurrency(revenue.amount_vnd)}</TableCell>
              <TableCell>{formatCurrency(revenue.amount_usd)}</TableCell>
              <TableCell>{formatCurrency(revenue.amount_usdt)}</TableCell>
              <TableCell>
                <Badge variant="outline">{revenue.wallet_type}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={revenue.needs_debt_collection ? 'destructive' : 'secondary'}>
                  {revenue.needs_debt_collection ? 'Có' : 'Không'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetail(revenue)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(revenue)}
                    disabled={revenue.is_finalized}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onFinalize(revenue)}
                    disabled={revenue.is_finalized}
                  >
                    <CheckCircle className="h-3 w-3" />
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
