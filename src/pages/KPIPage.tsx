
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { KPIFilters } from '../components/kpi/KPIFilters';
import { KPITable } from '../components/kpi/KPITable';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface KPIRecord {
  id: string;
  year: number;
  month: number;
  total_employees_with_kpi_gap: number;
}

const KPIPage = () => {
  const navigate = useNavigate();
  
  // Filter states
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  
  // Data state
  const [kpiData, setKpiData] = useState<KPIRecord[]>([]);
  const [filteredKpiData, setFilteredKpiData] = useState<KPIRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIData();
  }, []);

  useEffect(() => {
    filterKPIData();
  }, [kpiData, selectedMonths, selectedYears]);

  const fetchKPIData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kpi_records')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;

      const mappedData: KPIRecord[] = (data || []).map(record => ({
        id: record.id,
        year: record.year,
        month: record.month,
        total_employees_with_kpi_gap: record.total_employees_with_kpi_gap
      }));

      setKpiData(mappedData);
    } catch (error) {
      console.error('Error fetching KPI data:', error);
      toast.error('Không thể tải dữ liệu KPI');
    } finally {
      setLoading(false);
    }
  };

  const filterKPIData = () => {
    let filtered = [...kpiData];

    if (selectedMonths.length > 0) {
      filtered = filtered.filter(record => selectedMonths.includes(record.month));
    }

    if (selectedYears.length > 0) {
      filtered = filtered.filter(record => selectedYears.includes(record.year));
    }

    setFilteredKpiData(filtered);
  };

  const handleViewDetail = (year: number, month: number) => {
    navigate(`/kpi/detail/${year}/${month}`);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý KPI</h1>
            <p className="text-gray-600">Đánh giá hiệu suất làm việc</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý KPI</h1>
          <p className="text-gray-600">Đánh giá hiệu suất làm việc</p>
        </div>

        {/* Filters - removed onCreateKPI prop */}
        <KPIFilters
          selectedMonths={selectedMonths}
          selectedYears={selectedYears}
          onMonthsChange={setSelectedMonths}
          onYearsChange={setSelectedYears}
        />

        {/* KPI Table */}
        <KPITable
          data={filteredKpiData}
          onViewDetail={handleViewDetail}
        />
      </div>
    </AppLayout>
  );
};

export default KPIPage;
