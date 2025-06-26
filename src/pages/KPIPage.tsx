
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { KPIFilters } from '../components/kpi/KPIFilters';
import { KPITable } from '../components/kpi/KPITable';
import { toast } from 'sonner';

const KPIPage = () => {
  const navigate = useNavigate();
  
  // Filter states
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  
  // Mock data - replace with real data later
  const mockKPIData = [
    {
      id: '1',
      year: 2024,
      month: 12,
      totalEmployeesWithKPIGap: 5
    },
    {
      id: '2',
      year: 2024,
      month: 11,
      totalEmployeesWithKPIGap: 3
    },
    {
      id: '3',
      year: 2024,
      month: 10,
      totalEmployeesWithKPIGap: 7
    }
  ];

  const handleCreateKPI = () => {
    toast.info('Chức năng tạo KPI đang được phát triển');
  };

  const handleViewDetail = (year: number, month: number) => {
    navigate(`/kpi/detail/${year}/${month}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý KPI</h1>
          <p className="text-gray-600">Đánh giá hiệu suất làm việc</p>
        </div>

        {/* Filters */}
        <KPIFilters
          selectedMonths={selectedMonths}
          selectedYears={selectedYears}
          onMonthsChange={setSelectedMonths}
          onYearsChange={setSelectedYears}
          onCreateKPI={handleCreateKPI}
        />

        {/* KPI Table */}
        <KPITable
          data={mockKPIData}
          onViewDetail={handleViewDetail}
        />
      </div>
    </AppLayout>
  );
};

export default KPIPage;
