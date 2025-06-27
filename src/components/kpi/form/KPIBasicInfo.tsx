
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Employee, CalculatedValues } from './kpiFormTypes';

interface KPIBasicInfoProps {
  employees: Employee[];
  employeeCode: string;
  onEmployeeCodeChange: (value: string) => void;
  calculatedValues: CalculatedValues;
  isEditMode: boolean;
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export function KPIBasicInfo({
  employees,
  employeeCode,
  onEmployeeCodeChange,
  calculatedValues,
  isEditMode,
  month,
  year,
  onMonthChange,
  onYearChange
}: KPIBasicInfoProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="employee_code">Mã nhân viên *</Label>
        <Select
          value={employeeCode}
          onValueChange={onEmployeeCodeChange}
          disabled={isEditMode}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn nhân viên" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.employee_code}>
                {employee.employee_code} - {employee.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="month">Tháng *</Label>
        <Select
          value={month.toString()}
          onValueChange={(value) => onMonthChange(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn tháng" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {months.map((m) => (
              <SelectItem key={m} value={m.toString()}>
                Tháng {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">Năm *</Label>
        <Select
          value={year.toString()}
          onValueChange={(value) => onYearChange(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn năm" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Lệch KPI</Label>
        <Input
          value={calculatedValues.hasKPIGap ? 'Có' : 'Không'}
          readOnly
          className="bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <Label>Lương căn bản</Label>
        <Input
          value={formatCurrency(calculatedValues.basicSalary)}
          readOnly
          className="bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <Label>KPI</Label>
        <Input
          value={formatCurrency(calculatedValues.kpi)}
          readOnly
          className="bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <Label>Tổng KPI trong tháng</Label>
        <Input
          value={formatCurrency(calculatedValues.totalMonthlyKPI)}
          readOnly
          className="bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <Label>Tổng Lương</Label>
        <Input
          value={formatCurrency(calculatedValues.totalSalary)}
          readOnly
          className="bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <Label>Hệ số lương</Label>
        <Input
          value={calculatedValues.salaryCoefficient}
          readOnly
          className="bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <Label>Hệ số KPI</Label>
        <Input
          value={calculatedValues.kpiCoefficient}
          readOnly
          className="bg-gray-100"
        />
      </div>
    </div>
  );
}
