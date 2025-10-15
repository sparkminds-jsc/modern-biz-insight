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

export function AverageCostsSection({ onSave }: AverageCostsSectionProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [costs, setCosts] = useState<Record<string, TeamAverageCost>>({});
  const [localCosts, setLocalCosts] = useState<Record<string, TeamAverageCost>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visibleTeams, setVisibleTeams] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [teamsRes, costsRes] = await Promise.all([
        supabase.from('teams').select('*').order('name'),
        supabase.from('team_average_costs').select('*')
      ]);

      if (teamsRes.error) throw teamsRes.error;
      if (costsRes.error) throw costsRes.error;

      setTeams(teamsRes.data || []);

      const costsMap: Record<string, TeamAverageCost> = {};
      (costsRes.data || []).forEach((cost: any) => {
        costsMap[cost.team] = cost;
      });
      setCosts(costsMap);
      setLocalCosts(costsMap);
    } catch (error: any) {
      toast.error('Lỗi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateLocalCost = (teamName: string, value: string) => {
    const currentCost = localCosts[teamName];
    const costValue = parseFloat(value) || 0;

    setLocalCosts(prev => ({
      ...prev,
      [teamName]: {
        ...currentCost,
        team: teamName,
        average_monthly_cost: costValue
      } as TeamAverageCost
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

  const formatCostValue = (value: number | undefined, teamName: string) => {
    if (visibleTeams.has(teamName)) {
      return value || '';
    }
    return value ? '***' : '';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chi phí trung bình tháng</CardTitle>
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
        <CardTitle>Chi phí trung bình tháng</CardTitle>
        <Button onClick={saveCosts} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead>Chi phí trung bình tháng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  Chưa có team nào
                </TableCell>
              </TableRow>
            ) : (
              teams.map((team) => (
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
                        {visibleTeams.has(team.name) ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type={visibleTeams.has(team.name) ? "number" : "text"}
                      placeholder="Nhập chi phí"
                      value={formatCostValue(localCosts[team.name]?.average_monthly_cost, team.name)}
                      onChange={(e) => updateLocalCost(team.name, e.target.value)}
                      className="max-w-xs"
                      readOnly={!visibleTeams.has(team.name) && !!localCosts[team.name]?.average_monthly_cost}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
