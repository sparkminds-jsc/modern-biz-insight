
import { SalaryDetail } from '@/types/salary';

interface ExportTeamDetailCSVParams {
  teamReport: any;
  reportDetails: any[];
}

interface ExportTeamReportsCSVParams {
  teamData: any[];
  filters: {
    months: number[];
    years: number[];
    team?: string;
  };
}

export const exportTeamReportsToCSV = ({ teamData, filters }: ExportTeamReportsCSVParams) => {
  // Calculate totals from team data
  const totalBill = teamData.reduce((sum, item) => sum + (item.final_bill || 0), 0);
  const totalPay = teamData.reduce((sum, item) => sum + (item.final_pay || 0), 0);
  const totalSave = teamData.reduce((sum, item) => sum + (item.final_save || 0), 0);
  const totalEarn = teamData.reduce((sum, item) => sum + (item.final_earn || 0), 0);
  const totalUSD = teamData.reduce((sum, item) => sum + (item.storage_usd || 0), 0);
  const totalUSDT = teamData.reduce((sum, item) => sum + (item.storage_usdt || 0), 0);

  // Create CSV content
  const csvRows = [
    // Title
    ['BAO CAO TEAM'],
    [''],
    // Filter information
    ['THONG TIN LOC'],
    ['Tieu chi', 'Gia tri'],
    [
      'Thoi gian',
      `Thang: ${filters.months.length > 0 ? filters.months.map(m => m.toString().padStart(2, '0')).join(', ') : 'Tat ca'} - Nam: ${filters.years.length > 0 ? filters.years.join(', ') : 'Tat ca'}`
    ],
    ['Team', filters.team || 'Tat ca'],
    [''],
    // Summary section
    ['TONG HOP'],
    ['Chi so', 'Gia tri'],
    ['Bill', `${Math.round(totalBill)} VND`],
    ['Pay', `${Math.round(totalPay)} VND`],
    ['Save', `${Math.round(totalSave)} VND`],
    ['Earn', `${Math.round(totalEarn)} VND`],
    ['USD', `${Math.round(totalUSD)} USD`],
    ['USDT', `${Math.round(totalUSDT)} USDT`],
    [''],
    // Detail section headers - matching exactly with the table
    ['CHI TIET'],
    [
      'STT',
      'Team',
      'Nam',
      'Thang',
      'Final Bill',
      'Final Pay',
      'Final Save',
      'Final Earn',
      'Luu tru USD',
      'Luu tru USDT',
      'Chu thich'
    ],
    ...teamData.map((item, index) => [
      index + 1,
      item.team || '',
      item.year,
      String(item.month).padStart(2, '0'),
      Math.round(item.final_bill || 0),
      Math.round(item.final_pay || 0),
      Math.round(item.final_save || 0),
      Math.round(item.final_earn || 0),
      Math.round(item.storage_usd || 0),
      Math.round(item.storage_usdt || 0),
      `"${item.notes || ''}"`
    ])
  ];

  const csvContent = csvRows.map(row => row.join(',')).join('\n');
  
  // Create and download file
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `Bao_cao_team_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportTeamDetailToCSV = ({ teamReport, reportDetails }: ExportTeamDetailCSVParams) => {
  // Calculate totals based on the same logic as the summary
  const totalBill = reportDetails.reduce((sum, item) => sum + (item.converted_vnd || 0) + (item.package_vnd || 0), 0);
  const totalPay = reportDetails.reduce((sum, item) => sum + (item.total_payment || 0), 0);
  const totalSave = totalBill * 0.3; // 30% of Bill
  const totalEarn = totalBill - totalPay - totalSave; // Bill - Pay - Save (can be negative)
  const totalUSD = reportDetails.reduce((sum, item) => sum + (item.storage_usd || 0), 0);
  const totalUSDT = reportDetails.reduce((sum, item) => sum + (item.storage_usdt || 0), 0);

  // Create CSV content
  const csvRows = [
    // Title
    [`BAO CAO CHI TIET - ${teamReport.team.toUpperCase()} (THANG ${teamReport.month.toString().padStart(2, '0')}/${teamReport.year})`],
    [''],
    // Summary section
    ['TONG HOP'],
    ['Chi so', 'Gia tri'],
    ['Bill', `${Math.round(totalBill)} VND`],
    ['Pay', `${Math.round(totalPay)} VND`],
    ['Save', `${Math.round(totalSave)} VND`],
    ['Earn', `${Math.round(totalEarn)} VND`],
    ['USD', `${Math.round(totalUSD)} USD`],
    ['USDT', `${Math.round(totalUSDT)} USDT`],
    [''],
    // Detail section headers - matching exactly with the table
    ['CHI TIET'],
    [
      'STT',
      'Ma nhan vien',
      'Ten nhan vien',
      'Thang',
      'Nam',
      'Gio co bill',
      'Rate',
      'FX Rate',
      'Percentage',
      'Qui doi VND',
      'Tron goi VND',
      'Co tinh luong',
      'Cong ty chi tra',
      'Luong 13',
      'Tong chi tra',
      'Ti le %',
      'Luu tru USD',
      'Luu tru USDT',
      'Chu thich'
    ],
    ...reportDetails.map((item, index) => [
      index + 1,
      item.employee_code || '',
      `"${item.employee_name || ''}"`,
      String(item.month).padStart(2, '0'),
      item.year,
      Math.round(item.billable_hours || 0),
      Math.round(item.rate || 0),
      Math.round(item.fx_rate || 0),
      `${item.percentage || 0}%`,
      Math.round(item.converted_vnd || 0),
      Math.round(item.package_vnd || 0),
      item.has_salary ? 'Co' : 'Khong',
      Math.round(item.company_payment || 0),
      Math.round(item.salary_13 || 0),
      Math.round(item.total_payment || 0),
      `${Math.round(item.percentage_ratio || 0)}%`,
      Math.round(item.storage_usd || 0),
      Math.round(item.storage_usdt || 0),
      `"${item.notes || ''}"`
    ])
  ];

  const csvContent = csvRows.map(row => row.join(',')).join('\n');
  
  // Create and download file
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `Bao_cao_chi_tiet_${teamReport.team}_${teamReport.month.toString().padStart(2, '0')}_${teamReport.year}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportSalaryToExcel = (salaryDetails: SalaryDetail[], month: number, year: number) => {
  // Create CSV content
  const headers = [
    'STT',
    'Mã NV',
    'Tên nhân viên',
    'Team',
    'Tháng',
    'Năm',
    'Lương Gross',
    'Ngày công',
    'Mức lương/Ngày',
    'Tiền lương theo ngày công',
    'Thưởng KPI',
    'Tăng ca 1.5',
    'Tăng ca 2',
    'Tăng ca 3',
    'Tổng thu nhập',
    'Mức đóng BH',
    'BHDN (BHXH-17%)',
    'BHDN (TNLĐ-0.5%)',
    'BHDN (BHYT-3%)',
    'BHDN (BHTN-1%)',
    'Tổng BHDN',
    'Tổng DN chi trả',
    'BHNLD (BHXH-8%)',
    'BHNLD (BHYT-1.5%)',
    'BHNLD (BHTN-1%)',
    'Tổng BHNLD',
    'Giảm trừ bản thân',
    'Số người phụ thuộc',
    'Giảm trừ người phụ thuộc',
    'Giảm trừ bảo hiểm',
    'Tổng giảm trừ',
    'Thu nhập chịu thuế',
    'TNCN 5% (0-5tr)',
    'TNCN 10% (5-10tr)',
    'TNCN 15% (10-18tr)',
    'TNCN 20% (18-32tr)',
    'TNCN 25% (32-52tr)',
    'TNCN 30% (52-80tr)',
    'TNCN 35% (>80tr)',
    'Tổng thuế TNCN',
    'Lương Net',
    'Tạm Ứng',
    'Thực nhận'
  ];

  const csvRows = [
    headers.join(','),
    ...salaryDetails.map((detail, index) => {
      // Determine if salary has insurance
      const isSalaryWithInsurance = detail.insurance_base_amount > 0;
      const correctedBhdnBhtn = isSalaryWithInsurance ? detail.gross_salary * 0.01 : 0;
      const correctedBhnldBhtn = isSalaryWithInsurance ? detail.gross_salary * 0.01 : 0;

      return [
        index + 1,
        detail.employee_code,
        `"${detail.employee_name}"`,
        `"${detail.team}"`,
        detail.month.toString().padStart(2, '0'),
        detail.year,
        Math.round(detail.gross_salary),
        Math.round(detail.working_days),
        Math.round(detail.daily_rate),
        Math.round(detail.daily_salary),
        Math.round(detail.kpi_bonus),
        Math.round(detail.overtime_1_5),
        Math.round(detail.overtime_2),
        Math.round(detail.overtime_3),
        Math.round(detail.total_income),
        Math.round(detail.insurance_base_amount),
        Math.round(detail.bhdn_bhxh),
        Math.round(detail.bhdn_tnld),
        Math.round(detail.bhdn_bhyt),
        Math.round(correctedBhdnBhtn),
        Math.round(detail.total_bhdn),
        Math.round(detail.total_company_payment),
        Math.round(detail.bhnld_bhxh),
        Math.round(detail.bhnld_bhyt),
        Math.round(correctedBhnldBhtn),
        Math.round(detail.total_bhnld),
        Math.round(detail.personal_deduction),
        detail.dependent_count,
        Math.round(detail.dependent_deduction),
        Math.round(detail.insurance_deduction),
        Math.round(detail.total_deduction),
        Math.round(detail.taxable_income),
        Math.round(detail.tax_5_percent),
        Math.round(detail.tax_10_percent),
        Math.round(detail.tax_15_percent),
        Math.round(detail.tax_20_percent),
        Math.round(detail.tax_25_percent),
        Math.round(detail.tax_30_percent),
        Math.round(detail.tax_35_percent),
        Math.round(detail.total_personal_income_tax),
        Math.round(detail.net_salary),
        Math.round(detail.advance_payment),
        Math.round(detail.actual_payment)
      ].join(',');
    })
  ];

  const csvContent = csvRows.join('\n');
  
  // Create and download file
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `Bang_luong_${month.toString().padStart(2, '0')}_${year}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
