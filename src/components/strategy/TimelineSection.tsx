import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TimelineData {
  team: string;
  month1: string[];
  month2: string[];
  month3: string[];
  month4: string[];
  month5: string[];
  month6: string[];
}

export function TimelineSection() {
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const fetchTimelineData = async () => {
    try {
      setLoading(true);

      // Fetch all necessary data
      const [estimatesRes, allocatesRes, employeesRes, projectsRes, teamsRes] = await Promise.all([
        supabase.from('project_estimates').select('*'),
        supabase.from('allocates').select('*'),
        supabase.from('employees').select('*').eq('status', 'Đang làm'),
        supabase.from('projects').select('*').eq('status', 'Đang chạy'),
        supabase.from('teams').select('*')
      ]);

      if (estimatesRes.error) throw estimatesRes.error;
      if (allocatesRes.error) throw allocatesRes.error;
      if (employeesRes.error) throw employeesRes.error;
      if (projectsRes.error) throw projectsRes.error;
      if (teamsRes.error) throw teamsRes.error;

      const estimates = estimatesRes.data || [];
      const allocates = allocatesRes.data || [];
      const employees = employeesRes.data || [];
      const teams = teamsRes.data || [];

      // Calculate timeline data for each team
      const timeline: Record<string, TimelineData> = {};
      
      teams.forEach(team => {
        timeline[team.name] = {
          team: team.name,
          month1: [],
          month2: [],
          month3: [],
          month4: [],
          month5: [],
          month6: []
        };
      });

      // For each duration (1-6 months), calculate available employees
      for (let duration = 1; duration <= 6; duration++) {
        // Get project IDs with estimated_duration <= current duration
        const estimatedProjectIds = new Set(
          estimates
            .filter((est: any) => est.is_estimated && est.estimated_duration <= duration)
            .map((est: any) => est.project_id)
        );

        // Calculate available employees for this duration
        employees.forEach((employee: any) => {
          const allocate = allocates.find((a: any) => a.employee_code === employee.employee_code);
          
          if (allocate && employee.team) {
            // Calculate total allocation percentage in estimated projects with duration <= current duration
            let totalAllocated = 0;
            const projectAllocations = allocate.project_allocations || {};
            
            Object.entries(projectAllocations).forEach(([projectId, percentage]) => {
              if (estimatedProjectIds.has(projectId)) {
                const pct = typeof percentage === 'string' ? parseFloat(percentage) : percentage || 0;
                totalAllocated += pct;
              }
            });

            // If total allocation < 100%, employee is available
            if (totalAllocated < 100) {
              const availablePercentage = 100 - totalAllocated;
              const employeeInfo = `${employee.employee_code} (${Math.round(availablePercentage)}%)`;
              
              // Initialize team if not exists
              if (!timeline[employee.team]) {
                timeline[employee.team] = {
                  team: employee.team,
                  month1: [],
                  month2: [],
                  month3: [],
                  month4: [],
                  month5: [],
                  month6: []
                };
              }
              
              // Add to appropriate month column
              const monthKey = `month${duration}` as keyof Omit<TimelineData, 'team'>;
              timeline[employee.team][monthKey].push(employeeInfo);
            }
          }
        });
      }

      setTimelineData(Object.values(timeline).filter(t => 
        t.month1.length > 0 || t.month2.length > 0 || t.month3.length > 0 || 
        t.month4.length > 0 || t.month5.length > 0 || t.month6.length > 0
      ));
    } catch (error: any) {
      toast.error('Lỗi tải timeline nhân sự: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timeline nhân sự</CardTitle>
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
        <CardTitle>Timeline nhân sự</CardTitle>
      </CardHeader>
      <CardContent>
        {timelineData.length === 0 ? (
          <p className="text-muted-foreground">Chưa có dữ liệu</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Team</TableHead>
                  <TableHead className="font-semibold">1 tháng</TableHead>
                  <TableHead className="font-semibold">2 tháng</TableHead>
                  <TableHead className="font-semibold">3 tháng</TableHead>
                  <TableHead className="font-semibold">4 tháng</TableHead>
                  <TableHead className="font-semibold">5 tháng</TableHead>
                  <TableHead className="font-semibold">6 tháng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timelineData.map((data) => (
                  <TableRow key={data.team}>
                    <TableCell className="font-medium">{data.team}</TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        {data.month1.map((emp, idx) => (
                          <div key={idx}>{emp}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        {data.month2.map((emp, idx) => (
                          <div key={idx}>{emp}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        {data.month3.map((emp, idx) => (
                          <div key={idx}>{emp}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        {data.month4.map((emp, idx) => (
                          <div key={idx}>{emp}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        {data.month5.map((emp, idx) => (
                          <div key={idx}>{emp}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        {data.month6.map((emp, idx) => (
                          <div key={idx}>{emp}</div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
