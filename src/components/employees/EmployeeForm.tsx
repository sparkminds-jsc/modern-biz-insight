
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Employee {
  id?: string;
  employee_code: string;
  full_name: string;
  email: string;
  birth_date: string | null;
  contract_type: string;
  contract_end_date: string | null;
  position: string;
  team: string;
  status: string;
}

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: Employee) => void;
  employee?: Employee;
  title: string;
}

const CONTRACT_TYPES = ['Fresher', 'Thử việc', 'Một năm', 'Ba năm', 'Vĩnh viễn', 'Thời vụ'];
const STATUSES = ['Đang làm', 'Đã nghỉ'];
const SALARY_YEARS = Array.from({ length: 11 }, (_, i) => 2021 + i);

interface SalaryHistory {
  id?: string;
  year: number;
  gross_salary: number;
  company_payment: number;
  _isNew?: boolean;
}

const formatVN = (n: number) => (isNaN(n) || n === 0 ? '' : new Intl.NumberFormat('vi-VN').format(n));
const parseVN = (s: string) => {
  const cleaned = s.replace(/\./g, '').replace(/,/g, '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
};

export function EmployeeForm({ isOpen, onClose, onSubmit, employee, title }: EmployeeFormProps) {
  const [formData, setFormData] = useState<Employee>({
    employee_code: '',
    full_name: '',
    email: '',
    birth_date: null,
    contract_type: 'Fresher',
    contract_end_date: null,
    position: '',
    team: '',
    status: 'Đang làm'
  });
  const [teams, setTeams] = useState<string[]>([]);
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistory[]>([]);
  const [deletedHistoryIds, setDeletedHistoryIds] = useState<string[]>([]);

  // Fetch teams from database
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('name')
          .order('name');

        if (error) throw error;
        setTeams(data?.map(team => team.name) || []);
      } catch (error) {
        console.error('Error fetching teams:', error);
        // Fallback to default teams if database fetch fails
        setTeams(['Team Đạt', 'Team Giang', 'Team Yến', 'Team Support']);
      }
    };

    if (isOpen) {
      fetchTeams();
    }
  }, [isOpen]);

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData({
        employee_code: '',
        full_name: '',
        email: '',
        birth_date: null,
        contract_type: 'Fresher',
        contract_end_date: null,
        position: '',
        team: teams.length > 0 ? teams[0] : '',
        status: 'Đang làm'
      });
    }
  }, [employee, isOpen, teams]);

  // Fetch salary history when editing
  useEffect(() => {
    const fetchHistory = async () => {
      if (!employee?.id || !isOpen) {
        setSalaryHistory([]);
        setDeletedHistoryIds([]);
        return;
      }
      const { data, error } = await supabase
        .from('salary_increase_history')
        .select('*')
        .eq('employee_id', employee.id)
        .order('year', { ascending: true });
      if (!error && data) {
        setSalaryHistory(data.map((d: any) => ({
          id: d.id,
          year: d.year,
          gross_salary: Number(d.gross_salary),
          company_payment: Number(d.company_payment),
        })));
      }
      setDeletedHistoryIds([]);
    };
    fetchHistory();
  }, [employee?.id, isOpen]);

  const persistSalaryHistory = async (employeeId: string) => {
    // Delete removed
    if (deletedHistoryIds.length > 0) {
      await supabase.from('salary_increase_history').delete().in('id', deletedHistoryIds);
    }
    // Upsert each
    for (const h of salaryHistory) {
      if (h.id && !h._isNew) {
        await supabase.from('salary_increase_history').update({
          year: h.year,
          gross_salary: h.gross_salary,
          company_payment: h.company_payment,
        }).eq('id', h.id);
      } else {
        await supabase.from('salary_increase_history').insert({
          employee_id: employeeId,
          year: h.year,
          gross_salary: h.gross_salary,
          company_payment: h.company_payment,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (employee?.id) {
        await persistSalaryHistory(employee.id);
      }
    } catch (err: any) {
      toast({ title: 'Lỗi', description: err.message || 'Không thể lưu lịch sử tăng lương', variant: 'destructive' });
      return;
    }
    onSubmit({ ...formData, _pendingSalaryHistory: employee?.id ? undefined : salaryHistory } as any);
  };

  const addHistoryRow = () => {
    const lastYear = salaryHistory.length > 0 ? salaryHistory[salaryHistory.length - 1].year + 1 : new Date().getFullYear();
    const year = Math.min(Math.max(lastYear, 2021), 2031);
    setSalaryHistory(prev => [...prev, { year, gross_salary: 0, company_payment: 0, _isNew: true }]);
  };

  const updateHistoryRow = (idx: number, field: keyof SalaryHistory, value: any) => {
    setSalaryHistory(prev => prev.map((h, i) => i === idx ? { ...h, [field]: value } : h));
  };

  const removeHistoryRow = (idx: number) => {
    setSalaryHistory(prev => {
      const row = prev[idx];
      if (row.id && !row._isNew) {
        setDeletedHistoryIds(d => [...d, row.id!]);
      }
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleChange = (field: keyof Employee, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employee_code">Mã nhân viên</Label>
              <Input
                id="employee_code"
                value={formData.employee_code}
                onChange={(e) => handleChange('employee_code', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="full_name">Họ và tên</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="birth_date">Ngày sinh</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date || ''}
                onChange={(e) => handleChange('birth_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="position">Chức vụ</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contract_type">Loại hợp đồng</Label>
              <Select value={formData.contract_type} onValueChange={(value) => handleChange('contract_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTRACT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contract_end_date">Ngày kết thúc HĐ</Label>
              <Input
                id="contract_end_date"
                type="date"
                value={formData.contract_end_date || ''}
                onChange={(e) => handleChange('contract_end_date', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="team">Team</Label>
              <Select value={formData.team} onValueChange={(value) => handleChange('team', value)}>
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
            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {employee ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
