
interface KPIDetailSummaryProps {
  totalEmployeesWithKPIGap: number;
}

export function KPIDetailSummary({ totalEmployeesWithKPIGap }: KPIDetailSummaryProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white">
          <h3 className="text-sm font-medium opacity-90">Tổng nhân viên lệch KPI</h3>
          <p className="text-2xl font-bold mt-1">{totalEmployeesWithKPIGap}</p>
        </div>
      </div>
    </div>
  );
}
