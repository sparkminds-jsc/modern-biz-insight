
import { SalaryDetail } from '@/types/salary';

interface ExportTeamDetailCSVParams {
  teamReport: any;
  reportDetails: any[];
}

export const exportTeamDetailToCSV = ({ teamReport, reportDetails }: ExportTeamDetailCSVParams) => {
  // Calculate totals
  const totalBill = reportDetails.reduce((sum, item) => sum + (item.final_bill || 0), 0);
  const totalPay = reportDetails.reduce((sum, item) => sum + (item.final_pay || 0), 0);
  const totalSave = reportDetails.reduce((sum, item) => sum + (item.final_save || 0), 0);
  const totalEarn = reportDetails.reduce((sum, item) => sum + (item.final_earn || 0), 0);
  const totalUSD = reportDetails.reduce((sum, item) => sum + (item.usd || 0), 0);
  const totalUSDT = reportDetails.reduce((sum, item) => sum + (item.usdt || 0), 0);

  // Create CSV content
  const csvRows = [
    // Title
    [`BAO CAO CHI TIET - ${teamReport.team.toUpperCase()} (THANG ${teamReport.month.toString().padStart(2, '0')}/${teamReport.year})`],
    [''],
    // Summary section
    ['TONG HOP'],
    ['Chi so', 'Gia tri'],
    ['Final Bill', `${Math.round(totalBill)} VND`],
    ['Final Pay', `${Math.round(totalPay)} VND`],
    ['Final Save', `${Math.round(totalSave)} VND`],
    ['Final Earn', `${Math.round(totalEarn)} VND`],
    ['USD', `${Math.round(totalUSD)} USD`],
    ['USDT', `${Math.round(totalUSDT)} USDT`],
    [''],
    // Detail section
    ['CHI TIET'],
    [
      'STT',
      'Ma NV',
      'Ten NV', 
      'Gio',
      'Rate',
      'FX',
      '%',
      'Goi VND',
      'CT tra',
      'L13',
      'USD',
      'USDT',
      'Ghi chu'
    ],
    ...reportDetails.map((item, index) => [
      index + 1,
      item.employee_code || '',
      `"${item.employee_name || ''}"`,
      Math.round(item.hours || 0),
      Math.round(item.rate || 0),
      Math.round(item.fx || 0),
      Math.round(item.percentage || 0),
      Math.round(item.final_bill || 0),
      Math.round(item.final_pay || 0),
      Math.round(item.final_save || 0),
      Math.round(item.usd || 0),
      Math.round(item.usdt || 0),
      `"${item.note || ''}"`
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
