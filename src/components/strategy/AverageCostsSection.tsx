import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

interface Team {
  id: string;
  name: string;
}

interface TeamAverageCost {
  id: string;
  team: string;
  average_monthly_cost: number;
}

interface AverageCostsSectionProps {
  onSave?: () => void;
}

const parseVN = (s: string): number => {
  if (!s) return 0;
  const n = parseFloat(String(s).replace(/[.\s]/g, '').replace(',', '.'));
  return isNaN(n) ? 0 : n;
};

const formatVN = (n: number): string => {
  if (!n) return '';
  return new Intl.NumberFormat('vi-VN').format(n);
};

export function AverageCostsSection({ onSave }: AverageCostsSectionProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [costs, setCosts] = useState<Record<string, TeamAverageCost>>({});
  const [localCosts, setLocalCosts] = useState<Record<string, TeamAverageCost>>({});
  const [currentEarn, setCurrentEarn] = useState<Record<string, number>>({});
  const [currentEarnInputs, setCurrentEarnInputs] = useState<Record<string, string>>({});
  const [averageCostInputs, setAverageCostInputs] = useState<Record<string, string>>({});
  const [remainingMonths, setRemainingMonths] = useState<Record<string, number>>({});
  const [fixedRevenue, setFixedRevenue] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visibleTeams, setVisibleTeams] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const defaultRemaining = Math.max(0, 12 - currentMonth);

      const [teamsRes, costsRes, reportsRes] = await Promise.all([
        supabase.from('teams').select('*').order('name'),
        supabase.from('team_average_costs').select('*'),
        supabase.from('team_reports').select('team, final_earn, year').eq('year', currentYear)
      ]);

      if (teamsRes.error) throw teamsRes.error;
      if (costsRes.error) throw costsRes.error;
      if (reportsRes.error) throw reportsRes.error;

      setTeams(teamsRes.data || []);

      const costsMap: Record<string, TeamAverageCost> = {};
      (costsRes.data || []).forEach((cost: any) => {
        costsMap[cost.team] = cost;
      });
      setCosts(costsMap);
      setLocalCosts(costsMap);
      setAverageCostInputs(
        Object.fromEntries(
          Object.entries(costsMap).map(([teamName, cost]) => [teamName, formatVN(cost.average_monthly_cost)])
        )
      );

      const earnMap: Record<string, number> = {};
      (reportsRes.data || []).forEach((r: any) => {
        earnMap[r.team] = (earnMap[r.team] || 0) + (r.final_earn || 0);
      });
      setCurrentEarn(earnMap);
      setCurrentEarnInputs(
        Object.fromEntries(
          Object.entries(earnMap).map(([teamName, earn]) => [teamName, formatVN(earn)])
        )
      );

      const remainingMap: Record<string, number> = {};
      const fixedMap: Record<string, number> = {};
      (teamsRes.data || []).forEach((t: any) => {
        remainingMap[t.name] = defaultRemaining;
        fixedMap[t.name] = 0;
      });
      setRemainingMonths(remainingMap);
      setFixedRevenue(fixedMap);
    } catch (error: any) {
      toast.error('Lỗi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateLocalCost = (teamName: string, value: string) => {
    const currentCost = localCosts[teamName];
    const costValue = parseVN(value);

    setAverageCostInputs(prev => ({
      ...prev,
      [teamName]: value
    }));

    setLocalCosts(prev => ({
      ...prev,
      [teamName]: {
        ...currentCost,
        team: teamName,
        average_monthly_cost: costValue
      } as TeamAverageCost
    }));
  };

  const updateCurrentEarn = (teamName: string, value: string) => {
    setCurrentEarnInputs(prev => ({
      ...prev,
      [teamName]: value
    }));

    setCurrentEarn(prev => ({
      ...prev,
      [teamName]: parseVN(value)
    }));
  };

  const saveCosts = async () => {
    try {
      setSaving(true);

      for (const [teamName, localCost] of Object.entries(localCosts)) {
        const originalCost = costs[teamName];

        if (originalCost) {
          const { error } = await supabase
            .from('team_average_costs')
            .update({ average_monthly_cost: localCost.average_monthly_cost })
            .eq('id', originalCost.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('team_average_costs')
            .insert({
              team: teamName,
              average_monthly_cost: localCost.average_monthly_cost
            });

          if (error) throw error;
        }
      }

      await fetchData();
      toast.success('Lưu thành công');
      onSave?.();
    } catch (error: any) {
      toast.error('Lỗi lưu dữ liệu: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleTeamVisibility = (teamName: string) => {
    setVisibleTeams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teamName)) {
        newSet.delete(teamName);
      } else {
        newSet.add(teamName);
      }
      return newSet;
    });
  };

  const maskValue = (value: number, teamName: string): string => {
    if (!value) return '0';
    if (visibleTeams.has(teamName)) return formatVN(value);
    return '***';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Earn trung bình tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Earn trung bình tháng</CardTitle>
        <Button onClick={saveCosts} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead>Earn hiện tại</TableHead>
              <TableHead>Earn trung bình tháng</TableHead>
              <TableHead>Số tháng còn lại</TableHead>
              <TableHead>Doanh thu fixed price</TableHead>
              <TableHead>Earn ước tính</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Chưa có team nào
                </TableCell>
              </TableRow>
            ) : (
              teams.map((team) => {
                const visible = visibleTeams.has(team.name);
                const earn = currentEarn[team.name] || 0;
                const avgCost = localCosts[team.name]?.average_monthly_cost || 0;
                const months = remainingMonths[team.name] ?? 0;
                const fixed = fixedRevenue[team.name] || 0;
                const estimated = earn + avgCost * months + fixed;

                return (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{team.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleTeamVisibility(team.name)}
                        >
                          {visible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        placeholder="Nhập earn"
                        value={visible ? (currentEarnInputs[team.name] ?? '') : (earn ? '***' : '')}
                        onChange={(e) => updateCurrentEarn(team.name, e.target.value)}
                        className="max-w-xs"
                        readOnly={!visible && !!earn}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        placeholder="Nhập earn"
                        value={visible ? (averageCostInputs[team.name] ?? '') : (avgCost ? '***' : '')}
                        onChange={(e) => updateLocalCost(team.name, e.target.value)}
                        className="max-w-xs"
                        readOnly={!visible && !!avgCost}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={months}
                        onChange={(e) => setRemainingMonths(prev => ({ ...prev, [team.name]: parseInt(e.target.value) || 0 }))}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        placeholder="Nhập doanh thu"
                        value={visible ? formatVN(fixed) : (fixed ? '***' : '')}
                        onChange={(e) => setFixedRevenue(prev => ({ ...prev, [team.name]: parseVN(e.target.value) }))}
                        className="max-w-xs"
                        readOnly={!visible && !!fixed}
                      />
                    </TableCell>
                    <TableCell className={estimated >= 0 ? 'font-semibold text-green-600 dark:text-green-400' : 'font-semibold text-red-600 dark:text-red-400'}>
                      {maskValue(estimated, team.name)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}