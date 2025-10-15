import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { formatNumber } from '@/utils/numberFormat';

interface ProjectStaff {
  projectId: string;
  projectName: string;
  estimatedBill: number;
  totalPersonnel: number;
  staff: Array<{
    name: string;
    percentage: number;
  }>;
}

interface ProjectStaffSectionProps {
  refreshTrigger?: number;
}

export function ProjectStaffSection({ refreshTrigger }: ProjectStaffSectionProps) {
  const [projectStaffData, setProjectStaffData] = useState<ProjectStaff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectStaffData();
  }, [refreshTrigger]);

  const fetchProjectStaffData = async () => {
    try {
      setLoading(true);

      // Fetch estimated projects
      const { data: estimates, error: estimatesError } = await supabase
        .from('project_estimates')
        .select('project_id, estimated_bill')
        .eq('is_estimated', true);

      if (estimatesError) throw estimatesError;

      const estimatedProjectIds = estimates?.map(e => e.project_id).filter(Boolean) || [];

      if (estimatedProjectIds.length === 0) {
        setProjectStaffData([]);
        return;
      }

      // Fetch projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, name')
        .in('id', estimatedProjectIds);

      if (projectsError) throw projectsError;

      // Fetch allocates
      const { data: allocates, error: allocatesError } = await supabase
        .from('allocates')
        .select('employee_code, project_allocations');

      if (allocatesError) throw allocatesError;

      // Fetch employees
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('employee_code, full_name');

      if (employeesError) throw employeesError;

      // Build employee map
      const employeeMap = new Map(
        employees?.map(e => [e.employee_code, e.full_name]) || []
      );

      // Build project staff data
      const projectStaffMap = new Map<string, ProjectStaff>();
      const estimatesMap = new Map(estimates?.map(e => [e.project_id, e.estimated_bill || 0]) || []);

      projects?.forEach(project => {
        projectStaffMap.set(project.id, {
          projectId: project.id,
          projectName: project.name,
          estimatedBill: estimatesMap.get(project.id) || 0,
          totalPersonnel: 0,
          staff: []
        });
      });

      allocates?.forEach(allocate => {
        const allocations = allocate.project_allocations as Record<string, string | number>;
        const employeeName = employeeMap.get(allocate.employee_code);

        if (!employeeName) return;

        Object.entries(allocations).forEach(([projectId, percentageValue]) => {
          // Parse percentage: can be "25%" string or 25 number
          let percentage: number;
          if (typeof percentageValue === 'string') {
            percentage = parseFloat(percentageValue.replace('%', ''));
          } else {
            percentage = percentageValue;
          }

          if (percentage > 0 && projectStaffMap.has(projectId)) {
            const projectStaff = projectStaffMap.get(projectId)!;
            projectStaff.staff.push({
              name: employeeName,
              percentage
            });
          }
        });
      });

      // Calculate total personnel for each project
      projectStaffMap.forEach(projectStaff => {
        projectStaff.totalPersonnel = projectStaff.staff.reduce((sum, s) => sum + (s.percentage / 100), 0);
      });

      // Convert to array and sort
      const result = Array.from(projectStaffMap.values())
        .filter(p => p.staff.length > 0)
        .sort((a, b) => a.projectName.localeCompare(b.projectName));

      setProjectStaffData(result);
    } catch (error) {
      console.error('Error fetching project staff data:', error);
      toast.error('Không thể tải dữ liệu thống kê nhân sự');
    } finally {
      setLoading(false);
    }
  };

  const formatStaffList = (staff: Array<{ name: string; percentage: number }>) => {
    return staff
      .map(s => {
        if (s.percentage === 100) {
          return s.name;
        }
        return `${s.name} (${s.percentage}%)`;
      })
      .join(', ');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thống kê nhân sự trong dự án</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê nhân sự trong dự án</CardTitle>
      </CardHeader>
      <CardContent>
        {projectStaffData.length === 0 ? (
          <p className="text-muted-foreground">Chưa có dự án được ước tính</p>
        ) : (
          <div className="space-y-3">
            {projectStaffData.map(project => (
              <div key={project.projectId} className="flex gap-2">
                <span className="font-medium min-w-[150px]">
                  {project.projectName}
                  {project.estimatedBill > 0 && ` (~${project.estimatedBill} bill/${formatNumber(project.totalPersonnel, 2)} nhân sự)`}:
                </span>
                <span className="text-muted-foreground">{formatStaffList(project.staff)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
