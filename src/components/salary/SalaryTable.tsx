
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SalarySheet } from '@/types/salary';

interface SalaryTableProps {
  salarySheets: SalarySheet[];
  onViewDetails: (salarySheet: SalarySheet) => void;
}

export function SalaryTable({ salarySheets, onViewDetails }: SalaryTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">STT</TableHead>
            <TableHead>Năm</TableHead>
            <TableHead>Tháng</TableHead>
            <TableHead className="text-right">Tổng lương net chi trả</TableHead>
            <TableHead className="text-right">Tổng thuế TNCN chi trả</TableHead>
            <TableHead className="text-right">Tổng BH công ty đóng</TableHead>
            <TableHead className="text-right">Tổng BH cá nhân đóng</TableHead>
            <TableHead className="text-right">Tổng toàn bộ chi trả</TableHead>
            <TableHead className="w-24">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salarySheets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                Không có dữ liệu bảng lương
              </TableCell>
            </TableRow>
          ) : (
            salarySheets.map((sheet, index) => (
              <TableRow key={sheet.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{sheet.year}</TableCell>
                <TableCell>{sheet.month.toString().padStart(2, '0')}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(sheet.total_net_salary)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(sheet.total_personal_income_tax)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(sheet.total_company_insurance)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(sheet.total_personal_insurance)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(sheet.total_payment)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(sheet)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
