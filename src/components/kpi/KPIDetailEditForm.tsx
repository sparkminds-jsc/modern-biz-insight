
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Import all form components
import { KPIBasicInfo } from './form/KPIBasicInfo';
import { KPIWorkProductivity } from './form/KPIWorkProductivity';
import { KPIWorkQuality } from './form/KPIWorkQuality';
import { KPIPullRequest } from './form/KPIPullRequest';
import { KPIAttitude } from './form/KPIAttitude';
import { KPIProgress } from './form/KPIProgress';
import { KPIRequirements } from './form/KPIRequirements';
import { KPIRecruitment } from './form/KPIRecruitment';
import { KPIRevenue } from './form/KPIRevenue';

// Import types and hooks
import { Employee, FormData } from './form/kpiFormTypes';
import { useKPICalculations } from './form/useKPICalculations';

interface KPIDetailEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  kpiDetail?: any;
  month: number;
  year: number;
}

export function KPIDetailEditForm({
  isOpen,
  onClose,
  onSave,
  kpiDetail,
  month,
  year
}: KPIDetailEditFormProps) {
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
      mergeRatio: 0,
      positiveAttitude: 0,
      techContribution: 0,
      techSharing: 0,
      techArticles: 0,
      mentoring: 0,
      teamManagement: 0,
      onTimeCompletion: 0,
      storyPointAccuracy: 0,
      planChanges: 0,
      changeRequests: 0,
      misunderstandingErrors: 0,
      cvCount: 0,
      passedCandidates: 0,
      recruitmentCost: 0,
      clientsOver100M: 0
    }
  });

  const watchedValues = watch();
  const { calculatedValues } = useKPICalculations(watchedValues, month, year);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  useEffect(() => {
    if (kpiDetail && isOpen) {
      // Populate form with existing data
      Object.keys(kpiDetail).forEach(key => {
        if (key in watchedValues) {
          setValue(key as keyof FormData, kpiDetail[key]);
        }
      });
    }
  }, [kpiDetail, isOpen, setValue]);

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
          testBugs: data.testBugs
        },
        pullRequest: {
          mergeRatio: data.mergeRatio
        },
        attitude: {
          total: calculatedValues.attitudeTotal,
          positiveAttitude: data.positiveAttitude,
          techContribution: data.techContribution,
          techSharing: data.techSharing,
          techArticles: data.techArticles,
          mentoring: data.mentoring,
          teamManagement: data.teamManagement
        },
        progress: {
          total: calculatedValues.progressTotal,
          onTimeCompletion: data.onTimeCompletion,
          storyPointAccuracy: data.storyPointAccuracy,
          planChanges: data.planChanges
        },
        requirements: {
          total: calculatedValues.requirementsTotal,
          changeRequests: data.changeRequests,
          misunderstandingErrors: data.misunderstandingErrors
        },
        recruitment: {
          total: calculatedValues.recruitmentTotal,
          cvCount: data.cvCount,
          passedCandidates: data.passedCandidates,
          recruitmentCost: data.recruitmentCost
        },
        revenue: {
          clientsOver100M: data.clientsOver100M
        }
      };

      // Here you would save to your KPI database table
      // For now, just show success message
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {kpiDetail ? 'Chỉnh sửa KPI chi tiết' : 'Thêm KPI chi tiết'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <KPIBasicInfo
            employees={employees}
            employeeCode={watchedValues.employee_code}
            onEmployeeCodeChange={(value) => setValue('employee_code', value)}
            calculatedValues={calculatedValues}
            isEditMode={!!kpiDetail}
          />

          {/* Work Productivity Section */}
          <KPIWorkProductivity
            register={register}
            setValue={setValue}
            watchedValues={watchedValues}
            calculatedValues={calculatedValues}
          />

          {/* Work Quality Section */}
          <KPIWorkQuality
            register={register}
            calculatedValues={calculatedValues}
          />

          {/* Pull Request Section */}
          <KPIPullRequest register={register} />

          {/* Attitude Section */}
          <KPIAttitude
            register={register}
            calculatedValues={calculatedValues}
          />

          {/* Progress Section */}
          <KPIProgress
            register={register}
            calculatedValues={calculatedValues}
          />

          {/* Requirements Section */}
          <KPIRequirements
            register={register}
            calculatedValues={calculatedValues}
          />

          {/* Recruitment Section */}
          <KPIRecruitment
            register={register}
            calculatedValues={calculatedValues}
          />

          {/* Revenue Section */}
          <KPIRevenue register={register} />

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
