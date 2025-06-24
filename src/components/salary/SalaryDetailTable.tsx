
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SalaryDetail } from '@/types/salary';
import { SortableTableHeader } from './SortableTableHeader';
import { SalaryTableRow } from './SalaryTableRow';

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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">STT</TableHead>
              <SortableTableHeader field="employee_code" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Mã NV</SortableTableHeader>
              <SortableTableHeader field="employee_name" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Tên nhân viên</SortableTableHeader>
              <SortableTableHeader field="team" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Team</SortableTableHeader>
              <SortableTableHeader field="month" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Tháng</SortableTableHeader>
              <SortableTableHeader field="year" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Năm</SortableTableHeader>
              <SortableTableHeader field="gross_salary" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Lương Gross</SortableTableHeader>
              <SortableTableHeader field="working_days" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Ngày công</SortableTableHeader>
              <SortableTableHeader field="daily_rate" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Mức lương/Ngày</SortableTableHeader>
              <SortableTableHeader field="daily_salary" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Tiền lương theo ngày công</SortableTableHeader>
              <SortableTableHeader field="kpi_bonus" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Thưởng KPI</SortableTableHeader>
              <SortableTableHeader field="overtime_1_5" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Tăng ca 1.5</SortableTableHeader>
              <SortableTableHeader field="overtime_2" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Tăng ca 2</SortableTableHeader>
              <SortableTableHeader field="overtime_3" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Tăng ca 3</SortableTableHeader>
              <SortableTableHeader field="total_income" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Tổng thu nhập</SortableTableHeader>
              <SortableTableHeader field="insurance_base_amount" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Mức đóng BH</SortableTableHeader>
              <SortableTableHeader field="bhdn_bhxh" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>BHDN (BHXH-17%)</SortableTableHeader>
              <SortableTableHeader field="bhdn_tnld" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>BHDN (TNLD-0.5%)</SortableTableHeader>
              <SortableTableHeader field="bhdn_bhyt" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>BHDN (BHYT-3%)</SortableTableHeader>
              <SortableTableHeader field="bhdn_bhtn" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>BHDN (BHTN-1%)</SortableTableHeader>
              <SortableTableHeader field="total_bhdn" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Tổng BHDN</SortableTableHeader>
              <SortableTableHeader field="total_company_payment" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Tổng DN chi trả</SortableTableHeader>
              <SortableTableHeader field="bhnld_bhxh" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>BHNLD (BHXH-8%)</SortableTableHeader>
              <SortableTableHeader field="bhnld_bhyt" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>BHNLD (BHYT-1.5%)</SortableTableHeader>
              <SortableTableHeader field="bhnld_bhtn" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>BHNLD (BHTN-1%)</SortableTableHeader>
              <SortableTableHeader field="total_bhnld" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Tổng BHNLD</SortableTableHeader>
              <SortableTableHeader field="personal_deduction" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Giảm trừ bản thân</SortableTableHeader>
              <SortableTableHeader field="dependent_count" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Số người phụ thuộc</SortableTableHeader>
              <SortableTableHeader field="dependent_deduction" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Giảm trừ người phụ thuộc</SortableTableHeader>
              <SortableTableHeader field="insurance_deduction" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Giảm trừ bảo hiểm</SortableTableHeader>
              <SortableTableHeader field="total_deduction" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Tổng giảm trừ</SortableTableHeader>
              <SortableTableHeader field="taxable_income" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Thu nhập chịu thuế</SortableTableHeader>
              <SortableTableHeader field="tax_5_percent" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>TNCN 5% (0-5tr)</SortableTableHeader>
              <SortableTableHeader field="tax_10_percent" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>TNCN 10% (5-10tr)</SortableTableHeader>
              <SortableTableHeader field="tax_15_percent" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>TNCN 15% (10-18tr)</SortableTableHeader>
              <SortableTableHeader field="tax_20_percent" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>TNCN 20% (18-32tr)</SortableTableHeader>
              <SortableTableHeader field="tax_25_percent" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>TNCN 25% (32-52tr)</SortableTableHeader>
              <SortableTableHeader field="tax_30_percent" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>TNCN 30% (52-80tr)</SortableTableHeader>
              <SortableTableHeader field="tax_35_percent" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>TNCN 35% (>80tr)</SortableTableHeader>
              <SortableTableHeader field="total_personal_income_tax" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Tổng thuế TNCN</SortableTableHeader>
              <SortableTableHeader field="net_salary" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Lương Net</SortableTableHeader>
              <SortableTableHeader field="advance_payment" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Tạm Ứng</SortableTableHeader>
              <SortableTableHeader field="actual_payment" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Thực nhận</SortableTableHeader>
              <TableHead className="w-32">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDetails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={41} className="text-center text-gray-500 py-8">
                  Không có dữ liệu chi tiết lương
                </TableCell>
              </TableRow>
            ) : (
              sortedDetails.map((detail, index) => (
                <SalaryTableRow
                  key={detail.id}
                  detail={detail}
                  index={index}
                  onViewDetail={onViewDetail}
                  onEdit={onEdit}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
