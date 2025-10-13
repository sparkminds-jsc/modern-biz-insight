import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Team {
  id: string;
  name: string;
}

interface TeamAverageCost {
  id: string;
  team: string;
  average_monthly_cost: number;
}

export function AverageCostsSection() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [costs, setCosts] = useState<Record<string, TeamAverageCost>>({});
  const [loading, setLoading] = useState(true);

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
    } catch (error: any) {
      toast.error('Lỗi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCost = async (teamName: string, value: string) => {
    try {
      const currentCost = costs[teamName];
      const costValue = parseFloat(value) || 0;

      if (currentCost) {
        const { error } = await supabase
          .from('team_average_costs')
          .update({ average_monthly_cost: costValue })
          .eq('id', currentCost.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('team_average_costs')
          .insert({
            team: teamName,
            average_monthly_cost: costValue
          });

        if (error) throw error;
      }

      await fetchData();
      toast.success('Cập nhật thành công');
    } catch (error: any) {
      toast.error('Lỗi cập nhật: ' + error.message);
    }
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
      <CardHeader>
        <CardTitle>Chi phí trung bình tháng</CardTitle>
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
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="Nhập chi phí"
                      value={costs[team.name]?.average_monthly_cost || ''}
                      onChange={(e) => updateCost(team.name, e.target.value)}
                      className="max-w-xs"
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
