import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ChartData {
  monthYear: string;
  [key: string]: string | number;
}

const CHART_COLORS = [
  'hsl(var(--primary))',
  '#22c55e',
  '#f97316',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#6366f1',
  '#ef4444'
];

export function InvoiceChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [projects, setProjects] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      // Fetch fully paid invoices
      const { data: invoices, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('payment_status', 'Đã thu đủ')
        .order('created_date');

      if (invoiceError) throw invoiceError;

      // Fetch projects
      const { data: projectsData, error: projectError } = await supabase
        .from('projects')
        .select('id, name');

      if (projectError) throw projectError;

      // Create project map
      const projectMap: { [key: string]: string } = {};
      projectsData?.forEach(project => {
        projectMap[project.id] = project.name;
      });
      setProjects(projectMap);

      // Group invoices by month and project
      const monthProjectMap: { [key: string]: { [key: string]: number } } = {};

      invoices?.forEach(invoice => {
        const monthKey = format(startOfMonth(parseISO(invoice.created_date)), 'MM/yyyy', { locale: vi });
        const projectId = invoice.project_id || 'no_project';
        
        // Calculate VND amount
        let vndAmount = 0;
        if (invoice.payment_unit === 'VND') {
          vndAmount = invoice.total_amount;
        } else if (invoice.payment_unit === 'USD' && invoice.vnd_exchange_rate) {
          vndAmount = invoice.total_amount * invoice.vnd_exchange_rate;
        }

        if (!monthProjectMap[monthKey]) {
          monthProjectMap[monthKey] = {};
        }

        monthProjectMap[monthKey][projectId] = 
          (monthProjectMap[monthKey][projectId] || 0) + vndAmount;
      });

      // Convert to chart data format
      const chartDataArray: ChartData[] = Object.keys(monthProjectMap)
        .sort((a, b) => {
          const [monthA, yearA] = a.split('/');
          const [monthB, yearB] = b.split('/');
          return new Date(parseInt(yearA), parseInt(monthA) - 1).getTime() - 
                 new Date(parseInt(yearB), parseInt(monthB) - 1).getTime();
        })
        .map(monthKey => {
          const dataPoint: ChartData = { monthYear: monthKey };
          Object.keys(monthProjectMap[monthKey]).forEach(projectId => {
            const projectName = projectMap[projectId] || 'Không có dự án';
            dataPoint[projectName] = Math.round(monthProjectMap[monthKey][projectId]);
          });
          return dataPoint;
        });

      setChartData(chartDataArray);
    } catch (error) {
      console.error('Error fetching invoice chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return `${Math.round(value).toLocaleString('vi-VN')} VND`;
  };

  const formatShortCurrency = (value: number) => {
    const millions = value / 1000000;
    return `${millions.toFixed(1)}M`;
  };

  // Get all unique project names for lines
  const projectNames = chartData.length > 0 
    ? Object.keys(chartData[0]).filter(key => key !== 'monthYear')
    : [];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Biểu đồ số tiền quy đổi VND theo dự án (Đã thu đủ)
        </h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Biểu đồ số tiền quy đổi VND theo dự án (Đã thu đủ)
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Không có dữ liệu invoice đã thu đủ
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Biểu đồ số tiền quy đổi VND theo dự án (Đã thu đủ)
      </h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="monthYear" 
              tick={{ fontSize: 12 }}
              className="text-gray-600"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              className="text-gray-600"
              tickFormatter={formatShortCurrency}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            {projectNames.map((projectName, index) => (
              <Line
                key={projectName}
                type="monotone"
                dataKey={projectName}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
