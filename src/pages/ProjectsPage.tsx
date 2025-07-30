import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { ProjectTable } from '@/components/projects/ProjectTable';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/types/project';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState('');
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách dự án",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(nameFilter.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý dự án</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin các dự án trong công ty
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <ProjectFilters
            nameFilter={nameFilter}
            onNameFilterChange={setNameFilter}
          />
          <ProjectForm onProjectCreated={fetchProjects} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách dự án</CardTitle>
            <CardDescription>
              Tổng cộng: {filteredProjects.length} dự án
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Đang tải...</div>
            ) : (
              <ProjectTable projects={filteredProjects} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}