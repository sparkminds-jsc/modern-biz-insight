import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ProjectFormData } from '@/types/project';

interface ProjectFormProps {
  onProjectCreated: () => void;
}

export function ProjectForm({ onProjectCreated }: ProjectFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    status: 'Đang chạy'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          name: formData.name,
          description: formData.description,
          status: formData.status
        });

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Dự án đã được tạo thành công",
      });

      setFormData({ name: '', description: '', status: 'Đang chạy' });
      setOpen(false);
      onProjectCreated();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo dự án",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tạo dự án
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo dự án mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên dự án</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Thông tin dự án</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Đang chạy">Đang chạy</SelectItem>
                <SelectItem value="Kết thúc">Kết thúc</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo dự án'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}