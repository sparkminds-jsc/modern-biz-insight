
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TeamReportDetailEditDialogProps {
  open: boolean;
  onClose: () => void;
  detail: any;
  employees: any[];
  teamReport: any;
  onSave: () => void;
}

export function TeamReportDetailEditDialog({ 
  open, 
  onClose, 
  detail, 
  employees, 
  teamReport, 
  onSave 
}: TeamReportDetailEditDialogProps) {
  const [formData, setFormData] = useState({
    employee_code: '',
    employee_name: '',
    project_id: '',
    billable_hours: '',
    rate: '',
    fx_rate: '',
    percentage: '',
    package_vnd: '',
    has_salary: false,
    company_payment: '',
    salary_13: '',
    storage_usd: '',
    storage_usdt: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  // Fetch active projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Fetching projects for edit dialog...');
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .eq('status', 'Đang chạy')
          .order('name');
        
        if (error) {
          console.error('Error fetching projects:', error);
          throw error;
        }
        
        console.log('Projects fetched for edit:', data);
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]); // Ensure projects is always an array
      }
    };

    if (open) {
      fetchProjects();
    }
  }, [open]);

  useEffect(() => {
    if (detail) {
      setFormData({
        employee_code: detail.employee_code || '',
        employee_name: detail.employee_name || '',
        project_id: detail.project_id || 'none',
        billable_hours: detail.billable_hours?.toString() || '',
        rate: detail.rate?.toString() || '',
        fx_rate: detail.fx_rate?.toString() || '',
        percentage: detail.percentage?.toString() || '',
        package_vnd: detail.package_vnd?.toString() || '',
        has_salary: detail.has_salary || false,
        company_payment: detail.company_payment?.toString() || '',
        salary_13: detail.salary_13?.toString() || '',
        storage_usd: detail.storage_usd?.toString() || '',
        storage_usdt: detail.storage_usdt?.toString() || '',
        notes: detail.notes || ''
      });
    }
  }, [detail]);

  const handleEmployeeChange = (employeeCode: string) => {
    const employee = employees.find(emp => emp.employee_code === employeeCode);
    if (employee) {
      setFormData(prev => ({
        ...prev,
        employee_code: employeeCode,
        employee_name: employee.full_name
      }));
      
      // Fetch salary data if has_salary is true
      if (formData.has_salary) {
        fetchSalaryData(employeeCode);
      }
    }
  };

  const fetchSalaryData = async (employeeCode: string) => {
    try {
      const { data, error } = await supabase
        .from('salary_details')
        .select('*')
        .eq('employee_code', employeeCode)
        .eq('month', teamReport.month)
        .eq('year', teamReport.year)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        const companyPayment = data.total_company_payment || 0;
        const salary13 = (data.gross_salary + data.kpi_bonus) / 12 || 0;
        
        setFormData(prev => ({
          ...prev,
          company_payment: companyPayment.toString(),
          salary_13: salary13.toString()
        }));
      }
    } catch (error) {
      console.error('Error fetching salary data:', error);
    }
  };

  const handleHasSalaryChange = (value: string) => {
    const hasSalary = value === 'true';
    setFormData(prev => ({
      ...prev,
      has_salary: hasSalary,
      company_payment: hasSalary ? prev.company_payment : '0',
      salary_13: hasSalary ? prev.salary_13 : '0'
    }));

    if (hasSalary && formData.employee_code) {
      fetchSalaryData(formData.employee_code);
    }
  };

  const calculateConvertedVnd = () => {
    const hours = parseFloat(formData.billable_hours) || 0;
    const rate = parseFloat(formData.rate) || 0;
    const fxRate = parseFloat(formData.fx_rate) || 0;
    const percentage = parseFloat(formData.percentage) || 0;
    return hours * rate * fxRate * percentage / 100;
  };

  const calculateTotalPayment = () => {
    const companyPayment = parseFloat(formData.company_payment) || 0;
    const salary13 = parseFloat(formData.salary_13) || 0;
    return companyPayment + salary13;
  };

  const calculatePercentageRatio = () => {
    const convertedVnd = calculateConvertedVnd();
    const packageVnd = parseFloat(formData.package_vnd) || 0;
    const totalPayment = calculateTotalPayment();
    const total = convertedVnd + packageVnd;
    return total === 0 ? 0 : (totalPayment / total) * 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('team_report_details')
        .update({
          employee_code: formData.employee_code,
          employee_name: formData.employee_name,
          project_id: formData.project_id === 'none' ? null : formData.project_id,
          billable_hours: parseFloat(formData.billable_hours) || 0,
          rate: parseFloat(formData.rate) || 0,
          fx_rate: parseFloat(formData.fx_rate) || 0,
          percentage: parseFloat(formData.percentage) || 0,
          package_vnd: parseFloat(formData.package_vnd) || 0,
          has_salary: formData.has_salary,
          company_payment: parseFloat(formData.company_payment) || 0,
          salary_13: parseFloat(formData.salary_13) || 0,
          storage_usd: parseFloat(formData.storage_usd) || 0,
          storage_usdt: parseFloat(formData.storage_usdt) || 0,
          notes: formData.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', detail.id);

      if (error) throw error;

      toast.success('Cập nhật thành công');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating team report detail:', error);
      toast.error('Có lỗi xảy ra khi cập nhật');
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa báo cáo bill</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_code">Mã nhân viên</Label>
              <Select value={formData.employee_code} onValueChange={handleEmployeeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhân viên" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.employee_code} value={employee.employee_code}>
                      {employee.employee_code} - {employee.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee_name">Tên nhân viên</Label>
              <Input
                id="employee_name"
                value={formData.employee_name}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>

          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project_id">Dự án</Label>
            <Select value={formData.project_id} onValueChange={(value) => handleInputChange('project_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn dự án" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="none">-- Không chọn dự án --</SelectItem>
                {Array.isArray(projects) && projects.map((project) => (
                  project && project.id && project.name ? (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ) : null
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Tháng</Label>
              <Input
                id="month"
                value={teamReport?.month || ''}
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Năm</Label>
              <Input
                id="year"
                value={teamReport?.year || ''}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billable_hours">Giờ có bill</Label>
              <Input
                id="billable_hours"
                type="number"
                step="0.01"
                value={formData.billable_hours}
                onChange={(e) => handleInputChange('billable_hours', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Rate</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                value={formData.rate}
                onChange={(e) => handleInputChange('rate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fx_rate">FX Rate</Label>
              <Input
                id="fx_rate"
                type="number"
                step="0.01"
                value={formData.fx_rate}
                onChange={(e) => handleInputChange('fx_rate', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="percentage">Percentage (%)</Label>
              <Input
                id="percentage"
                type="number"
                step="0.01"
                value={formData.percentage}
                onChange={(e) => handleInputChange('percentage', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="package_vnd">Trọn gói VND</Label>
              <Input
                id="package_vnd"
                type="number"
                step="0.01"
                value={formData.package_vnd}
                onChange={(e) => handleInputChange('package_vnd', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Qui đổi VND</Label>
            <Input
              value={Math.round(calculateConvertedVnd()).toLocaleString('vi-VN')}
              readOnly
              className="bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="has_salary">Có tính lương</Label>
            <Select value={formData.has_salary.toString()} onValueChange={handleHasSalaryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Có</SelectItem>
                <SelectItem value="false">Không</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_payment">Công ty chi trả</Label>
              <Input
                id="company_payment"
                type="number"
                step="0.01"
                value={formData.company_payment}
                onChange={(e) => handleInputChange('company_payment', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_13">Tăng ca</Label>
              <Input
                id="salary_13"
                type="number"
                step="0.01"
                value={formData.salary_13}
                onChange={(e) => handleInputChange('salary_13', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tổng chi trả</Label>
            <Input
              value={Math.round(calculateTotalPayment()).toLocaleString('vi-VN')}
              readOnly
              className="bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
