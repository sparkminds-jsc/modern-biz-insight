
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SalarySheet } from '@/types/salary';

export const useSalaryOperations = () => {
  const [loading, setLoading] = useState(false);

  const completeSalarySheet = async (salarySheet: SalarySheet) => {
    try {
      const { error } = await supabase
        .from('salary_sheets')
        .update({ status: 'Hoàn thành' })
        .eq('id', salarySheet.id);

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã hoàn thành bảng lương',
      });

      return true;
    } catch (error) {
      console.error('Error completing salary sheet:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể hoàn thành bảng lương',
        variant: 'destructive',
      });
      return false;
    }
  };

  const sendSalaryMail = async (salarySheet: SalarySheet) => {
    try {
      setLoading(true);
      
      // Fetch salary details for this sheet
      const { data: salaryDetails, error: detailsError } = await supabase
        .from('salary_details')
        .select('*')
        .eq('salary_sheet_id', salarySheet.id);

      if (detailsError) throw detailsError;

      if (!salaryDetails || salaryDetails.length === 0) {
        toast({
          title: 'Thông báo',
          description: 'Không có dữ liệu nhân viên trong bảng lương này',
          variant: 'destructive',
        });
        return false;
      }

      // Fetch employee emails - fix column name to employee_code
      const employeeCodes = salaryDetails.map(detail => detail.employee_code);
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('employee_code, email, full_name')
        .in('employee_code', employeeCodes);

      if (employeesError) throw employeesError;

      // Create email data array
      const emailData = salaryDetails.map(detail => {
        const employee = employees?.find(emp => emp.employee_code === detail.employee_code);
        return {
          email: employee?.email || '',
          code: detail.employee_code,
          fullname: detail.employee_name,
          time: `${salarySheet.month.toString().padStart(2, '0')}/${salarySheet.year}`,
          workdays: detail.working_days.toString(),
          gross_salary: `${detail.gross_salary.toLocaleString()} VND`,
          gross_for_workdays: `${detail.daily_salary.toLocaleString()} VND`,
          kpi: `${detail.kpi_bonus.toLocaleString()} VND`,
          BHXH: `${detail.bhnld_bhxh.toLocaleString()} VND`,
          BHYT: `${detail.bhnld_bhyt.toLocaleString()} VND`,
          BHTN: `${detail.bhnld_bhtn.toLocaleString()} VND`,
          TNCN: `${detail.total_personal_income_tax.toLocaleString()} VND`,
          advance: `${detail.advance_payment.toLocaleString()} VND`,
          final_salary: `${detail.actual_payment.toLocaleString()} VND`
        };
      });

      // Filter out employees without email
      const validEmailData = emailData.filter(data => data.email);

      if (validEmailData.length === 0) {
        toast({
          title: 'Thông báo',
          description: 'Không có nhân viên nào có email trong bảng lương này',
          variant: 'destructive',
        });
        return false;
      }

      console.log('Sending email data:', validEmailData);

      // Send to webhook
      const response = await fetch('https://n8n.sparkminds.net/webhook/send_salary_mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validEmailData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: 'Thành công',
        description: `Đã gửi email thông báo lương tới ${validEmailData.length} nhân viên`,
      });

      return true;
    } catch (error) {
      console.error('Error sending salary emails:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể gửi email thông báo lương',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSalarySheet = async (salarySheet: SalarySheet) => {
    if (salarySheet.status === 'Hoàn thành') {
      toast({
        title: 'Không thể xóa',
        description: 'Không thể xóa bảng lương đã hoàn thành',
        variant: 'destructive',
      });
      return false;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa bảng lương tháng ${salarySheet.month}/${salarySheet.year}?`)) {
      return false;
    }

    try {
      // First delete salary details
      const { error: detailsError } = await supabase
        .from('salary_details')
        .delete()
        .eq('salary_sheet_id', salarySheet.id);

      if (detailsError) throw detailsError;

      // Then delete salary sheet
      const { error: sheetError } = await supabase
        .from('salary_sheets')
        .delete()
        .eq('id', salarySheet.id);

      if (sheetError) throw sheetError;

      toast({
        title: 'Thành công',
        description: 'Đã xóa bảng lương',
      });

      return true;
    } catch (error) {
      console.error('Error deleting salary sheet:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa bảng lương',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    loading,
    completeSalarySheet,
    sendSalaryMail,
    deleteSalarySheet,
  };
};
