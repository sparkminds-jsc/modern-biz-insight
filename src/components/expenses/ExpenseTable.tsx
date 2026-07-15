
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, CheckCircle, ArrowUpDown, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExpenseTableProps {
  data: any[];
  onViewDetail: (expense: any) => void;
  onEdit: (expense: any) => void;
  onFinalize: (expense: any) => void;
  expenseTypes?: string[];
  onRefresh?: () => void;
  onFinalizeAll?: () => void;
}

export function ExpenseTable({ data, onViewDetail, onEdit, onFinalize, expenseTypes = [], onRefresh, onFinalizeAll }: ExpenseTableProps) {
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

  const handleTypeChange = async (expense: any, newType: string) => {
    if (newType === expense.expense_type) return;
    try {
      const { error } = await supabase
        .from('expenses')
        .update({ expense_type: newType })
        .eq('id', expense.id);
      if (error) throw error;
      toast.success('Đã cập nhật loại chi phí');
      onRefresh?.();
    } catch (e) {
      console.error(e);
      toast.error('Không thể cập nhật loại chi phí');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Số TT</TableHead>
            <SortableHeader field="created_date">Ngày tạo chi phí</SortableHeader>
            <SortableHeader field="transaction_number">Số GD</SortableHeader>
            <SortableHeader field="content">Nội dung chi phí</SortableHeader>
            <SortableHeader field="expense_type">Loại Chi Phí</SortableHeader>
            <SortableHeader field="amount_vnd">Số tiền VND</SortableHeader>
            <SortableHeader field="amount_usd">Số tiền USD</SortableHeader>
            <SortableHeader field="amount_usdt">Số tiền USDT</SortableHeader>
            <SortableHeader field="wallet_type">Từ Ví</SortableHeader>
            <SortableHeader field="notes">Chú thích</SortableHeader>
            <TableHead>Hóa đơn</TableHead>
            <TableHead className="w-52">
              <div className="flex items-center justify-between gap-2">
                <span>Action</span>
                {onFinalizeAll && (
                  <Button size="sm" variant="default" onClick={onFinalizeAll}>
                    Chốt tất cả
                  </Button>
                )}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((expense, index) => (
            <TableRow key={expense.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {format(new Date(expense.created_date), 'dd/MM/yyyy', { locale: vi })}
              </TableCell>
              <TableCell className="text-sm">{expense.transaction_number || '-'}</TableCell>
              <TableCell className="max-w-96 whitespace-normal break-words">{expense.content}</TableCell>
              <TableCell>
                {expense.is_finalized ? (
                  <Badge variant="secondary">{expense.expense_type}</Badge>
                ) : (
                  <Select
                    value={expense.expense_type}
                    onValueChange={(v) => handleTypeChange(expense, v)}
                  >
                    <SelectTrigger className="h-8 w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(expenseTypes.includes(expense.expense_type) ? expenseTypes : [expense.expense_type, ...expenseTypes]).map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
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
