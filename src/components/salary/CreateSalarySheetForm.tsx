
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SalarySheet } from '@/types/salary';

interface CreateSalarySheetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  existingSalarySheets: SalarySheet[];
}

export function CreateSalarySheetForm({ 
  isOpen, 
  onClose, 
  onSave, 
  existingSalarySheets 
}: CreateSalarySheetFormProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const months = [
    { value: '1', label: 'Tháng 01' },
    { value: '2', label: 'Tháng 02' },
    { value: '3', label: 'Tháng 03' },
    { value: '4', label: 'Tháng 04' },
    { value: '5', label: 'Tháng 05' },
    { value: '6', label: 'Tháng 06' },
    { value: '7', label: 'Tháng 07' },
    { value: '8', label: 'Tháng 08' },
    { value: '9', label: 'Tháng 09' },
    { value: '10', label: 'Tháng 10' },
    { value: '11', label: 'Tháng 11' },
    { value: '12', label: 'Tháng 12' }
  ];

  const years = ['2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031'];

  const handleSubmit = async () => {
    if (!selectedMonth || !selectedYear) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn tháng và năm',
        variant: 'destructive',
      });
      return;
    }

    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);

    // Check if combination already exists
    const exists = existingSalarySheets.some(
      sheet => sheet.month === month && sheet.year === year
    );

    if (exists) {
      toast({
        title: 'Lỗi',
        description: `Bảng lương cho tháng ${month.toString().padStart(2, '0')}/${year} đã tồn tại`,
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('salary_sheets')
        .insert({
          month,
          year,
          total_net_salary: 0,
          total_personal_income_tax: 0,
          total_company_insurance: 0,
          total_personal_insurance: 0,
          total_payment: 0
        });

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: `Đã tạo bảng lương cho tháng ${month.toString().padStart(2, '0')}/${year}`,
      });

      onSave();
      onClose();
      setSelectedMonth('');
      setSelectedYear('');
    } catch (error) {
      console.error('Error creating salary sheet:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo bảng lương',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo bảng lương mới</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tháng
            </label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn tháng" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Năm
            </label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn năm" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
