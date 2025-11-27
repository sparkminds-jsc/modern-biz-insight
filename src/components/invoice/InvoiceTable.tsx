
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Eye, FileText, Edit, Trash2 } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';

interface InvoiceTableProps {
  invoices: Invoice[];
  onViewDetail: (invoice: Invoice) => void;
  onExportPDF: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
}

type SortField = keyof Invoice;
type SortDirection = 'asc' | 'desc';

export function InvoiceTable({ invoices, onViewDetail, onExportPDF, onEdit, onDelete }: InvoiceTableProps) {
  const [sortField, setSortField] = useState<SortField>('created_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ' + currency;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => handleSort('customer_name')}
            >
              <div className="flex items-center gap-2">
                Tên khách hàng
                <SortIcon field="customer_name" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => handleSort('invoice_name')}
            >
              <div className="flex items-center gap-2">
                Tên Invoice
                <SortIcon field="invoice_name" />
              </div>
            </TableHead>
            <TableHead>Dự án</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => handleSort('created_date')}
            >
              <div className="flex items-center gap-2">
                Ngày Tạo
                <SortIcon field="created_date" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => handleSort('due_date')}
            >
              <div className="flex items-center gap-2">
                Ngày Đến Hạn
                <SortIcon field="due_date" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-2">
                Trạng thái
                <SortIcon field="status" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => handleSort('total_amount')}
            >
              <div className="flex items-center gap-2">
                Tổng tiền
                <SortIcon field="total_amount" />
              </div>
            </TableHead>
            <TableHead>Đơn vị thanh toán</TableHead>
            <TableHead>Quy đổi VND</TableHead>
            <TableHead>Là Crypto</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => handleSort('payment_status')}
            >
              <div className="flex items-center gap-2">
                Thu Tiền
                <SortIcon field="payment_status" />
              </div>
            </TableHead>
            <TableHead>Còn thiếu</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.customer_name}</TableCell>
              <TableCell>{invoice.invoice_name}</TableCell>
              <TableCell>{getProjectName(invoice.project_id)}</TableCell>
              <TableCell>{formatDate(invoice.created_date)}</TableCell>
              <TableCell>{formatDate(invoice.due_date)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  invoice.status === 'Mới tạo' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : invoice.status === 'Đã xuất hóa đơn'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {invoice.status}
                </span>
              </TableCell>
              <TableCell>{formatAmount(invoice.total_amount, invoice.payment_unit)}</TableCell>
              <TableCell>{invoice.payment_unit}</TableCell>
              <TableCell>
                {(() => {
                  if (invoice.payment_unit === 'VND') {
                    return new Intl.NumberFormat('vi-VN').format(invoice.total_amount) + ' VND';
                  } else if (invoice.payment_unit === 'USD' && invoice.vnd_exchange_rate) {
                    return new Intl.NumberFormat('vi-VN').format(invoice.total_amount * invoice.vnd_exchange_rate) + ' VND';
                  }
                  return '-';
                })()}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  invoice.is_crypto 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {invoice.is_crypto ? 'Đúng' : 'Không'}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  invoice.payment_status === 'Chưa thu' 
                    ? 'bg-red-100 text-red-800' 
                    : invoice.payment_status === 'Đã thu đủ'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {invoice.payment_status}
                </span>
              </TableCell>
              <TableCell>
                {formatAmount(invoice.remaining_amount, invoice.payment_unit)}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetail(invoice)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onExportPDF(invoice)}
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(invoice)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(invoice.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {sortedInvoices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không có dữ liệu invoice
        </div>
      )}
    </div>
  );
}
