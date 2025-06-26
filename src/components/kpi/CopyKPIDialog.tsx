
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { monthOptions, yearOptions } from './form/kpiFormOptions';

interface CopyKPIDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCopy: (month: number, year: number) => void;
}

interface CopyFormData {
  month: number;
  year: number;
}

export function CopyKPIDialog({ isOpen, onClose, onCopy }: CopyKPIDialogProps) {
  const [loading, setLoading] = useState(false);

  const { handleSubmit, setValue, watch } = useForm<CopyFormData>({
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: CopyFormData) => {
    try {
      setLoading(true);
      await onCopy(data.month, data.year);
      toast.success('Đã copy KPI thành công');
      onClose();
    } catch (error) {
      console.error('Error copying KPI:', error);
      toast.error('Không thể copy KPI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Copy KPI</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tháng</Label>
              <Select
                value={watchedValues.month?.toString()}
                onValueChange={(value) => setValue('month', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tháng..." />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Năm</Label>
              <Select
                value={watchedValues.year?.toString()}
                onValueChange={(value) => setValue('year', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn năm..." />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang copy...' : 'Đồng ý'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
