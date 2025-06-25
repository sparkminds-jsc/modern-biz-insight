
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateTeamDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function CreateTeamDialog({ open, onClose, onSave }: CreateTeamDialogProps) {
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      toast.error('Vui lòng nhập tên team');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('teams')
        .insert({
          name: teamName.trim()
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('Tên team đã tồn tại');
        } else {
          throw error;
        }
      } else {
        toast.success('Tạo team thành công');
        onSave();
        onClose();
        setTeamName('');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Có lỗi xảy ra khi tạo team');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTeamName('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo Team mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teamName">Tên Team</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Nhập tên team"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo Team'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
