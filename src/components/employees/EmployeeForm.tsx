
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
