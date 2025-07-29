
import { TableCell, TableRow } from '@/components/ui/table';
import { SalaryDetail } from '@/types/salary';
import { SalaryTableActions } from './SalaryTableActions';

interface SalaryTableRowProps {
  detail: SalaryDetail;
  index: number;
  onViewDetail: (detail: SalaryDetail) => void;
  onEdit: (detail: SalaryDetail) => void;
  onDelete: (detail: SalaryDetail) => void;
  onToggleLock: (detail: SalaryDetail) => void;
}

export function SalaryTableRow({ detail, index, onViewDetail, onEdit, onDelete, onToggleLock }: SalaryTableRowProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Math.round(amount));
  };

  const formatNumber = (amount: number) => {
    return Math.round(amount).toLocaleString('vi-VN');
  };

  // Determine salary type based on insurance_base_amount
  const isSalaryWithInsurance = detail.insurance_base_amount > 0;
  const salaryType = isSalaryWithInsurance ? 'Lương có BH' : 'Lương thời vụ';

  return (
    <TableRow className={detail.is_locked ? "bg-green-100" : ""}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{detail.employee_code}</TableCell>
      <TableCell>{detail.employee_name}</TableCell>
      <TableCell>{detail.team}</TableCell>
      <TableCell>{salaryType}</TableCell>
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
      <TableCell className="text-right">{formatCurrency(detail.insurance_base_amount)}</TableCell>
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
        <SalaryTableActions
          detail={detail}
          onViewDetail={onViewDetail}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleLock={onToggleLock}
        />
      </TableCell>
    </TableRow>
  );
}
