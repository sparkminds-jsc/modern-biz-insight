
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit, ArrowUpDown } from 'lucide-react';

interface TeamTableProps {
  data: any[];
  onViewDetail: (report: any) => void;
  onEdit: (report: any) => void;
}

export function TeamTable({ data, onViewDetail, onEdit }: TeamTableProps) {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const formatCurrency = (amount: number) => {
    const rounded = Math.round(amount);
    return rounded.toLocaleString('vi-VN');
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
            <SortableHeader field="year">Năm</SortableHeader>
            <SortableHeader field="month">Tháng</SortableHeader>
            <SortableHeader field="final_bill">Final Bill</SortableHeader>
            <SortableHeader field="final_pay">Final Pay</SortableHeader>
            <SortableHeader field="final_save">Final Save</SortableHeader>
            <SortableHeader field="final_earn">Final Earn</SortableHeader>
            <SortableHeader field="storage_usd">Lưu trữ USD</SortableHeader>
            <SortableHeader field="storage_usdt">Lưu trữ USDT</SortableHeader>
            <TableHead>Chú thích</TableHead>
            <TableHead className="w-32">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>{String(item.month).padStart(2, '0')}</TableCell>
              <TableCell>{formatCurrency(item.final_bill)}</TableCell>
              <TableCell>{formatCurrency(item.final_pay)}</TableCell>
              <TableCell>{formatCurrency(item.final_save)}</TableCell>
              <TableCell>{formatCurrency(item.final_earn)}</TableCell>
              <TableCell>{formatCurrency(item.storage_usd)}</TableCell>
              <TableCell>{formatCurrency(item.storage_usdt)}</TableCell>
              <TableCell className="max-w-32 truncate">
                {item.notes || '-'}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetail(item)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(item)}
                  >
                    <Edit className="h-3 w-3" />
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
