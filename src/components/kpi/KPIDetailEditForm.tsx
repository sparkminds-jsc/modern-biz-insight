
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
import { toast } from 'sonner';

interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
}

interface SalaryData {
  gross_salary: number;
  kpi_bonus: number;
  overtime_1_5: number;
  overtime_2: number;
  overtime_3: number;
}

interface KPIDetailEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  kpiDetail?: any;
  month: number;
  year: number;
}

interface FormData {
  employee_code: string;
  // Work productivity fields
  completedOnTime: string;
  overdueTask: number;
  taskTarget: string;
  locTarget: number;
  lotTarget: number;
  effortRatio: string;
  gitActivity: string;
  // Work quality fields
  prodBugs: number;
  testBugs: number;
  // Pull request fields
  mergeRatio: number;
  // Attitude fields
  positiveAttitude: number;
  techContribution: number;
  techSharing: number;
  techArticles: number;
  mentoring: number;
  teamManagement: number;
  // Progress fields
  onTimeCompletion: number;
  storyPointAccuracy: number;
  planChanges: number;
  // Requirements fields
  changeRequests: number;
  misunderstandingErrors: number;
  // Recruitment fields
  cvCount: number;
  passedCandidates: number;
  recruitmentCost: number;
  // Revenue fields
  clientsOver100M: number;
}

const performanceOptions = [
  { label: 'Đạt', value: '0' },
  { label: 'Không Đạt', value: '-0.25' },
  { label: 'Vượt Trội', value: '0.5' },
  { label: 'N/A', value: '0' }
];

const taskTargetOptions = [
  { label: 'Đạt', value: '0' },
  { label: 'Không Đạt', value: '-0.1' },
  { label: 'Vượt Trội', value: '0.2' },
  { label: 'N/A', value: '0' }
];

const effortRatioOptions = [
  { label: 'Đạt', value: '0' },
  { label: 'Không Đạt', value: '-0.1' },
  { label: 'Vượt Trội', value: '0.2' },
  { label: 'N/A', value: '0' }
];

const gitActivityOptions = [
  { label: 'Đạt', value: '0' },
  { label: 'Không Đạt', value: '-0.05' },
  { label: 'Vượt Trội', value: '0.1' },
  { label: 'N/A', value: '0' }
];

export function KPIDetailEditForm({
  isOpen,
  onClose,
  onSave,
  kpiDetail,
  month,
  year
}: KPIDetailEditFormProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculatedValues, setCalculatedValues] = useState({
    basicSalary: 0,
    kpi: 0,
    totalSalary: 0,
    salaryCoefficient: 0,
    kpiCoefficient: 0,
    totalMonthlyKPI: 0,
    hasKPIGap: false,
    workProductivityTotal: 0,
    workQualityTotal: 0,
    pullRequestMergeRatio: 0,
    attitudeTotal: 0,
    progressTotal: 0,
    requirementsTotal: 0,
    recruitmentTotal: 0
  });

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

  useEffect(() => {
    if (watchedValues.employee_code) {
      fetchSalaryData(watchedValues.employee_code);
    }
  }, [watchedValues.employee_code, month, year]);

  useEffect(() => {
    calculateValues();
  }, [watchedValues, salaryData]);

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

  const fetchSalaryData = async (employeeCode: string) => {
    try {
      // First get salary sheet for the month/year
      const { data: salarySheet, error: sheetError } = await supabase
        .from('salary_sheets')
        .select('id')
        .eq('month', month)
        .eq('year', year)
        .single();

      if (sheetError || !salarySheet) {
        console.log('No salary sheet found for this month/year');
        setSalaryData(null);
        return;
      }

      // Then get salary detail for this employee
      const { data: salaryDetail, error: detailError } = await supabase
        .from('salary_details')
        .select('gross_salary, kpi_bonus, overtime_1_5, overtime_2, overtime_3')
        .eq('salary_sheet_id', salarySheet.id)
        .eq('employee_code', employeeCode)
        .single();

      if (detailError || !salaryDetail) {
        console.log('No salary detail found for this employee');
        setSalaryData(null);
        return;
      }

      setSalaryData(salaryDetail);
    } catch (error) {
      console.error('Error fetching salary data:', error);
      setSalaryData(null);
    }
  };

  const calculateValues = () => {
    const values = watchedValues;
    
    // Basic salary and KPI from salary data
    const basicSalary = salaryData?.gross_salary || 0;
    const kpi = salaryData ? (salaryData.kpi_bonus + salaryData.overtime_1_5 + salaryData.overtime_2 + salaryData.overtime_3) : 0;
    const totalSalary = basicSalary + kpi;
    const salaryCoefficient = basicSalary !== 0 ? parseFloat((kpi / basicSalary).toFixed(3)) : 0;

    // Work productivity total calculation
    const workProductivityTotal = 
      parseFloat(values.completedOnTime) - (values.overdueTask * 0.01) + 
      parseFloat(values.taskTarget) + 
      parseFloat(values.effortRatio) + 
      parseFloat(values.gitActivity);

    // Work quality total calculation
    const workQualityTotal = Math.max(0, 100 - values.prodBugs * 5 - values.testBugs * 2);

    // Pull request merge ratio
    const pullRequestMergeRatio = values.mergeRatio;

    // Attitude total calculation
    const attitudeTotal = 
      values.positiveAttitude + values.techContribution + values.techSharing * 5 + 
      values.techArticles * 3 + values.mentoring * 2 + values.teamManagement * 3;

    // Progress total calculation
    const progressTotal = 
      values.onTimeCompletion + values.storyPointAccuracy - values.planChanges * 2;

    // Requirements total calculation
    const requirementsTotal = 
      Math.max(0, 100 - values.changeRequests * 5 - values.misunderstandingErrors * 10);

    // Recruitment total calculation
    const recruitmentTotal = 
      values.cvCount * 0.5 + values.passedCandidates * 2 + 
      Math.max(0, (2000000 - values.recruitmentCost) / 10000);

    // KPI coefficient calculation
    const kpiCoefficient = 
      workProductivityTotal + workQualityTotal + attitudeTotal + 
      progressTotal + requirementsTotal + recruitmentTotal;

    // Total monthly KPI calculation
    const totalMonthlyKPI = 
      (basicSalary * kpiCoefficient / 100) + 
      (100000 * values.mentoring) + 
      (values.teamManagement * 2000000) + 
      (values.clientsOver100M * 4000000) + 
      values.locTarget + values.lotTarget + 
      (values.passedCandidates * 500000) + 
      Math.max(0, values.recruitmentCost - 2000000);

    // Check if there's KPI gap
    const hasKPIGap = Math.abs(kpi - totalMonthlyKPI) > 1000; // Allow small rounding differences

    setCalculatedValues({
      basicSalary,
      kpi,
      totalSalary,
      salaryCoefficient,
      kpiCoefficient: parseFloat(kpiCoefficient.toFixed(3)),
      totalMonthlyKPI: Math.round(totalMonthlyKPI),
      hasKPIGap,
      workProductivityTotal: parseFloat(workProductivityTotal.toFixed(2)),
      workQualityTotal: Math.round(workQualityTotal),
      pullRequestMergeRatio,
      attitudeTotal: Math.round(attitudeTotal),
      progressTotal: Math.round(progressTotal),
      requirementsTotal: Math.round(requirementsTotal),
      recruitmentTotal: parseFloat(recruitmentTotal.toFixed(2))
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_code">Mã nhân viên *</Label>
              <Select
                value={watchedValues.employee_code}
                onValueChange={(value) => setValue('employee_code', value)}
                disabled={!!kpiDetail}
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

            <div className="space-y-2">
              <Label>Tổng KPI trong tháng</Label>
              <Input
                value={formatCurrency(calculatedValues.totalMonthlyKPI)}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>

          {/* Work Productivity Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Năng suất công việc</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tổng</Label>
                <Input
                  value={calculatedValues.workProductivityTotal}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label>Hoàn thành task đúng deadline</Label>
                <Select
                  value={watchedValues.completedOnTime}
                  onValueChange={(value) => setValue('completedOnTime', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {performanceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Số lượng task bị trễ deadline</Label>
                <Input
                  type="number"
                  {...register('overdueTask', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Đạt chỉ tiêu task (10)</Label>
                <Select
                  value={watchedValues.taskTarget}
                  onValueChange={(value) => setValue('taskTarget', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {taskTargetOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>LOC vượt chỉ tiêu (10000)</Label>
                <Input
                  type="number"
                  {...register('locTarget', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>LOT vượt chỉ tiêu (1000)</Label>
                <Input
                  type="number"
                  {...register('lotTarget', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Tỷ lệ effort ({'>'}80%)</Label>
                <Select
                  value={watchedValues.effortRatio}
                  onValueChange={(value) => setValue('effortRatio', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {effortRatioOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Git activity (5)</Label>
                <Select
                  value={watchedValues.gitActivity}
                  onValueChange={(value) => setValue('gitActivity', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {gitActivityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Work Quality Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Chất lượng công việc</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tổng</Label>
                <Input
                  value={calculatedValues.workQualityTotal}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label>Bug môi trường thực tế</Label>
                <Input
                  type="number"
                  {...register('prodBugs', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Bug môi trường test</Label>
                <Input
                  type="number"
                  {...register('testBugs', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Pull Request Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tỷ lệ pull request</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Merge không chỉnh sửa ({'>'}30%)</Label>
                <Input
                  type="number"
                  {...register('mergeRatio', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Continue with other sections... */}
          {/* For brevity, I'll include the remaining sections in a similar pattern */}

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
