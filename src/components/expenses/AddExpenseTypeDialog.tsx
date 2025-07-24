import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddExpenseTypeDialogProps {
  onExpenseTypeAdded: () => void;
}

export function AddExpenseTypeDialog({ onExpenseTypeAdded }: AddExpenseTypeDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên loại chi phí');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('expense_types')
        .insert([{ name: name.trim() }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('Loại chi phí này đã tồn tại');
        } else {
          throw error;
        }
        return;
      }

      toast.success('Thêm loại chi phí thành công!');
      setName('');
      setOpen(false);
      onExpenseTypeAdded();
    } catch (error) {
      console.error('Error adding expense type:', error);
      toast.error('Có lỗi xảy ra khi thêm loại chi phí');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Thêm Loại Chi Phí
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm Loại Chi Phí Mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên Loại Chi Phí</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên loại chi phí..."
              disabled={loading}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang thêm...' : 'Thêm'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}