
import { SalaryDetailSummary as SalaryDetailSummaryType } from '@/types/salary';

interface SalaryDetailSummaryProps {
  summary: SalaryDetailSummaryType;
}

export function SalaryDetailSummary({ summary }: SalaryDetailSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Math.round(amount));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-sm font-medium text-gray-600 mb-2">
          Tổng tiền lương net chi trả
        </div>
        <div className="text-2xl font-bold text-blue-600">
          {formatCurrency(summary.total_net_salary)}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-sm font-medium text-gray-600 mb-2">
          Tổng tiền thuế TNCN chi trả
        </div>
        <div className="text-2xl font-bold text-orange-600">
          {formatCurrency(summary.total_personal_income_tax)}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-sm font-medium text-gray-600 mb-2">
          Tổng tiền BH công ty đóng
        </div>
        <div className="text-2xl font-bold text-green-600">
          {formatCurrency(summary.total_company_insurance)}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-sm font-medium text-gray-600 mb-2">
          Tổng tiền BH cá nhân đóng
        </div>
        <div className="text-2xl font-bold text-purple-600">
          {formatCurrency(summary.total_personal_insurance)}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-sm font-medium text-gray-600 mb-2">
          Tổng toàn bộ tiền chi trả
        </div>
        <div className="text-2xl font-bold text-red-600">
          {formatCurrency(summary.total_payment)}
        </div>
      </div>
    </div>
  );
}
