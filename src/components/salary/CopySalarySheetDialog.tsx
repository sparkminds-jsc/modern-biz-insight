
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
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

interface CopySalarySheetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  salarySheetId: string;
}

interface FormData {
  month: number;
  year: number;
}

export function CopySalarySheetDialog({
  isOpen,
  onClose,
  onSuccess,
  salarySheetId
}: CopySalarySheetDialogProps) {
  const [loading, setLoading] = useState(false);

  const { handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    }
  });

  const watchedValues = watch();

  const months = [
    { value: 1, label: '01' },
    { value: 2, label: '02' },
    { value: 3, label: '03' },
    { value: 4, label: '04' },
    { value: 5, label: '05' },
    { value: 6, label: '06' },
    { value: 7, label: '07' },
    { value: 8, label: '08' },
    { value: 9, label: '09' },
    { value: 10, label: '10' },
    { value: 11, label: '11' },
    { value: 12, label: '12' }
  ];

  const years = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031];

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      // Check if salary sheet for this month/year already exists
      const { data: existingSheet, error: checkError } = await supabase
        .from('salary_sheets')
        .select('id')
        .eq('month', data.month)
        .eq('year', data.year)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingSheet) {
        toast({
          title: 'Lỗi',
          description: `Bảng lương tháng ${data.month.toString().padStart(2, '0')}/${data.year} đã tồn tại`,
          variant: 'destructive',
        });
        return;
      }

      // Get original salary sheet
      const { data: originalSheet, error: sheetError } = await supabase
        .from('salary_sheets')
        .select('*')
        .eq('id', salarySheetId)
        .single();

      if (sheetError) throw sheetError;

      // Get original salary details
      const { data: originalDetails, error: detailsError } = await supabase
        .from('salary_details')
        .select('*')
        .eq('salary_sheet_id', salarySheetId);

      if (detailsError) throw detailsError;

      // Create new salary sheet
      const { data: newSheet, error: newSheetError } = await supabase
        .from('salary_sheets')
        .insert({
          month: data.month,
          year: data.year,
          total_net_salary: originalSheet.total_net_salary,
          total_personal_income_tax: originalSheet.total_personal_income_tax,
          total_company_insurance: originalSheet.total_company_insurance,
          total_personal_insurance: originalSheet.total_personal_insurance,
          total_payment: originalSheet.total_payment
        })
        .select()
        .single();

      if (newSheetError) throw newSheetError;

      // Create new salary details
      if (originalDetails && originalDetails.length > 0) {
        const newDetails = originalDetails.map(detail => ({
          salary_sheet_id: newSheet.id,
          employee_code: detail.employee_code,
          employee_name: detail.employee_name,
          team: detail.team,
          month: data.month,
          year: data.year,
          gross_salary: detail.gross_salary,
          working_days: detail.working_days,
          daily_rate: detail.daily_rate,
          daily_salary: detail.daily_salary,
          kpi_bonus: detail.kpi_bonus,
          overtime_1_5: detail.overtime_1_5,
          overtime_2: detail.overtime_2,
          overtime_3: detail.overtime_3,
          total_income: detail.total_income,
          bhdn_bhxh: detail.bhdn_bhxh,
          bhdn_tnld: detail.bhdn_tnld,
          bhdn_bhyt: detail.bhdn_bhyt,
          bhdn_bhtn: detail.bhdn_bhtn,
          total_bhdn: detail.total_bhdn,
          total_company_payment: detail.total_company_payment,
          bhnld_bhxh: detail.bhnld_bhxh,
          bhnld_bhyt: detail.bhnld_bhyt,
          bhnld_bhtn: detail.bhnld_bhtn,
          total_bhnld: detail.total_bhnld,
          personal_deduction: detail.personal_deduction,
          dependent_count: detail.dependent_count,
          dependent_deduction: detail.dependent_deduction,
          insurance_deduction: detail.insurance_deduction,
          total_deduction: detail.total_deduction,
          taxable_income: detail.taxable_income,
          tax_5_percent: detail.tax_5_percent,
          tax_10_percent: detail.tax_10_percent,
          tax_15_percent: detail.tax_15_percent,
          tax_20_percent: detail.tax_20_percent,
          tax_25_percent: detail.tax_25_percent,
          tax_30_percent: detail.tax_30_percent,
          tax_35_percent: detail.tax_35_percent,
          total_personal_income_tax: detail.total_personal_income_tax,
          net_salary: detail.net_salary,
          advance_payment: detail.advance_payment,
          actual_payment: detail.actual_payment
        }));

        const { error: insertDetailsError } = await supabase
          .from('salary_details')
          .insert(newDetails);

        if (insertDetailsError) throw insertDetailsError;
      }

      toast({
        title: 'Thành công',
        description: `Đã sao chép bảng lương tháng ${data.month.toString().padStart(2, '0')}/${data.year}`,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error copying salary sheet:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể sao chép bảng lương',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Copy bảng lương</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="month">Tháng</Label>
            <Select
              value={watchedValues.month?.toString()}
              onValueChange={(value) => setValue('month', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn tháng" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Năm</Label>
            <Select
              value={watchedValues.year?.toString()}
              onValueChange={(value) => setValue('year', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn năm" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang sao chép...' : 'Đồng ý'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
