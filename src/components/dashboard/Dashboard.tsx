
import { useState, useEffect } from 'react';
import { StatsCards } from './StatsCards';
import { RevenueChart } from './RevenueChart';
import { EmployeeTable } from './EmployeeTable';

export function Dashboard() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    // Set default dates (current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setFromDate(firstDay.toISOString().split('T')[0]);
    setToDate(lastDay.toISOString().split('T')[0]);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan thống kê hệ thống</p>
      </div>

      <StatsCards 
        fromDate={fromDate} 
        toDate={toDate} 
        onFromDateChange={setFromDate} 
        onToDateChange={setToDate} 
      />
      <RevenueChart fromDate={fromDate} toDate={toDate} />
      <EmployeeTable />
    </div>
  );
}
