
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, CheckCircle, ArrowUpDown, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ExpenseTableProps {
  data: any[];
  onViewDetail: (expense: any) => void;
  onEdit: (expense: any) => void;
  onFinalize: (expense: any) => void;
}

export function ExpenseTable({ data, onViewDetail, onEdit, onFinalize }: ExpenseTableProps) {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Số TT</TableHead>
            <SortableHeader field="created_date">Ngày tạo chi phí</SortableHeader>
            <SortableHeader field="content">Nội dung chi phí</SortableHeader>
            <SortableHeader field="expense_type">Loại Chi Phí</SortableHeader>
            <SortableHeader field="amount_vnd">Số tiền VND</SortableHeader>
            <SortableHeader field="amount_usd">Số tiền USD</SortableHeader>
            <SortableHeader field="amount_usdt">Số tiền USDT</SortableHeader>
            <SortableHeader field="wallet_type">Từ Ví</SortableHeader>
            <SortableHeader field="notes">Chú thích</SortableHeader>
            <TableHead>Hóa đơn</TableHead>
            <TableHead className="w-32">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((expense, index) => (
            <TableRow key={expense.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {format(new Date(expense.created_date), 'dd/MM/yyyy', { locale: vi })}
              </TableCell>
              <TableCell className="max-w-48 truncate">{expense.content}</TableCell>
              <TableCell>
                <Badge variant="secondary">{expense.expense_type}</Badge>
              </TableCell>
              <TableCell>{formatCurrency(expense.amount_vnd)}</TableCell>
              <TableCell>{formatCurrency(expense.amount_usd)}</TableCell>
              <TableCell>{formatCurrency(expense.amount_usdt)}</TableCell>
              <TableCell>
                <Badge variant="outline">{expense.wallet_type}</Badge>
              </TableCell>
              <TableCell className="max-w-32 truncate">{expense.notes || '-'}</TableCell>
              <TableCell>
                {expense.invoice_files && expense.invoice_files.length > 0 ? (
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="text-sm">{expense.invoice_files.length}</span>
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetail(expense)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(expense)}
                    disabled={expense.is_finalized}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onFinalize(expense)}
                    disabled={expense.is_finalized}
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
