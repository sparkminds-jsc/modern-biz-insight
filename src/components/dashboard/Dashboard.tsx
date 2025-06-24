
import { StatsCards } from './StatsCards';
import { RevenueChart } from './RevenueChart';
import { EmployeeTable } from './EmployeeTable';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan thống kê hệ thống</p>
      </div>

      <StatsCards />
      <RevenueChart />
      <EmployeeTable />
    </div>
  );
}
