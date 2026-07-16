import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Copy, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { SalaryDetailFilters } from '@/types/salary';

interface SalaryDetailFiltersProps {
  filters: SalaryDetailFilters;
  onFiltersChange: (filters: SalaryDetailFilters) => void;
  onSearch: () => void;
  onAddEmployee: () => void;
  onCopySalarySheet: () => void;
  month?: number;
  year?: number;
}

export function SalaryDetailFilters({
  filters,
  onFiltersChange,
  onSearch,
  onAddEmployee,
  onCopySalarySheet,
  month,
  year,
}: SalaryDetailFiltersProps) {
  const [teams, setTeams] = useState<string[]>(['Tất cả']);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showConfirmImport, setShowConfirmImport] = useState(false);
  const [importFileName, setImportFileName] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('name')
        .order('name');

      if (!error && data) {
        setTeams(['Tất cả', ...data.map(team => team.name)]);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="employee-code">Mã nhân viên</Label>
          <Input
            id="employee-code"
            placeholder="Nhập mã nhân viên"
            value={filters.employee_code}
            onChange={(e) =>
              onFiltersChange({ ...filters, employee_code: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employee-name">Tên nhân viên</Label>
          <Input
            id="employee-name"
            placeholder="Nhập tên nhân viên"
            value={filters.employee_name}
            onChange={(e) =>
              onFiltersChange({ ...filters, employee_name: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="team">Team</Label>
          <Select
            value={filters.team}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, team: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn team" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {teams.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end space-x-2">
          <Button onClick={onSearch} className="flex-1">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={onAddEmployee} variant="default">
          <Plus className="w-4 h-4 mr-2" />
          Thêm lương nhân viên
        </Button>
        <Button onClick={onCopySalarySheet} variant="outline">
          <Copy className="w-4 h-4 mr-2" />
          Copy bảng lương
        </Button>
        <Button onClick={() => setShowImportDialog(true)} variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Import File Lương
        </Button>
      </div>

      {/* Input file name dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import File Lương</DialogTitle>
            <DialogDescription>Nhập tên file lương cần import</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="import-file-name">Tên file</Label>
            <Input
              id="import-file-name"
              value={importFileName}
              onChange={(e) => setImportFileName(e.target.value)}
              placeholder="Nhập tên file..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>Hủy</Button>
            <Button
              onClick={() => {
                if (!importFileName.trim()) {
                  toast.error('Vui lòng nhập tên file');
                  return;
                }
                setShowImportDialog(false);
                setShowConfirmImport(true);
              }}
            >
              Đồng ý
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm import dialog */}
      <AlertDialog open={showConfirmImport} onOpenChange={setShowConfirmImport}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận import</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn chắc chắn import <strong>{importFileName}</strong> vào bảng lương{' '}
              <strong>{month?.toString().padStart(2, '0')}/{year}</strong> chứ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast.success(`Đã import ${importFileName} vào bảng lương ${month?.toString().padStart(2, '0')}/${year}`);
                setImportFileName('');
                setShowConfirmImport(false);
              }}
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
