import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
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
  const [statusFilter, setStatusFilter] = useState('Đang chạy');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*');

      if (error) throw error;
      
      // Sort by status (Đang chạy first) then by created_at
      const sortedData = (data || []).sort((a, b) => {
        if (a.status === 'Đang chạy' && b.status !== 'Đang chạy') return -1;
        if (a.status !== 'Đang chạy' && b.status === 'Đang chạy') return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      setProjects(sortedData);
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

  const filteredProjects = projects.filter(project => {
    const matchesName = project.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesName && matchesStatus;
  });

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingProject(null);
  };

  return (
    <AppLayout>
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
            statusFilter={statusFilter}
            onNameFilterChange={setNameFilter}
            onStatusFilterChange={setStatusFilter}
          />
          <ProjectForm onProjectCreated={fetchProjects} />
        </div>
        
        <ProjectForm 
          project={editingProject}
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setEditingProject(null);
          }}
          onProjectCreated={() => {
            fetchProjects();
            handleEditDialogClose();
          }}
        />

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
              <ProjectTable projects={filteredProjects} onEdit={handleEdit} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </AppLayout>
  );
}