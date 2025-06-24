
import { Eye, CheckCircle, Trash2 } from 'lucide-react';
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
  onComplete: (salarySheet: SalarySheet) => void;
  onDelete: (salarySheet: SalarySheet) => void;
}

export function SalaryTable({ salarySheets, onViewDetails, onComplete, onDelete }: SalaryTableProps) {
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
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Tổng lương net chi trả</TableHead>
            <TableHead className="text-right">Tổng thuế TNCN chi trả</TableHead>
            <TableHead className="text-right">Tổng BH công ty đóng</TableHead>
            <TableHead className="text-right">Tổng BH cá nhân đóng</TableHead>
            <TableHead className="text-right">Tổng toàn bộ chi trả</TableHead>
            <TableHead className="w-48">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salarySheets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-gray-500 py-8">
                Không có dữ liệu bảng lương
              </TableCell>
            </TableRow>
          ) : (
            salarySheets.map((sheet, index) => (
              <TableRow key={sheet.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{sheet.year}</TableCell>
                <TableCell>{sheet.month.toString().padStart(2, '0')}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sheet.status === 'Hoàn thành' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sheet.status}
                  </span>
                </TableCell>
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
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(sheet)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Chi tiết
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onComplete(sheet)}
                      disabled={sheet.status === 'Hoàn thành'}
                      className={sheet.status === 'Hoàn thành' ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Hoàn thành
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(sheet)}
                      disabled={sheet.status === 'Hoàn thành'}
                      className={sheet.status === 'Hoàn thành' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 hover:text-red-600'}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
