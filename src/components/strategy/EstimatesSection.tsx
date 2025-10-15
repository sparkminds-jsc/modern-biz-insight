import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Project } from '@/types/project';

interface Team {
  id: string;
  name: string;
}

interface ProjectEstimate {
  id: string;
  project_id: string;
  is_estimated: boolean;
  estimated_duration: number;
  team_revenues: Record<string, number>;
  estimated_bill: number;
}

interface EstimatesSectionProps {
  onSave?: () => void;
}

export function EstimatesSection({ onSave }: EstimatesSectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [estimates, setEstimates] = useState<Record<string, ProjectEstimate>>({});
  const [localEstimates, setLocalEstimates] = useState<Record<string, ProjectEstimate>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [projectsRes, teamsRes, estimatesRes] = await Promise.all([
        supabase.from('projects').select('*').neq('status', 'Kết thúc').order('name'),
        supabase.from('teams').select('*').order('name'),
        supabase.from('project_estimates').select('*')
      ]);

      if (projectsRes.error) throw projectsRes.error;
      if (teamsRes.error) throw teamsRes.error;
      if (estimatesRes.error) throw estimatesRes.error;

      setProjects(projectsRes.data || []);
      setTeams(teamsRes.data || []);

      const estimatesMap: Record<string, ProjectEstimate> = {};
      (estimatesRes.data || []).forEach((est: any) => {
        estimatesMap[est.project_id] = est;
      });
      setEstimates(estimatesMap);
      setLocalEstimates(estimatesMap);
    } catch (error: any) {
      toast.error('Lỗi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateLocalEstimate = (projectId: string, field: string, value: any) => {
    const currentEstimate = localEstimates[projectId];
    
    let updateData: any = {};
    if (field === 'is_estimated') {
      updateData = { is_estimated: value === 'true' };
    } else if (field === 'estimated_duration') {
      updateData = { estimated_duration: parseInt(value) };
    } else if (field === 'estimated_bill') {
      updateData = { estimated_bill: parseFloat(value) || 0 };
    } else if (field.startsWith('team_')) {
      const teamName = field.replace('team_', '');
      const teamRevenues = { ...(currentEstimate?.team_revenues || {}), [teamName]: parseFloat(value) || 0 };
      updateData = { team_revenues: teamRevenues };
    }

    setLocalEstimates(prev => ({
      ...prev,
      [projectId]: {
        ...currentEstimate,
        ...updateData,
        project_id: projectId
      } as ProjectEstimate
    }));
  };

  const saveEstimates = async () => {
    try {
      setSaving(true);
      
      for (const [projectId, localEstimate] of Object.entries(localEstimates)) {
        const originalEstimate = estimates[projectId];
        
        if (originalEstimate) {
          const { error } = await supabase
            .from('project_estimates')
            .update({
              is_estimated: localEstimate.is_estimated,
              estimated_duration: localEstimate.estimated_duration,
              team_revenues: localEstimate.team_revenues,
              estimated_bill: localEstimate.estimated_bill
            })
            .eq('id', originalEstimate.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('project_estimates')
            .insert({
              project_id: projectId,
              is_estimated: localEstimate.is_estimated,
              estimated_duration: localEstimate.estimated_duration,
              team_revenues: localEstimate.team_revenues,
              estimated_bill: localEstimate.estimated_bill
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ước tính</CardTitle>
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
        <CardTitle>Ước tính</CardTitle>
        <Button onClick={saveEstimates} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Ước tính</TableHead>
                <TableHead className="min-w-[200px]">Tên dự án</TableHead>
                <TableHead className="min-w-[150px]">Tổng số bill (est)</TableHead>
                {teams.map((team) => (
                  <TableHead key={team.id} className="min-w-[150px]">{team.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={teams.length + 3} className="text-center text-muted-foreground">
                    Chưa có dự án nào
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => {
                  const estimate = localEstimates[project.id];
                  return (
                    <TableRow key={project.id}>
                      <TableCell>
                        <Select
                          value={estimate?.is_estimated?.toString() || 'false'}
                          onValueChange={(value) => updateLocalEstimate(project.id, 'is_estimated', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Có</SelectItem>
                            <SelectItem value="false">Không</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Tổng số bill"
                          value={estimate?.estimated_bill || ''}
                          onChange={(e) => updateLocalEstimate(project.id, 'estimated_bill', e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      {teams.map((team) => (
                        <TableCell key={team.id}>
                          <Input
                            type="number"
                            placeholder="Doanh thu trung bình tháng"
                            value={estimate?.team_revenues?.[team.name] || ''}
                            onChange={(e) => updateLocalEstimate(project.id, `team_${team.name}`, e.target.value)}
                            className="w-full"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
