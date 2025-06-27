
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Employee, FormData } from './kpiFormTypes';
import { useKPICalculations } from './useKPICalculations';
import { KPIBasicInfo } from './KPIBasicInfo';
import { KPIWorkProductivity } from './KPIWorkProductivity';
import { KPIWorkQuality } from './KPIWorkQuality';
import { KPIAttitude } from './KPIAttitude';
import { KPIProgress } from './KPIProgress';
import { KPIRequirements } from './KPIRequirements';
import { KPIRecruitment } from './KPIRecruitment';
import { KPIRevenue } from './KPIRevenue';

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
  month: initialMonth,
  year: initialYear
}: KPIFormContentProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);

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
  const { calculatedValues } = useKPICalculations(watchedValues, selectedMonth, selectedYear);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (kpiDetail) {
      // Handle form data mapping from existing KPI detail
      const formData: Partial<FormData> = {
        employee_code: kpiDetail.employee_code,
        completedOnTime: kpiDetail.work_productivity?.completedOnTime?.toString() || '0',
        overdueTask: kpiDetail.work_productivity?.overdueTask || 0,
        taskTarget: kpiDetail.work_productivity?.taskTarget?.toString() || '0',
        locTarget: kpiDetail.work_productivity?.locTarget || 0,
        lotTarget: kpiDetail.work_productivity?.lotTarget || 0,
        effortRatio: kpiDetail.work_productivity?.effortRatio?.toString() || '0',
        gitActivity: kpiDetail.work_productivity?.gitActivity?.toString() || '0',
        prodBugs: kpiDetail.work_quality?.prodBugs || 0,
        testBugs: kpiDetail.work_quality?.testBugs || 0,
        mergeRatio: kpiDetail.work_quality?.mergeRatio?.toString() || '0',
        positiveAttitude: kpiDetail.attitude?.positiveAttitude?.toString() || '0',
        techSharing: kpiDetail.attitude?.techSharing || 0,
        techArticles: kpiDetail.attitude?.techArticles || 0,
        mentoring: kpiDetail.attitude?.mentoring || 0,
        teamManagement: kpiDetail.attitude?.teamManagement?.toString() || '0',
        onTimeCompletion: kpiDetail.progress?.onTimeCompletion?.toString() || '0',
        storyPointAccuracy: kpiDetail.progress?.storyPointAccuracy?.toString() || '0',
        planChanges: kpiDetail.progress?.planChanges || 0,
        changeRequests: kpiDetail.requirements?.changeRequests || 0,
        misunderstandingErrors: kpiDetail.requirements?.misunderstandingErrors || 0,
        cvCount: kpiDetail.recruitment?.cvCount?.toString() || '0',
        passedCandidates: kpiDetail.recruitment?.passedCandidates || 0,
        recruitmentCost: kpiDetail.recruitment?.recruitmentCost?.toString() || '0',
        clientsOver100M: kpiDetail.revenue?.clientsOver100M || 0
      };

      Object.entries(formData).forEach(([key, value]) => {
        setValue(key as keyof FormData, value);
      });

      // Set the month and year from the existing KPI detail
      setSelectedMonth(kpiDetail.month);
      setSelectedYear(kpiDetail.year);
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

  const parseValue = (value: string) => {
    if (value === 'na' || value === 'na_merge' || value === 'na_attitude' || value === 'na_completion' || value === 'na_story') {
      return 0;
    }
    return parseFloat(value) || 0;
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      const kpiDetailData = {
        employee_code: data.employee_code,
        month: selectedMonth,
        year: selectedYear,
        has_kpi_gap: calculatedValues.hasKPIGap,
        basic_salary: calculatedValues.basicSalary,
        kpi: calculatedValues.kpi,
        total_salary: calculatedValues.totalSalary,
        salary_coefficient: calculatedValues.salaryCoefficient,
        kpi_coefficient: calculatedValues.kpiCoefficient,
        total_monthly_kpi: calculatedValues.totalMonthlyKPI,
        work_productivity: {
          total: calculatedValues.workProductivityTotal,
          completedOnTime: parseValue(data.completedOnTime),
          overdueTask: data.overdueTask,
          taskTarget: parseValue(data.taskTarget),
          locTarget: data.locTarget,
          lotTarget: data.lotTarget,
          effortRatio: parseValue(data.effortRatio),
          gitActivity: parseValue(data.gitActivity)
        },
        work_quality: {
          total: calculatedValues.workQualityTotal,
          prodBugs: data.prodBugs,
          testBugs: data.testBugs,
          mergeRatio: parseValue(data.mergeRatio)
        },
        attitude: {
          total: calculatedValues.attitudeTotal,
          positiveAttitude: parseValue(data.positiveAttitude),
          techSharing: data.techSharing,
          techArticles: data.techArticles,
          mentoring: data.mentoring,
          teamManagement: parseValue(data.teamManagement)
        },
        progress: {
          total: calculatedValues.progressTotal,
          onTimeCompletion: parseValue(data.onTimeCompletion),
          storyPointAccuracy: parseValue(data.storyPointAccuracy),
          planChanges: data.planChanges
        },
        requirements: {
          total: calculatedValues.requirementsTotal,
          changeRequests: data.changeRequests,
          misunderstandingErrors: data.misunderstandingErrors
        },
        recruitment: {
          total: calculatedValues.recruitmentTotal,
          cvCount: parseValue(data.cvCount),
          passedCandidates: data.passedCandidates,
          recruitmentCost: parseValue(data.recruitmentCost)
        },
        revenue: {
          clientsOver100M: data.clientsOver100M
        }
      };

      if (kpiDetail) {
        const { error } = await supabase
          .from('kpi_details')
          .update(kpiDetailData)
          .eq('id', kpiDetail.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('kpi_details')
          .insert(kpiDetailData);

        if (error) throw error;
      }

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
    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col py-4">
      {/* Basic Information - Fixed Section */}
      <div className="flex-shrink-0 border-b border-gray-200 pb-4 mb-4">
        <KPIBasicInfo
          employees={employees}
          employeeCode={watchedValues.employee_code}
          onEmployeeCodeChange={(value) => setValue('employee_code', value)}
          calculatedValues={calculatedValues}
          isEditMode={!!kpiDetail}
          month={selectedMonth}
          year={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-6 pb-4">
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
            setValue={setValue}
            watchedValues={watchedValues}
            calculatedValues={calculatedValues}
          />

          {/* Attitude Section */}
          <KPIAttitude
            register={register}
            setValue={setValue}
            watchedValues={watchedValues}
            calculatedValues={calculatedValues}
          />

          {/* Progress Section */}
          <KPIProgress
            register={register}
            setValue={setValue}
            watchedValues={watchedValues}
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
            setValue={setValue}
            watchedValues={watchedValues}
            calculatedValues={calculatedValues}
          />

          {/* Revenue Section */}
          <KPIRevenue register={register} />
        </div>
      </div>

      {/* Footer - Fixed Section */}
      <div className="flex-shrink-0 border-t border-gray-200 pt-4 mt-4">
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </div>
    </form>
  );
}
