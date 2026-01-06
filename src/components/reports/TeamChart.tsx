import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
  earnWithUsdt: number;
  avgEarnWithUsdt: number;
  isProjected?: boolean;
}

type ProjectionMode = 'last_month' | 'zero' | 'average';

const TeamChart: React.FC<TeamChartProps> = ({ teamReports }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [usdtExchangeRate, setUsdtExchangeRate] = useState<number>(25000);
  const [projectionMode, setProjectionMode] = useState<ProjectionMode>('last_month');
  
  const yearOptions = [2025, 2026, 2027, 2028, 2029, 2030];
  const exchangeRateOptions = [24000, 25000, 26000, 27000, 28000, 29000, 30000];
  
  const chartData = useMemo(() => {
    // Generate all 12 months for the selected year
    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
    
    // Get actual data for the selected year
    const actualData: { [month: number]: { finalBill: number; finalPay: number; finalEarn: number; storageUsdt: number; hasData: boolean } } = {};
    
    allMonths.forEach(month => {
      const reportsForMonth = teamReports.filter(report => 
        report.month === month && report.year === selectedYear
      );
      
      if (reportsForMonth.length > 0) {
        actualData[month] = {
          finalBill: reportsForMonth.reduce((sum, report) => sum + (report.final_bill || 0), 0),
          finalPay: reportsForMonth.reduce((sum, report) => sum + (report.final_pay || 0), 0),
          finalEarn: reportsForMonth.reduce((sum, report) => sum + (report.final_earn || 0), 0),
          storageUsdt: reportsForMonth.reduce((sum, report) => sum + (report.storage_usdt || 0), 0),
          hasData: true
        };
      }
    });

    // Find the last month with actual data
    const monthsWithData = Object.keys(actualData).map(Number).sort((a, b) => a - b);
    const lastMonthWithData = monthsWithData.length > 0 ? Math.max(...monthsWithData) : 0;
    
    // Calculate averages from actual data only
    const actualDataValues = Object.values(actualData);
    const actualDataCount = actualDataValues.length;
    
    const avgFromActual = {
      finalBill: actualDataCount > 0 ? actualDataValues.reduce((sum, d) => sum + d.finalBill, 0) / actualDataCount : 0,
      finalPay: actualDataCount > 0 ? actualDataValues.reduce((sum, d) => sum + d.finalPay, 0) / actualDataCount : 0,
      finalEarn: actualDataCount > 0 ? actualDataValues.reduce((sum, d) => sum + d.finalEarn, 0) / actualDataCount : 0,
      storageUsdt: actualDataCount > 0 ? actualDataValues.reduce((sum, d) => sum + d.storageUsdt, 0) / actualDataCount : 0,
    };

    // Get last month's data for projection
    const lastMonthData = lastMonthWithData > 0 ? actualData[lastMonthWithData] : null;

    // Build chart data for all 12 months
    const data: ChartDataPoint[] = allMonths.map(month => {
      const key = `${month.toString().padStart(2, '0')}/${selectedYear}`;
      let monthData: { finalBill: number; finalPay: number; finalEarn: number; storageUsdt: number };
      let isProjected = false;
      
      if (actualData[month]) {
        // Use actual data
        monthData = actualData[month];
      } else {
        // Project data based on selected mode
        isProjected = true;
        switch (projectionMode) {
          case 'last_month':
            monthData = lastMonthData ? {
              finalBill: lastMonthData.finalBill,
              finalPay: lastMonthData.finalPay,
              finalEarn: lastMonthData.finalEarn,
              storageUsdt: lastMonthData.storageUsdt,
            } : { finalBill: 0, finalPay: 0, finalEarn: 0, storageUsdt: 0 };
            break;
          case 'zero':
            monthData = { finalBill: 0, finalPay: 0, finalEarn: 0, storageUsdt: 0 };
            break;
          case 'average':
            monthData = {
              finalBill: avgFromActual.finalBill,
              finalPay: avgFromActual.finalPay,
              finalEarn: avgFromActual.finalEarn,
              storageUsdt: avgFromActual.storageUsdt,
            };
            break;
          default:
            monthData = { finalBill: 0, finalPay: 0, finalEarn: 0, storageUsdt: 0 };
        }
      }

      return {
        monthYear: key,
        finalBill: monthData.finalBill,
        finalPay: monthData.finalPay,
        finalEarn: monthData.finalEarn,
        earnWithUsdt: (monthData.storageUsdt * usdtExchangeRate) + monthData.finalEarn,
        avgFinalBill: 0, // Will be calculated below
        avgFinalPay: 0,
        avgFinalEarn: 0,
        avgEarnWithUsdt: 0,
        isProjected,
      };
    });

    // Calculate averages including projected data
    const totalFinalBill = data.reduce((sum, d) => sum + d.finalBill, 0);
    const totalFinalPay = data.reduce((sum, d) => sum + d.finalPay, 0);
    const totalFinalEarn = data.reduce((sum, d) => sum + d.finalEarn, 0);
    const totalEarnWithUsdt = data.reduce((sum, d) => sum + d.earnWithUsdt, 0);
    
    const avgFinalBill = totalFinalBill / 12;
    const avgFinalPay = totalFinalPay / 12;
    const avgFinalEarn = totalFinalEarn / 12;
    const avgEarnWithUsdt = totalEarnWithUsdt / 12;

    // Update averages in data
    return data.map(d => ({
      ...d,
      avgFinalBill,
      avgFinalPay,
      avgFinalEarn,
      avgEarnWithUsdt,
    }));
  }, [teamReports, selectedYear, usdtExchangeRate, projectionMode]);

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
      const dataPoint = chartData.find(d => d.monthYear === label);
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">
            {`Tháng: ${label}`}
            {dataPoint?.isProjected && <span className="text-muted-foreground ml-2">(Dự kiến)</span>}
          </p>
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

  // Calculate totals for display
  const totalFinalBill = chartData.reduce((sum, item) => sum + item.finalBill, 0);
  const totalFinalPay = chartData.reduce((sum, item) => sum + item.finalPay, 0);
  const totalFinalEarn = chartData.reduce((sum, item) => sum + item.finalEarn, 0);
  const totalEarnWithUsdt = chartData.reduce((sum, item) => sum + item.earnWithUsdt, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biểu Đồ Báo Cáo Team</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters Row */}
        <div className="flex flex-wrap gap-6 mb-6">
          {/* Year Selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">Năm</label>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Chọn năm" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* USDT Exchange Rate Selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">Tỉ giá USDT</label>
            <Select value={usdtExchangeRate.toString()} onValueChange={(value) => setUsdtExchangeRate(Number(value))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Chọn tỉ giá USDT" />
              </SelectTrigger>
              <SelectContent>
                {exchangeRateOptions.map((rate) => (
                  <SelectItem key={rate} value={rate.toString()}>
                    {rate.toLocaleString()} VND
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Projection Mode Radio */}
          <div>
            <label className="text-sm font-medium mb-2 block">Giả sử thu/chi</label>
            <RadioGroup 
              value={projectionMode} 
              onValueChange={(value) => setProjectionMode(value as ProjectionMode)}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="last_month" id="last_month" />
                <Label htmlFor="last_month" className="text-sm cursor-pointer">
                  Các tháng sau giống tháng vừa rồi
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="zero" id="zero" />
                <Label htmlFor="zero" className="text-sm cursor-pointer">
                  Các tháng sau bằng 0
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="average" id="average" />
                <Label htmlFor="average" className="text-sm cursor-pointer">
                  Các tháng sau bằng trung bình các tháng cũ
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

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
              <Bar dataKey="earnWithUsdt" fill="#ff7300" name="Earn with USDT">
                <LabelList dataKey="earnWithUsdt" position="top" formatter={formatCurrency} fontSize={12} />
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
              <Line 
                type="monotone" 
                dataKey="avgEarnWithUsdt" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="TB Earn with USDT"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary totals */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t">
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
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Tổng Earn with USDT</p>
            <p className="text-lg font-semibold text-orange-600">{formatCurrency(totalEarnWithUsdt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamChart;