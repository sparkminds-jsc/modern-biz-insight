import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { formatCurrency } from '@/utils/numberFormat';

interface ProjectBillData {
  projectName: string;
  year: number;
  month: number;
  team: string;
  billVnd: number;
  billUsd: number;
  billUsdt: number;
  earnVnd: number;
  earnUsdt: number;
  usdEquivalent?: number;
}

interface ProjectBillTableProps {
  data: ProjectBillData[];
  exchangeRate?: number;
}

export function ProjectBillTable({ data, exchangeRate = 25000 }: ProjectBillTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const getMonthName = (month: number) => {
    const months = [
      'Tháng 01', 'Tháng 02', 'Tháng 03', 'Tháng 04',
      'Tháng 05', 'Tháng 06', 'Tháng 07', 'Tháng 08',
      'Tháng 09', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[month - 1] || `Tháng ${month}`;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxVisible; i++) pages.push(i);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pages.push(i);
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
      }
    }
    return pages;
  };

  // Reset to page 1 when data changes
  const dataLength = data.length;
  if (currentPage > 1 && startIndex >= dataLength) {
    setCurrentPage(1);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-16">STT</TableHead>
              <TableHead>Tên dự án</TableHead>
              <TableHead>Năm</TableHead>
              <TableHead>Tháng</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">Bill VND</TableHead>
              <TableHead className="text-right">USD Tương đương</TableHead>
              <TableHead className="text-right">Bill USD</TableHead>
              <TableHead className="text-right">Bill USDT</TableHead>
              <TableHead className="text-right">Earn VND</TableHead>
              <TableHead className="text-right">Earn USDT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow key={`${item.projectName}-${item.year}-${item.month}-${item.team}`}>
                  <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                  <TableCell>{item.projectName}</TableCell>
                  <TableCell>{item.year}</TableCell>
                  <TableCell>{getMonthName(item.month)}</TableCell>
                  <TableCell>{item.team}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.billVnd, 'VND')}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.billVnd / exchangeRate, 'USD')}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.billUsd, 'USD')}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.billUsdt, 'USDT')}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.earnVnd, 'VND')}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.earnUsdt, 'USDT')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Hiển thị {startIndex + 1} - {Math.min(endIndex, data.length)} / {data.length} bản ghi
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {getVisiblePages().map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}