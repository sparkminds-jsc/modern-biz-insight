
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Employee, FormData } from './kpiFormTypes';
import { useKPICalculations } from './useKPICalculations';
import { KPIFormSections } from './KPIFormSections';

interface KPIFormContentProps {
  onClose: () => void;
  onSave: () => void;
  kpiDetail?: any;
  month: number;
  year: number;
}

export function KPIFormContent({
  onClose,
  onSave,
  kpiDetail,
  month,
  year
}: KPIFormContentProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      employee_code: '',
      completedOnTime: '0',
      overdueTask: 0,
      taskTarget: '0',
      locTarget: 0,
      lotTarget: 0,
      effortRatio: '0',
      gitActivity: '0',
      prodBugs: 0,
      testBugs: 0,
      mergeRatio: '0',
      positiveAttitude: '0',
      techSharing: 0,
      techArticles: 0,
      mentoring: 0,
      teamManagement: '0',
      onTimeCompletion: '0',
      storyPointAccuracy: '0',
      planChanges: 0,
      changeRequests: 0,
      misunderstandingErrors: 0,
      cvCount: '0',
      passedCandidates: 0,
      recruitmentCost: '0',
      clientsOver100M: 0
    }
  });

  const watchedValues = watch();
  const { calculatedValues } = useKPICalculations(watchedValues, month, year);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (kpiDetail) {
      Object.keys(kpiDetail).forEach(key => {
        if (key in watchedValues) {
          setValue(key as keyof FormData, kpiDetail[key]);
        }
      });
    }
  }, [kpiDetail, setValue]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, employee_code, full_name')
        .eq('status', 'Đang làm')
        .order('employee_code');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Không thể tải danh sách nhân viên');
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      const kpiDetailData = {
        employee_code: data.employee_code,
        month,
        year,
        hasKPIGap: calculatedValues.hasKPIGap,
        basicSalary: calculatedValues.basicSalary,
        kpi: calculatedValues.kpi,
        totalSalary: calculatedValues.totalSalary,
        salaryCoefficient: calculatedValues.salaryCoefficient,
        kpiCoefficient: calculatedValues.kpiCoefficient,
        totalMonthlyKPI: calculatedValues.totalMonthlyKPI,
        workProductivity: {
          total: calculatedValues.workProductivityTotal,
          completedOnTime: parseFloat(data.completedOnTime),
          overdueTask: data.overdueTask,
          taskTarget: parseFloat(data.taskTarget),
          locTarget: data.locTarget,
          lotTarget: data.lotTarget,
          effortRatio: parseFloat(data.effortRatio),
          gitActivity: parseFloat(data.gitActivity)
        },
        workQuality: {
          total: calculatedValues.workQualityTotal,
          prodBugs: data.prodBugs,
          testBugs: data.testBugs,
          mergeRatio: parseFloat(data.mergeRatio)
        },
        attitude: {
          total: calculatedValues.attitudeTotal,
          positiveAttitude: parseFloat(data.positiveAttitude),
          techSharing: data.techSharing,
          techArticles: data.techArticles,
          mentoring: data.mentoring,
          teamManagement: parseFloat(data.teamManagement)
        },
        progress: {
          total: calculatedValues.progressTotal,
          onTimeCompletion: parseFloat(data.onTimeCompletion),
          storyPointAccuracy: parseFloat(data.storyPointAccuracy),
          planChanges: data.planChanges
        },
        requirements: {
          total: calculatedValues.requirementsTotal,
          changeRequests: data.changeRequests,
          misunderstandingErrors: data.misunderstandingErrors
        },
        recruitment: {
          total: calculatedValues.recruitmentTotal,
          cvCount: parseFloat(data.cvCount),
          passedCandidates: data.passedCandidates,
          recruitmentCost: parseFloat(data.recruitmentCost)
        },
        revenue: {
          clientsOver100M: data.clientsOver100M
        }
      };

      toast.success(kpiDetail ? 'Đã cập nhật KPI' : 'Đã thêm KPI mới');
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving KPI detail:', error);
      toast.error('Không thể lưu thông tin KPI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <KPIFormSections
        employees={employees}
        register={register}
        setValue={setValue}
        watchedValues={watchedValues}
        calculatedValues={calculatedValues}
        isEditMode={!!kpiDetail}
      />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogFooter>
    </form>
  );
}
