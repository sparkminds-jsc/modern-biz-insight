
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateTeamReportDialogProps {
  open: boolean;
  onClose: () => void;
  teams: string[];
  onSave: () => void;
}

export function CreateTeamReportDialog({ open, onClose, teams, onSave }: CreateTeamReportDialogProps) {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString(),
    team: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.team) {
      toast.error('Vui lòng chọn team');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('team_reports')
        .insert({
          year: parseInt(formData.year),
          month: parseInt(formData.month),
          team: formData.team,
          final_bill: 0, // Will be calculated from details
          final_pay: 0, // Will be calculated from details
          final_save: 0, // Will be calculated from details
          final_earn: 0, // Will be calculated from details
          storage_usd: 0, // Will be calculated from details
          storage_usdt: 0, // Will be calculated from details
          notes: formData.notes
        });

      if (error) throw error;

      toast.success('Tạo báo cáo thành công');
      onSave();
      onClose();
      // Reset form
      setFormData({
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth() + 1).toString(),
        team: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating team report:', error);
      toast.error('Có lỗi xảy ra khi tạo báo cáo');
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
          <DialogTitle>Tạo báo cáo Team</DialogTitle>
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
            <Label htmlFor="team">Team</Label>
            <Select value={formData.team} onValueChange={(value) => handleInputChange('team', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team} value={team}>{team}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              {loading ? 'Đang tạo...' : 'Tạo báo cáo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
