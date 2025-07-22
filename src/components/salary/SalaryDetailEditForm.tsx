import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import type { SalaryDetail } from '@/types/salary';

interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  team: string;
}

interface SalaryDetailEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  salaryDetail?: SalaryDetail | null;
  salarySheetId: string;
  month: number;
  year: number;
}

interface FormData {
  employee_code: string;
  employee_name: string;
  team: string;
  gross_salary: number;
  salary_type: string;
  working_days: number;
  kpi_bonus: number;
  overtime_1_5: number;
  overtime_2: number;
  overtime_3: number;
  insurance_base_amount: number;
  dependent_count: number;
  advance_payment: number;
}

export function SalaryDetailEditForm({
  isOpen,
  onClose,
  onSave,
  salaryDetail,
  salarySheetId,
  month,
  year
}: SalaryDetailEditFormProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculatedValues, setCalculatedValues] = useState({
    daily_rate: 0,
    daily_salary: 0,
    total_income: 0,
    bhdn_bhxh: 0,
    bhdn_tnld: 0,
    bhdn_bhyt: 0,
    bhdn_bhtn: 0,
    total_bhdn: 0,
    total_company_payment: 0,
    bhnld_bhxh: 0,
    bhnld_bhyt: 0,
    bhnld_bhtn: 0,
    total_bhnld: 0,
    personal_deduction: 11000000,
    dependent_deduction: 0,
    insurance_deduction: 0,
    total_deduction: 0,
    taxable_income: 0,
    tax_5_percent: 0,
    tax_10_percent: 0,
    tax_15_percent: 0,
    tax_20_percent: 0,
    tax_25_percent: 0,
    tax_30_percent: 0,
    tax_35_percent: 0,
    total_personal_income_tax: 0,
    net_salary: 0,
    actual_payment: 0
  });

  const { register, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      employee_code: '',
      employee_name: '',
      team: '',
      gross_salary: 0,
      salary_type: 'Lương có BH',
      working_days: 0,
      kpi_bonus: 0,
      overtime_1_5: 0,
      overtime_2: 0,
      overtime_3: 0,
      insurance_base_amount: 0,
      dependent_count: 0,
      advance_payment: 0
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  useEffect(() => {
    if (salaryDetail && isOpen) {
      reset({
        employee_code: salaryDetail.employee_code,
        employee_name: salaryDetail.employee_name,
        team: salaryDetail.team,
        gross_salary: salaryDetail.gross_salary,
        salary_type: 'Lương có BH', // Default value
        working_days: salaryDetail.working_days,
        kpi_bonus: salaryDetail.kpi_bonus,
        overtime_1_5: salaryDetail.overtime_1_5,
        overtime_2: salaryDetail.overtime_2,
        overtime_3: salaryDetail.overtime_3,
        insurance_base_amount: salaryDetail.insurance_base_amount,
        dependent_count: salaryDetail.dependent_count,
        advance_payment: salaryDetail.advance_payment
      });
    }
  }, [salaryDetail, isOpen, reset]);

  useEffect(() => {
    calculateValues();
  }, [watchedValues]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, employee_code, full_name, team')
        .eq('status', 'Đang làm')
        .order('employee_code');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách nhân viên',
        variant: 'destructive',
      });
    }
  };

  const handleEmployeeChange = (employeeCode: string) => {
    const employee = employees.find(emp => emp.employee_code === employeeCode);
    if (employee) {
      setValue('employee_code', employee.employee_code);
      setValue('employee_name', employee.full_name);
      setValue('team', employee.team);
    }
  };

  const calculateValues = () => {
    const values = watchedValues;
    
    // Mức lương/Ngày = Lương Gross / 22
    const daily_rate = values.gross_salary / 22;
    
    // Tiền lương theo ngày công = Mức lương/Ngày * Ngày công
    const daily_salary = daily_rate * values.working_days;
    
    // Tổng thu nhập
    const total_income = daily_salary + values.kpi_bonus + values.overtime_1_5 + values.overtime_2 + values.overtime_3;
    
    // BHDN calculations (based on insurance_base_amount and only if "Lương có BH")
    const isSalaryWithInsurance = values.salary_type === 'Lương có BH';
    const bhdn_bhxh = isSalaryWithInsurance ? values.insurance_base_amount * 0.17 : 0;
    const bhdn_tnld = isSalaryWithInsurance ? values.insurance_base_amount * 0.005 : 0;
    const bhdn_bhyt = isSalaryWithInsurance ? values.insurance_base_amount * 0.03 : 0;
    // Update BHTN calculation to use gross_salary * 0.01
    const bhdn_bhtn = isSalaryWithInsurance ? values.gross_salary * 0.01 : 0;
    const total_bhdn = bhdn_bhxh + bhdn_tnld + bhdn_bhyt + bhdn_bhtn;
    
    // Tổng DN chi trả
    const total_company_payment = total_income + total_bhdn;
    
    // BHNLD calculations (based on insurance_base_amount and only if "Lương có BH")
    const bhnld_bhxh = isSalaryWithInsurance ? values.insurance_base_amount * 0.08 : 0;
    const bhnld_bhyt = isSalaryWithInsurance ? values.insurance_base_amount * 0.015 : 0;
    // Update BHNLD BHTN calculation to use gross_salary * 0.01
    const bhnld_bhtn = isSalaryWithInsurance ? values.gross_salary * 0.01 : 0;
    const total_bhnld = bhnld_bhxh + bhnld_bhyt + bhnld_bhtn;
    
    // Giảm trừ calculations
    const dependent_deduction = values.dependent_count * 4400000;
    const insurance_deduction = total_bhnld;
    const total_deduction = 11000000 + dependent_deduction + insurance_deduction; // 11tr là giảm trừ bản thân
    
    // Thu nhập chịu thuế - Đặc biệt cho Lương thời vụ
    let taxable_income;
    let total_personal_income_tax;
    let tax_5_percent = 0;
    let tax_10_percent = 0;
    let tax_15_percent = 0;
    let tax_20_percent = 0;
    let tax_25_percent = 0;
    let tax_30_percent = 0;
    let tax_35_percent = 0;
    
    if (values.salary_type === 'Lương thời vụ') {
      // Với Lương thời vụ: Thu nhập chịu thuế = 0, Thuế TNCN = 10% * Tổng thu nhập
      taxable_income = 0;
      total_personal_income_tax = total_income * 0.10;
    } else {
      // Logic thuế bình thường cho Lương có BH
      taxable_income = Math.max(0, total_income - total_deduction);
      
      if (taxable_income > 0) {
        // 5% bracket (0-5M)
        tax_5_percent = Math.min(taxable_income, 5000000) * 0.05;
        
        // 10% bracket (5M-10M)
        if (taxable_income > 5000000) {
          tax_10_percent = Math.min(taxable_income - 5000000, 5000000) * 0.10;
        }
        
        // 15% bracket (10M-18M)
        if (taxable_income > 10000000) {
          tax_15_percent = Math.min(taxable_income - 10000000, 8000000) * 0.15;
        }
        
        // 20% bracket (18M-32M)
        if (taxable_income > 18000000) {
          tax_20_percent = Math.min(taxable_income - 18000000, 14000000) * 0.20;
        }
        
        // 25% bracket (32M-52M)
        if (taxable_income > 32000000) {
          tax_25_percent = Math.min(taxable_income - 32000000, 20000000) * 0.25;
        }
        
        // 30% bracket (52M-80M)
        if (taxable_income > 52000000) {
          tax_30_percent = Math.min(taxable_income - 52000000, 28000000) * 0.30;
        }
        
        // 35% bracket (>80M)
        if (taxable_income > 80000000) {
          tax_35_percent = (taxable_income - 80000000) * 0.35;
        }
      }
      
      total_personal_income_tax = tax_5_percent + tax_10_percent + tax_15_percent + tax_20_percent + tax_25_percent + tax_30_percent + tax_35_percent;
    }
    
    // Lương Net
    const net_salary = total_income - total_bhnld - total_personal_income_tax;
    
    // Thực nhận
    const actual_payment = net_salary - values.advance_payment;
    
    setCalculatedValues({
      daily_rate,
      daily_salary,
      total_income,
      bhdn_bhxh,
      bhdn_tnld,
      bhdn_bhyt,
      bhdn_bhtn,
      total_bhdn,
      total_company_payment,
      bhnld_bhxh,
      bhnld_bhyt,
      bhnld_bhtn,
      total_bhnld,
      personal_deduction: 11000000,
      dependent_deduction,
      insurance_deduction,
      total_deduction,
      taxable_income,
      tax_5_percent,
      tax_10_percent,
      tax_15_percent,
      tax_20_percent,
      tax_25_percent,
      tax_30_percent,
      tax_35_percent,
      total_personal_income_tax,
      net_salary,
      actual_payment
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Math.round(amount));
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      const salaryDetailData = {
        salary_sheet_id: salarySheetId,
        employee_code: data.employee_code,
        employee_name: data.employee_name,
        team: data.team,
        month,
        year,
        gross_salary: data.gross_salary,
        working_days: data.working_days,
        daily_rate: calculatedValues.daily_rate,
        daily_salary: calculatedValues.daily_salary,
        kpi_bonus: data.kpi_bonus,
        overtime_1_5: data.overtime_1_5,
        overtime_2: data.overtime_2,
        overtime_3: data.overtime_3,
        total_income: calculatedValues.total_income,
        insurance_base_amount: data.insurance_base_amount,
        bhdn_bhxh: calculatedValues.bhdn_bhxh,
        bhdn_tnld: calculatedValues.bhdn_tnld,
        bhdn_bhyt: calculatedValues.bhdn_bhyt,
        bhdn_bhtn: calculatedValues.bhdn_bhtn,
        total_bhdn: calculatedValues.total_bhdn,
        total_company_payment: calculatedValues.total_company_payment,
        bhnld_bhxh: calculatedValues.bhnld_bhxh,
        bhnld_bhyt: calculatedValues.bhnld_bhyt,
        bhnld_bhtn: calculatedValues.bhnld_bhtn,
        total_bhnld: calculatedValues.total_bhnld,
        personal_deduction: calculatedValues.personal_deduction,
        dependent_count: data.dependent_count,
        dependent_deduction: calculatedValues.dependent_deduction,
        insurance_deduction: calculatedValues.insurance_deduction,
        total_deduction: calculatedValues.total_deduction,
        taxable_income: calculatedValues.taxable_income,
        tax_5_percent: calculatedValues.tax_5_percent,
        tax_10_percent: calculatedValues.tax_10_percent,
        tax_15_percent: calculatedValues.tax_15_percent,
        tax_20_percent: calculatedValues.tax_20_percent,
        tax_25_percent: calculatedValues.tax_25_percent,
        tax_30_percent: calculatedValues.tax_30_percent,
        tax_35_percent: calculatedValues.tax_35_percent,
        total_personal_income_tax: calculatedValues.total_personal_income_tax,
        net_salary: calculatedValues.net_salary,
        advance_payment: data.advance_payment,
        actual_payment: calculatedValues.actual_payment
      };

      if (salaryDetail) {
        // Update existing
        const { error } = await supabase
          .from('salary_details')
          .update(salaryDetailData)
          .eq('id', salaryDetail.id);

        if (error) throw error;
        
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật lương nhân viên',
        });
      } else {
        // Create new
        const { error } = await supabase
          .from('salary_details')
          .insert(salaryDetailData);

        if (error) throw error;
        
        toast({
          title: 'Thành công',
          description: 'Đã thêm lương nhân viên',
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving salary detail:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu thông tin lương',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {salaryDetail ? 'Chỉnh sửa lương nhân viên' : 'Thêm lương nhân viên'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_code">Mã nhân viên *</Label>
              <Select
                value={watchedValues.employee_code}
                onValueChange={handleEmployeeChange}
                disabled={!!salaryDetail}
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
              <Label htmlFor="employee_name">Tên nhân viên</Label>
              <Input
                {...register('employee_name')}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team">Team</Label>
              <Input
                {...register('team')}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_type">Loại lương</Label>
              <Select
                value={watchedValues.salary_type}
                onValueChange={(value) => setValue('salary_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Lương có BH">Lương có BH</SelectItem>
                  <SelectItem value="Lương thời vụ">Lương thời vụ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gross_salary">Lương Gross *</Label>
              <Input
                type="number"
                {...register('gross_salary', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="working_days">Ngày công *</Label>
              <Input
                type="number"
                step="0.5"
                {...register('working_days', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Mức lương/Ngày</Label>
              <Input
                value={formatCurrency(calculatedValues.daily_rate)}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label>Tiền lương theo ngày công</Label>
              <Input
                value={formatCurrency(calculatedValues.daily_salary)}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kpi_bonus">Thưởng KPI</Label>
              <Input
                type="number"
                {...register('kpi_bonus', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overtime_1_5">Tăng ca 1.5</Label>
              <Input
                type="number"
                {...register('overtime_1_5', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overtime_2">Tăng ca 2</Label>
              <Input
                type="number"
                {...register('overtime_2', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overtime_3">Tăng ca 3</Label>
              <Input
                type="number"
                {...register('overtime_3', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Tổng thu nhập</Label>
              <Input
                value={formatCurrency(calculatedValues.total_income)}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurance_base_amount">Mức đóng BH</Label>
              <Input
                type="number"
                {...register('insurance_base_amount', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dependent_count">Số người phụ thuộc</Label>
              <Input
                type="number"
                {...register('dependent_count', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="advance_payment">Tạm Ứng</Label>
              <Input
                type="number"
                {...register('advance_payment', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Lương Net</Label>
              <Input
                value={formatCurrency(calculatedValues.net_salary)}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label>Thực nhận</Label>
              <Input
                value={formatCurrency(calculatedValues.actual_payment)}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
