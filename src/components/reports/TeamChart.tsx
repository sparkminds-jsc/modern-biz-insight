import React, { useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamChartProps {
  teamReports: any[];
  selectedMonths: number[];
  selectedYears: number[];
}

interface ChartDataPoint {
  monthYear: string;
  finalBill: number;
  finalPay: number;
  finalEarn: number;
  avgFinalBill: number;
  avgFinalPay: number;
  avgFinalEarn: number;
}

const TeamChart: React.FC<TeamChartProps> = ({ teamReports, selectedMonths, selectedYears }) => {
  const chartData = useMemo(() => {
    // If no filters are selected, show all available data
    let monthsToUse = selectedMonths;
    let yearsToUse = selectedYears;
    
    if (!selectedMonths.length || !selectedYears.length) {
      // Extract unique months and years from teamReports
      const availableMonths = [...new Set(teamReports.map(report => report.month))].sort();
      const availableYears = [...new Set(teamReports.map(report => report.year))].sort();
      
      monthsToUse = availableMonths;
      yearsToUse = availableYears;
    }
    
    if (!monthsToUse.length || !yearsToUse.length) return [];

    // Generate all month/year combinations
    const monthYearCombinations: { month: number; year: number }[] = [];
    yearsToUse.forEach(year => {
      monthsToUse.forEach(month => {
        monthYearCombinations.push({ month, year });
      });
    });

    // Sort combinations chronologically
    monthYearCombinations.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    // Aggregate data by month/year
    const aggregatedData: { [key: string]: { finalBill: number; finalPay: number; finalEarn: number } } = {};
    
    monthYearCombinations.forEach(({ month, year }) => {
      const key = `${month.toString().padStart(2, '0')}/${year}`;
      const reportsForMonth = teamReports.filter(report => 
        report.month === month && report.year === year
      );
      
      aggregatedData[key] = {
        finalBill: reportsForMonth.reduce((sum, report) => sum + (report.final_bill || 0), 0),
        finalPay: reportsForMonth.reduce((sum, report) => sum + (report.final_pay || 0), 0),
        finalEarn: reportsForMonth.reduce((sum, report) => sum + (report.final_earn || 0), 0)
      };
    });

    // Calculate averages
    const totalFinalBill = Object.values(aggregatedData).reduce((sum, data) => sum + data.finalBill, 0);
    const totalFinalPay = Object.values(aggregatedData).reduce((sum, data) => sum + data.finalPay, 0);
    const totalFinalEarn = Object.values(aggregatedData).reduce((sum, data) => sum + data.finalEarn, 0);
    const monthCount = monthYearCombinations.length;

    const avgFinalBill = monthCount > 0 ? totalFinalBill / monthCount : 0;
    const avgFinalPay = monthCount > 0 ? totalFinalPay / monthCount : 0;
    const avgFinalEarn = monthCount > 0 ? totalFinalEarn / monthCount : 0;

    // Create chart data
    const data: ChartDataPoint[] = monthYearCombinations.map(({ month, year }) => {
      const key = `${month.toString().padStart(2, '0')}/${year}`;
      const monthData = aggregatedData[key];
      
      return {
        monthYear: key,
        finalBill: monthData.finalBill,
        finalPay: monthData.finalPay,
        finalEarn: monthData.finalEarn,
        avgFinalBill,
        avgFinalPay,
        avgFinalEarn
      };
    });

    return data;
  }, [teamReports, selectedMonths, selectedYears]);

  const formatCurrency = (value: number): string => {
    if (value >= 1000000000) {
      return `${Math.round(value / 1000000000)}B`;
    } else if (value >= 1000000) {
      return `${Math.round(value / 1000000)}M`;
    } else if (value >= 1000) {
      return `${Math.round(value / 1000)}K`;
    }
    return value.toString();
  };

  const formatTooltipValue = (value: number): string => {
    return `${value.toLocaleString()} VND`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`Tháng: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatTooltipValue(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Biểu Đồ Báo Cáo Team</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Không có dữ liệu báo cáo team để hiển thị biểu đồ
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals for display
  const totalFinalBill = chartData.reduce((sum, item) => sum + item.finalBill, 0);
  const totalFinalPay = chartData.reduce((sum, item) => sum + item.finalPay, 0);
  const totalFinalEarn = chartData.reduce((sum, item) => sum + item.finalEarn, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biểu Đồ Báo Cáo Team</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthYear" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Bars */}
              <Bar dataKey="finalBill" fill="#8884d8" name="Final Bill">
                <LabelList dataKey="finalBill" position="top" formatter={formatCurrency} fontSize={12} />
              </Bar>
              <Bar dataKey="finalPay" fill="#82ca9d" name="Final Pay">
                <LabelList dataKey="finalPay" position="top" formatter={formatCurrency} fontSize={12} />
              </Bar>
              <Bar dataKey="finalEarn" fill="#ffc658" name="Final Earn">
                <LabelList dataKey="finalEarn" position="top" formatter={formatCurrency} fontSize={12} />
              </Bar>
              
              {/* Lines for averages */}
              <Line 
                type="monotone" 
                dataKey="avgFinalBill" 
                stroke="#0ea5e9" 
                strokeWidth={2}
                name="TB Final Bill"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="avgFinalPay" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="TB Final Pay"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="avgFinalEarn" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="TB Final Earn"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary totals */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Tổng Final Bill</p>
            <p className="text-lg font-semibold text-blue-600">{formatCurrency(totalFinalBill)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Tổng Final Pay</p>
            <p className="text-lg font-semibold text-green-600">{formatCurrency(totalFinalPay)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Tổng Final Earn</p>
            <p className="text-lg font-semibold text-yellow-600">{formatCurrency(totalFinalEarn)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamChart;