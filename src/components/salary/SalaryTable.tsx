
import { Eye, CheckCircle, Trash2, Mail } from 'lucide-react';
import { useState } from 'react';
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
import { ConfirmDialog } from './ConfirmDialog';

interface SalaryTableProps {
  salarySheets: SalarySheet[];
  onViewDetails: (salarySheet: SalarySheet) => void;
  onComplete: (salarySheet: SalarySheet) => void;
  onDelete: (salarySheet: SalarySheet) => void;
  onSendMail: (salarySheet: SalarySheet) => void;
}

export function SalaryTable({ salarySheets, onViewDetails, onComplete, onDelete, onSendMail }: SalaryTableProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'sendMail' | 'complete' | null;
    salarySheet: SalarySheet | null;
  }>({
    isOpen: false,
    type: null,
    salarySheet: null,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleSendMailClick = (salarySheet: SalarySheet) => {
    setConfirmDialog({
      isOpen: true,
      type: 'sendMail',
      salarySheet,
    });
  };

  const handleCompleteClick = (salarySheet: SalarySheet) => {
    setConfirmDialog({
      isOpen: true,
      type: 'complete',
      salarySheet,
    });
  };

  const handleConfirm = () => {
    if (confirmDialog.salarySheet) {
      if (confirmDialog.type === 'sendMail') {
        onSendMail(confirmDialog.salarySheet);
      } else if (confirmDialog.type === 'complete') {
        onComplete(confirmDialog.salarySheet);
      }
    }
    setConfirmDialog({ isOpen: false, type: null, salarySheet: null });
  };

  const handleCloseDialog = () => {
    setConfirmDialog({ isOpen: false, type: null, salarySheet: null });
  };

  const getDialogContent = () => {
    if (confirmDialog.type === 'sendMail') {
      return {
        title: 'Xác nhận gửi email',
        description: `Bạn có chắc chắn muốn gửi email thông báo lương tháng ${confirmDialog.salarySheet?.month}/${confirmDialog.salarySheet?.year} cho tất cả nhân viên?`,
      };
    } else if (confirmDialog.type === 'complete') {
      return {
        title: 'Xác nhận hoàn thành',
        description: `Bạn có chắc chắn muốn hoàn thành bảng lương tháng ${confirmDialog.salarySheet?.month}/${confirmDialog.salarySheet?.year}?`,
      };
    }
    return { title: '', description: '' };
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
            <TableHead className="w-64">Action</TableHead>
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
                  <div className="flex gap-1 flex-wrap">
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
                      onClick={() => handleCompleteClick(sheet)}
                      disabled={sheet.status === 'Hoàn thành' || !sheet.email_sent}
                      className={sheet.status === 'Hoàn thành' || !sheet.email_sent ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Hoàn thành
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMailClick(sheet)}
                      disabled={sheet.email_sent || sheet.status === 'Hoàn thành'}
                      className={`${sheet.email_sent || sheet.status === 'Hoàn thành' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 hover:text-blue-600'}`}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      {sheet.email_sent ? 'Đã gửi mail' : 'Gửi mail'}
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

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        {...getDialogContent()}
      />
    </div>
  );
}
