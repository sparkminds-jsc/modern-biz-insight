import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/numberFormat';
import { Eye, EyeOff } from 'lucide-react';

interface TeamStats {
  team: string;
  revenue: number;
  cost: number;
  storage: number;
  profit: number;
}

interface AvailableEmployee {
  employee_code: string;
  full_name: string;
  role: string;
  position: string;
  call_kh: boolean;
  available_percentage: number;
}

interface StatisticsSectionProps {
  refreshTrigger?: number;
}

export function StatisticsSection({ refreshTrigger }: StatisticsSectionProps) {
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<AvailableEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleTeams, setVisibleTeams] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchStatistics();
  }, [refreshTrigger]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);

      // Fetch project estimates, team costs, allocates, employees, and projects
      const [estimatesRes, costsRes, allocatesRes, employeesRes, projectsRes] = await Promise.all([
        supabase.from('project_estimates').select('*'),
        supabase.from('team_average_costs').select('*'),
        supabase.from('allocates').select('*'),
        supabase.from('employees').select('*').eq('status', 'Đang làm'),
        supabase.from('projects').select('*').eq('status', 'Đang chạy')
      ]);

      if (estimatesRes.error) throw estimatesRes.error;
      if (costsRes.error) throw costsRes.error;
      if (allocatesRes.error) throw allocatesRes.error;
      if (employeesRes.error) throw employeesRes.error;
      if (projectsRes.error) throw projectsRes.error;

      // Calculate team revenues from estimates
      const teamRevenueMap: Record<string, number> = {};
      (estimatesRes.data || []).forEach((estimate: any) => {
        if (estimate.is_estimated && estimate.team_revenues) {
          Object.entries(estimate.team_revenues).forEach(([team, revenue]) => {
            const revenueNum = typeof revenue === 'number' ? revenue : parseFloat(String(revenue)) || 0;
            teamRevenueMap[team] = (teamRevenueMap[team] || 0) + revenueNum;
          });
        }
      });

      // Calculate team costs
      const teamCostMap: Record<string, number> = {};
      (costsRes.data || []).forEach((cost: any) => {
        teamCostMap[cost.team] = cost.average_monthly_cost || 0;
      });

      // Build team stats
      const allTeams = new Set([...Object.keys(teamRevenueMap), ...Object.keys(teamCostMap)]);
      const stats: TeamStats[] = Array.from(allTeams).map(team => {
        const revenue = teamRevenueMap[team] || 0;
        const cost = teamCostMap[team] || 0;
        const storage = revenue * 0.3; // 30% of revenue
        return {
          team,
          revenue,
          cost,
          storage,
          profit: revenue - cost - storage
        };
      }).filter(stat => stat.revenue > 0 || stat.cost > 0);

      setTeamStats(stats);

      // Calculate available employees
      // First, get estimated project IDs
      const estimatedProjectIds = new Set(
        (estimatesRes.data || [])
          .filter((est: any) => est.is_estimated)
          .map((est: any) => est.project_id)
      );

      const available: AvailableEmployee[] = [];
      (employeesRes.data || []).forEach((employee: any) => {
        const allocate = (allocatesRes.data || []).find((a: any) => a.employee_code === employee.employee_code);
        
        if (allocate) {
          // Calculate total allocation percentage in estimated projects
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
            available.push({
              employee_code: employee.employee_code,
              full_name: employee.full_name,
              role: allocate.role,
              position: allocate.position,
              call_kh: allocate.call_kh,
              available_percentage: 100 - totalAllocated
            });
          }
        }
      });

      setAvailableEmployees(available);
    } catch (error: any) {
      toast.error('Lỗi tải thống kê: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thống kê</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  // Group available employees by role
  const groupedByRole: Record<string, Record<string, AvailableEmployee[]>> = {};
  availableEmployees.forEach(emp => {
    // Add to their actual role (Leader/Member)
    const role = emp.role;
    const position = emp.position;
    
    if (!groupedByRole[role]) {
      groupedByRole[role] = {};
    }
    if (!groupedByRole[role][position]) {
      groupedByRole[role][position] = [];
    }
    groupedByRole[role][position].push(emp);
    
    // Also add to Call KH if applicable
    if (emp.call_kh) {
      if (!groupedByRole['Call KH']) {
        groupedByRole['Call KH'] = {};
      }
      if (!groupedByRole['Call KH'][position]) {
        groupedByRole['Call KH'][position] = [];
      }
      groupedByRole['Call KH'][position].push(emp);
    }
  });

  const toggleTeamVisibility = (team: string) => {
    setVisibleTeams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(team)) {
        newSet.delete(team);
      } else {
        newSet.add(team);
      }
      return newSet;
    });
  };

  const formatAmount = (amount: number, team: string) => {
    if (visibleTeams.has(team)) {
      return formatCurrency(amount);
    }
    return '***';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Box 1: Revenue/Cost */}
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu/Chi phí</CardTitle>
        </CardHeader>
        <CardContent>
          {teamStats.length === 0 ? (
            <p className="text-muted-foreground">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-3">
              {teamStats.map((stat) => (
                <div key={stat.team} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stat.team}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleTeamVisibility(stat.team)}
                    >
                      {visibleTeams.has(stat.team) ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 text-sm pl-4">
                    <span className="text-green-600 dark:text-green-400">
                      {formatAmount(stat.revenue, stat.team)}
                    </span>
                    <span>-</span>
                    <span className="text-red-600 dark:text-red-400">
                      {formatAmount(stat.cost, stat.team)}
                    </span>
                    <span>-</span>
                    <span className="text-orange-600 dark:text-orange-400">
                      {formatAmount(stat.storage, stat.team)}
                    </span>
                    <span>-</span>
                    <span className={stat.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {formatAmount(stat.profit, stat.team)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Box 2: Available Personnel */}
      <Card>
        <CardHeader>
          <CardTitle>Nhân sự rảnh</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedByRole).length === 0 ? (
            <p className="text-muted-foreground">Không có nhân sự rảnh</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(groupedByRole).map(([role, positions]) => (
                <div key={role} className="space-y-1">
                  <div className="font-medium">{role}:</div>
                  <div className="pl-4 space-y-1">
                    {Object.entries(positions).map(([position, employees]) => {
                      const totalPercentage = employees.reduce((sum, e) => sum + e.available_percentage, 0);
                      const equivalentCount = (totalPercentage / 100).toFixed(2);
                      
                      return (
                        <div key={position} className="text-sm">
                          {equivalentCount} {position}:
                          {employees.map((emp, idx) => (
                            <span key={emp.employee_code}>
                              {' '}{emp.employee_code} ({Math.round(emp.available_percentage)}%)
                              {idx < employees.length - 1 && ','}
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
