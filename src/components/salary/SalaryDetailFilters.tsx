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
import { Search, Plus, Copy, Upload, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
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
  salarySheetId?: string;
  onImported?: () => void;
}

export function SalaryDetailFilters({
  filters,
  onFiltersChange,
  onSearch,
  onAddEmployee,
  onCopySalarySheet,
  month,
  year,
  salarySheetId,
  onImported,
}: SalaryDetailFiltersProps) {
  const [teams, setTeams] = useState<string[]>(['Tất cả']);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importStep, setImportStep] = useState<'input' | 'confirm'>('input');
  const [importFileName, setImportFileName] = useState('');
  const [importPassword, setImportPassword] = useState('');
  const [importing, setImporting] = useState(false);
  const [showImportPassword, setShowImportPassword] = useState(false);

  const clearDialogLock = () => {
    window.setTimeout(() => {
      document.body.style.pointerEvents = '';
    }, 0);
  };

  const closeImportDialog = (resetFields = false) => {
    setShowImportDialog(false);
    setImportStep('input');
    if (resetFields) {
      setImportFileName('');
      setImportPassword('');
    }
    clearDialogLock();
  };

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

  const computeSalaryFields = (input: {
    gross_salary: number;
    working_days: number;
    kpi_bonus: number;
    overtime_1_5: number;
    overtime_2: number;
    overtime_3: number;
    insurance_base_amount: number;
    dependent_count: number;
    salary_type: string;
    personal_deduction: number;
    dependent_deduction_unit: number;
  }) => {
    const {
      gross_salary, working_days, kpi_bonus,
      overtime_1_5, overtime_2, overtime_3,
      insurance_base_amount, dependent_count, salary_type,
      personal_deduction, dependent_deduction_unit,
    } = input;

    const daily_rate = gross_salary / 22;
    const daily_salary = daily_rate * working_days;
    const total_income = daily_salary + kpi_bonus + overtime_1_5 + overtime_2 + overtime_3;

    const withBH = salary_type === 'Lương có BH';
    const bhdn_bhxh = withBH ? insurance_base_amount * 0.17 : 0;
    const bhdn_tnld = withBH ? insurance_base_amount * 0.005 : 0;
    const bhdn_bhyt = withBH ? insurance_base_amount * 0.03 : 0;
    const bhdn_bhtn = withBH ? gross_salary * 0.01 : 0;
    const total_bhdn = bhdn_bhxh + bhdn_tnld + bhdn_bhyt + bhdn_bhtn;
    const total_company_payment = total_income + total_bhdn;

    const bhnld_bhxh = withBH ? insurance_base_amount * 0.08 : 0;
    const bhnld_bhyt = withBH ? insurance_base_amount * 0.015 : 0;
    const bhnld_bhtn = withBH ? gross_salary * 0.01 : 0;
    const total_bhnld = bhnld_bhxh + bhnld_bhyt + bhnld_bhtn;

    const dependent_deduction = dependent_count * dependent_deduction_unit;
    const insurance_deduction = total_bhnld;
    const total_deduction = personal_deduction + dependent_deduction + insurance_deduction;

    let taxable_income = 0;
    let total_personal_income_tax = 0;
    let tax_5_percent = 0, tax_10_percent = 0, tax_15_percent = 0;
    let tax_20_percent = 0, tax_25_percent = 0, tax_30_percent = 0, tax_35_percent = 0;

    if (salary_type === 'Lương thời vụ') {
      total_personal_income_tax = total_income >= personal_deduction ? total_income * 0.1 : 0;
    } else {
      taxable_income = Math.max(0, total_income - total_deduction);
      if (taxable_income > 0) {
        tax_5_percent = Math.min(taxable_income, 10000000) * 0.05;
        if (taxable_income > 10000000) tax_10_percent = Math.min(taxable_income - 10000000, 20000000) * 0.10;
        if (taxable_income > 30000000) tax_20_percent = Math.min(taxable_income - 30000000, 30000000) * 0.20;
        if (taxable_income > 60000000) tax_30_percent = Math.min(taxable_income - 60000000, 40000000) * 0.30;
        if (taxable_income > 100000000) tax_35_percent = (taxable_income - 100000000) * 0.35;
      }
      total_personal_income_tax =
        tax_5_percent + tax_10_percent + tax_15_percent +
        tax_20_percent + tax_25_percent + tax_30_percent + tax_35_percent;
    }

    const net_salary = total_income - total_bhnld - total_personal_income_tax;
    return {
      daily_rate, daily_salary, total_income,
      bhdn_bhxh, bhdn_tnld, bhdn_bhyt, bhdn_bhtn, total_bhdn, total_company_payment,
      bhnld_bhxh, bhnld_bhyt, bhnld_bhtn, total_bhnld,
      personal_deduction, dependent_deduction, insurance_deduction, total_deduction,
      taxable_income,
      tax_5_percent, tax_10_percent, tax_15_percent,
      tax_20_percent, tax_25_percent, tax_30_percent, tax_35_percent,
      total_personal_income_tax, net_salary,
    };
  };

  const handleImportSalary = async (opts: {
    fileName: string;
    password: string;
    month: number;
    year: number;
    salarySheetId: string;
  }) => {
    const { fileName, password, month, year, salarySheetId } = opts;

    // Call webhook with basic auth
    const authHeader = 'Basic ' + btoa(`sparkminds:${password}`);
    const res = await fetch('https://auto.sparkminds.net/webhook/import_file_luong', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({ file_name: fileName }),
    });
    if (!res.ok) throw new Error(`Webhook trả về lỗi ${res.status}`);
    const text = await res.text();
    let list: any[] = [];
    const isEmployeeObj = (o: any) => o && typeof o === 'object' && !Array.isArray(o) && ('Mã nhân viên' in o);
    const collect = (val: any) => {
      if (Array.isArray(val)) val.forEach(collect);
      else if (isEmployeeObj(val)) list.push(val);
      else if (val && typeof val === 'object') {
        if (Array.isArray((val as any).data)) (val as any).data.forEach(collect);
        else Object.values(val).forEach((v) => { if (Array.isArray(v) || isEmployeeObj(v)) collect(v); });
      }
    };
    try {
      collect(JSON.parse(text));
    } catch {
      // Fallback: NDJSON or concatenated JSON objects
      const matches = text.match(/\{[^{}]*\}/g) || [];
      for (const m of matches) {
        try { collect(JSON.parse(m)); } catch { /* ignore */ }
      }
    }
    if (list.length === 0) {
      throw new Error('Webhook không trả về dữ liệu nhân viên');
    }

    // Fetch deduction settings
    const { data: settingsData } = await supabase
      .from('app_settings')
      .select('key, value')
      .in('key', ['personal_deduction', 'dependent_deduction']);
    const settingsMap = new Map((settingsData || []).map((r: any) => [r.key, Number(r.value)]));
    const personal_deduction = settingsMap.get('personal_deduction') ?? 15500000;
    const dependent_deduction_unit = settingsMap.get('dependent_deduction') ?? 6200000;

    // Fetch employees for name/team lookup
    const codes = list.map(r => String(r['Mã nhân viên'] || '').trim()).filter(Boolean);
    const { data: empData } = await supabase
      .from('employees')
      .select('employee_code, full_name, team')
      .in('employee_code', codes);
    const empMap = new Map((empData || []).map((e: any) => [e.employee_code, e]));

    // Fetch existing salary_details in this sheet
    const { data: existingDetails } = await supabase
      .from('salary_details')
      .select('id, employee_code')
      .eq('salary_sheet_id', salarySheetId);
    const existingMap = new Map((existingDetails || []).map((d: any) => [d.employee_code, d.id]));

    let inserted = 0, updated = 0, skipped = 0;

    for (const row of list) {
      const code = String(row['Mã nhân viên'] || '').trim();
      if (!code) { skipped++; continue; }
      const emp = empMap.get(code);
      if (!emp) { skipped++; continue; }

      const salary_type = String(row['Loại lương'] || 'Lương có BH');
      const gross_salary = Number(row['Lương Gross']) || 0;
      const working_days = Number(row['Ngày công']) || 0;
      const kpi_bonus = Number(row['Thưởng KPI']) || 0;
      const overtime_1_5 = Number(row['Tăng ca 1.5']) || 0;
      const overtime_2 = Number(row['Tăng ca 2']) || 0;
      const overtime_3 = Number(row['Tăng ca 3']) || 0;
      const insurance_base_amount = Number(row['Mức đóng BH']) || 0;
      const dependent_count = Number(row['Số người phụ thuộc']) || 0;
      const advance_payment = Number(row['Tạm Ứng']) || 0;

      const calc = computeSalaryFields({
        gross_salary, working_days, kpi_bonus,
        overtime_1_5, overtime_2, overtime_3,
        insurance_base_amount, dependent_count, salary_type,
        personal_deduction, dependent_deduction_unit,
      });

      const payload: any = {
        salary_sheet_id: salarySheetId,
        employee_code: code,
        employee_name: emp.full_name,
        team: emp.team,
        month, year,
        gross_salary, working_days,
        daily_rate: calc.daily_rate,
        daily_salary: calc.daily_salary,
        kpi_bonus, overtime_1_5, overtime_2, overtime_3,
        total_income: calc.total_income,
        insurance_base_amount,
        bhdn_bhxh: calc.bhdn_bhxh,
        bhdn_tnld: calc.bhdn_tnld,
        bhdn_bhyt: calc.bhdn_bhyt,
        bhdn_bhtn: calc.bhdn_bhtn,
        total_bhdn: calc.total_bhdn,
        total_company_payment: calc.total_company_payment,
        bhnld_bhxh: calc.bhnld_bhxh,
        bhnld_bhyt: calc.bhnld_bhyt,
        bhnld_bhtn: calc.bhnld_bhtn,
        total_bhnld: calc.total_bhnld,
        personal_deduction: calc.personal_deduction,
        dependent_count,
        dependent_deduction: calc.dependent_deduction,
        insurance_deduction: calc.insurance_deduction,
        total_deduction: calc.total_deduction,
        taxable_income: calc.taxable_income,
        tax_5_percent: calc.tax_5_percent,
        tax_10_percent: calc.tax_10_percent,
        tax_15_percent: calc.tax_15_percent,
        tax_20_percent: calc.tax_20_percent,
        tax_25_percent: calc.tax_25_percent,
        tax_30_percent: calc.tax_30_percent,
        tax_35_percent: calc.tax_35_percent,
        total_personal_income_tax: calc.total_personal_income_tax,
        net_salary: calc.net_salary,
        advance_payment,
        actual_payment: calc.net_salary - advance_payment,
      };

      const existingId = existingMap.get(code);
      if (existingId) {
        const { error } = await supabase
          .from('salary_details')
          .update(payload)
          .eq('id', existingId);
        if (error) throw error;
        updated++;
      } else {
        const { error } = await supabase
          .from('salary_details')
          .insert(payload);
        if (error) throw error;
        inserted++;
      }
    }

    toast.success(`Import: ${inserted} thêm mới, ${updated} cập nhật${skipped ? `, ${skipped} bỏ qua` : ''}`);
  };

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
        <Button
          onClick={() => {
            setImportStep('input');
            setShowImportDialog(true);
          }}
          variant="outline"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import File Lương
        </Button>
      </div>

      {/* Input file name dialog */}
      <Dialog
        open={showImportDialog}
        onOpenChange={(open) => {
          if (importing) return;
          if (open) {
            setShowImportDialog(true);
          } else {
            closeImportDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{importStep === 'input' ? 'Import File Lương' : 'Xác nhận import'}</DialogTitle>
            <DialogDescription>
              {importStep === 'input' ? (
                'Nhập tên file lương cần import'
              ) : (
                <>
                  Bạn chắc chắn import <strong>{importFileName}</strong> vào bảng lương{' '}
                  <strong>{month?.toString().padStart(2, '0')}/{year}</strong> chứ?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {importStep === 'input' && (
            <div className="space-y-2 py-2">
              <Label htmlFor="import-file-name">Tên file</Label>
              <Input
                id="import-file-name"
                value={importFileName}
                onChange={(e) => setImportFileName(e.target.value)}
                placeholder="Nhập tên file..."
              />
              <Label htmlFor="import-password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="import-password"
                  type={showImportPassword ? 'text' : 'password'}
                  value={importPassword}
                  onChange={(e) => setImportPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowImportPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showImportPassword ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
                >
                  {showImportPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
          <DialogFooter>
            {importStep === 'input' ? (
              <>
                <Button variant="outline" onClick={() => closeImportDialog(true)}>Hủy</Button>
                <Button
                  onClick={() => {
                    if (!importFileName.trim()) {
                      toast.error('Vui lòng nhập tên file');
                      return;
                    }
                    if (!importPassword.trim()) {
                      toast.error('Vui lòng nhập mật khẩu');
                      return;
                    }
                    setImportStep('confirm');
                  }}
                >
                  Đồng ý
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" disabled={importing} onClick={() => closeImportDialog()}>
                  Hủy
                </Button>
                <Button
                  disabled={importing}
                  onClick={async () => {
                    const fileName = importFileName;
                    const password = importPassword;
                    const label = `${month?.toString().padStart(2, '0')}/${year}`;
                    setImporting(true);
                    try {
                      await handleImportSalary({
                        fileName,
                        password,
                        month: month!,
                        year: year!,
                        salarySheetId: salarySheetId!,
                      });
                      toast.success(`Đã import ${fileName} vào bảng lương ${label}`);
                      onImported?.();
                      closeImportDialog(true);
                    } catch (err: any) {
                      console.error('Import salary error:', err);
                      toast.error(err?.message || 'Không thể import file lương');
                      clearDialogLock();
                    } finally {
                      setImporting(false);
                    }
                  }}
                >
                  {importing ? 'Đang import...' : 'Xác nhận'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
