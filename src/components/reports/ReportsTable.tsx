
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ReportsTableProps {
  data: any[];
  onViewRevenue: (revenue: any) => void;
  onViewExpense: (expense: any) => void;
}

export function ReportsTable({ data, onViewRevenue, onViewExpense }: ReportsTableProps) {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const formatCurrency = (amount: number, isExpense: boolean = false) => {
    const rounded = Math.round(amount);
    const prefix = isExpense ? '-' : '';
    return `${prefix}${rounded.toLocaleString('vi-VN')}`;
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

  const handleViewDetail = (item: any) => {
    if (item.type === 'revenue') {
      onViewRevenue(item);
    } else {
      onViewExpense(item);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Số TT</TableHead>
            <SortableHeader field="created_date">Ngày thu chi</SortableHeader>
            <SortableHeader field="content">Nội dung thu chi</SortableHeader>
            <SortableHeader field="type">Nhãn</SortableHeader>
            <SortableHeader field="category">Loại thu chi</SortableHeader>
            <SortableHeader field="amount_vnd">Số tiền VND</SortableHeader>
            <SortableHeader field="amount_usd">Số tiền USD</SortableHeader>
            <SortableHeader field="amount_usdt">Số tiền USDT</SortableHeader>
            <SortableHeader field="wallet_type">Từ Ví</SortableHeader>
            <TableHead>Chú thích</TableHead>
            <TableHead className="w-24">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item, index) => (
            <TableRow key={`${item.type}-${item.id}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {format(new Date(item.created_date), 'dd/MM/yyyy', { locale: vi })}
              </TableCell>
              <TableCell className="max-w-48 truncate">{item.content}</TableCell>
              <TableCell>
                <Badge variant={item.type === 'revenue' ? 'default' : 'destructive'}>
                  {item.type === 'revenue' ? 'Doanh Thu' : 'Chi Phí'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{item.category}</Badge>
              </TableCell>
              <TableCell>
                {formatCurrency(item.amount_vnd, item.type === 'expense')}
              </TableCell>
              <TableCell>
                {formatCurrency(item.amount_usd, item.type === 'expense')}
              </TableCell>
              <TableCell>
                {formatCurrency(item.amount_usdt, item.type === 'expense')}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{item.wallet_type}</Badge>
              </TableCell>
              <TableCell className="max-w-32 truncate">
                {item.type === 'expense' ? (item.notes || '-') : '-'}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDetail(item)}
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
