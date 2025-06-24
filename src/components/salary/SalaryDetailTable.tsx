
import { useState } from 'react';
import { Eye, Edit, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SalaryDetail } from '@/types/salary';

interface SalaryDetailTableProps {
  salaryDetails: SalaryDetail[];
  onViewDetail: (detail: SalaryDetail) => void;
  onEdit: (detail: SalaryDetail) => void;
}

type SortField = keyof SalaryDetail;
type SortDirection = 'asc' | 'desc';

export function SalaryDetailTable({ salaryDetails, onViewDetail, onEdit }: SalaryDetailTableProps) {
  const [sortField, setSortField] = useState<SortField>('employee_code');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Math.round(amount));
  };

  const formatNumber = (amount: number) => {
    return Math.round(amount).toLocaleString('vi-VN');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedDetails = [...salaryDetails].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
        )}
      </div>
    </TableHead>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">STT</TableHead>
              <SortableHeader field="employee_code">Mã NV</SortableHeader>
              <SortableHeader field="employee_name">Tên nhân viên</SortableHeader>
              <SortableHeader field="team">Team</SortableHeader>
              <SortableHeader field="month">Tháng</SortableHeader>
              <SortableHeader field="year">Năm</SortableHeader>
              <SortableHeader field="gross_salary">Lương Gross</SortableHeader>
              <SortableHeader field="working_days">Ngày công</SortableHeader>
              <SortableHeader field="daily_rate">Mức lương/Ngày</SortableHeader>
              <SortableHeader field="daily_salary">Tiền lương theo ngày công</SortableHeader>
              <SortableHeader field="kpi_bonus">Thưởng KPI</SortableHeader>
              <SortableHeader field="overtime_1_5">Tăng ca 1.5</SortableHeader>
              <SortableHeader field="overtime_2">Tăng ca 2</SortableHeader>
              <SortableHeader field="overtime_3">Tăng ca 3</SortableHeader>
              <SortableHeader field="total_income">Tổng thu nhập</SortableHeader>
              <SortableHeader field="bhdn_bhxh">BHDN (BHXH-17%)</SortableHeader>
              <SortableHeader field="bhdn_tnld">BHDN (TNLD-0.5%)</SortableHeader>
              <SortableHeader field="bhdn_bhyt">BHDN (BHYT-3%)</SortableHeader>
              <SortableHeader field="bhdn_bhtn">BHDN (BHTN-1%)</SortableHeader>
              <SortableHeader field="total_bhdn">Tổng BHDN</SortableHeader>
              <SortableHeader field="total_company_payment">Tổng DN chi trả</SortableHeader>
              <SortableHeader field="bhnld_bhxh">BHNLD (BHXH-8%)</SortableHeader>
              <SortableHeader field="bhnld_bhyt">BHNLD (BHYT-1.5%)</SortableHeader>
              <SortableHeader field="bhnld_bhtn">BHNLD (BHTN-1%)</SortableHeader>
              <SortableHeader field="total_bhnld">Tổng BHNLD</SortableHeader>
              <SortableHeader field="personal_deduction">Giảm trừ bản thân</SortableHeader>
              <SortableHeader field="dependent_count">Số người phụ thuộc</SortableHeader>
              <SortableHeader field="dependent_deduction">Giảm trừ người phụ thuộc</SortableHeader>
              <SortableHeader field="insurance_deduction">Giảm trừ bảo hiểm</SortableHeader>
              <SortableHeader field="total_deduction">Tổng giảm trừ</SortableHeader>
              <SortableHeader field="taxable_income">Thu nhập chịu thuế</SortableHeader>
              <SortableHeader field="tax_5_percent">TNCN 5% (0-5tr)</SortableHeader>
              <SortableHeader field="tax_10_percent">TNCN 10% (5-10tr)</SortableHeader>
              <SortableHeader field="tax_15_percent">TNCN 15% (10-18tr)</SortableHeader>
              <SortableHeader field="tax_20_percent">TNCN 20% (18-32tr)</SortableHeader>
              <SortableHeader field="tax_25_percent">TNCN 25% (32-52tr)</SortableHeader>
              <SortableHeader field="tax_30_percent">TNCN 30% (52-80tr)</SortableHeader>
              <SortableHeader field="tax_35_percent">TNCN 35% ({'>'}80tr)</SortableHeader>
              <SortableHeader field="total_personal_income_tax">Tổng thuế TNCN</SortableHeader>
              <SortableHeader field="net_salary">Lương Net</SortableHeader>
              <SortableHeader field="advance_payment">Tạm Ứng</SortableHeader>
              <SortableHeader field="actual_payment">Thực nhận</SortableHeader>
              <TableHead className="w-32">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDetails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={40} className="text-center text-gray-500 py-8">
                  Không có dữ liệu chi tiết lương
                </TableCell>
              </TableRow>
            ) : (
              sortedDetails.map((detail, index) => (
                <TableRow key={detail.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{detail.employee_code}</TableCell>
                  <TableCell>{detail.employee_name}</TableCell>
                  <TableCell>{detail.team}</TableCell>
                  <TableCell>{detail.month.toString().padStart(2, '0')}</TableCell>
                  <TableCell>{detail.year}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.gross_salary)}</TableCell>
                  <TableCell className="text-right">{formatNumber(detail.working_days)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.daily_rate)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.daily_salary)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.kpi_bonus)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.overtime_1_5)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.overtime_2)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.overtime_3)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.total_income)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.bhdn_bhxh)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.bhdn_tnld)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.bhdn_bhyt)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.bhdn_bhtn)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.total_bhdn)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.total_company_payment)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.bhnld_bhxh)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.bhnld_bhyt)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.bhnld_bhtn)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.total_bhnld)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.personal_deduction)}</TableCell>
                  <TableCell className="text-right">{formatNumber(detail.dependent_count)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.dependent_deduction)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.insurance_deduction)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.total_deduction)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.taxable_income)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.tax_5_percent)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.tax_10_percent)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.tax_15_percent)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.tax_20_percent)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.tax_25_percent)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.tax_30_percent)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.tax_35_percent)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.total_personal_income_tax)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.net_salary)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.advance_payment)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(detail.actual_payment)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetail(detail)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Chi tiết
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(detail)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Sửa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
