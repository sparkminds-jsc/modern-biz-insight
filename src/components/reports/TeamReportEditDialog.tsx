
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TeamReportEditDialogProps {
  open: boolean;
  onClose: () => void;
  report: any;
  onSave: () => void;
}

export function TeamReportEditDialog({ open, onClose, report, onSave }: TeamReportEditDialogProps) {
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    storage_usd: '',
    storage_usdt: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (report) {
      setFormData({
        year: report.year?.toString() || '',
        month: report.month?.toString() || '',
        storage_usd: report.storage_usd?.toString() || '',
        storage_usdt: report.storage_usdt?.toString() || '',
        notes: report.notes || ''
      });
    }
  }, [report]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('team_reports')
        .update({
          year: parseInt(formData.year),
          month: parseInt(formData.month),
          storage_usd: parseFloat(formData.storage_usd) || 0,
          storage_usdt: parseFloat(formData.storage_usdt) || 0,
          notes: formData.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', report.id);

      if (error) throw error;

      toast.success('Cập nhật báo cáo thành công');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating team report:', error);
      toast.error('Có lỗi xảy ra khi cập nhật báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa báo cáo Team</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Năm</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="month">Tháng</Label>
              <Input
                id="month"
                type="number"
                min="1"
                max="12"
                value={formData.month}
                onChange={(e) => handleInputChange('month', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storage_usd">Lưu trữ USD</Label>
            <Input
              id="storage_usd"
              type="number"
              step="0.01"
              value={formData.storage_usd}
              onChange={(e) => handleInputChange('storage_usd', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storage_usdt">Lưu trữ USDT</Label>
            <Input
              id="storage_usdt" 
              type="number"
              step="0.01"
              value={formData.storage_usdt}
              onChange={(e) => handleInputChange('storage_usdt', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Chú thích</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
