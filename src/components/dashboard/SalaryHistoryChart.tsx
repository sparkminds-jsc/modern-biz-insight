import { useState, useEffect, useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Row {
  year: number;
  company_payment: number;
  team: string;
}

const ALL = '__ALL__';

export function SalaryHistoryChart() {
  const [rows, setRows] = useState<Row[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>(ALL);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: history, error } = await supabase
          .from('salary_increase_history')
          .select('year, company_payment, employee_id');
        if (error) throw error;

        const { data: emps, error: empErr } = await supabase
          .from('employees')
          .select('id, team');
        if (empErr) throw empErr;

        const teamMap = new Map<string, string>();
        (emps || []).forEach((e: any) => teamMap.set(e.id, e.team));

        const merged: Row[] = (history || []).map((h: any) => ({
          year: h.year,
          company_payment: Number(h.company_payment) || 0,
          team: teamMap.get(h.employee_id) || 'Khác',
        }));

        const uniqueTeams = Array.from(
          new Set(merged.map((r) => r.team).filter(Boolean))
        ).sort();

        setRows(merged);
        setTeams(uniqueTeams);
      } catch (e) {
        console.error(e);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu lịch sử tăng lương',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = useMemo(() => {
    const filtered =
      selectedTeam === ALL ? rows : rows.filter((r) => r.team === selectedTeam);
    const byYear = new Map<number, number>();
    filtered.forEach((r) => {
      byYear.set(r.year, (byYear.get(r.year) || 0) + r.company_payment);
    });
    const years = Array.from(byYear.keys()).sort((a, b) => a - b);
    return years.map((year, i) => {
      const total = byYear.get(year) || 0;
      const prev = i > 0 ? byYear.get(years[i - 1]) || 0 : 0;
      const pct = i > 0 && prev > 0 ? ((total - prev) / prev) * 100 : null;
      return {
        year: String(year),
        total: Math.round(total),
        totalMillion: Math.round(total / 1_000_000),
        pct: pct !== null ? Number(pct.toFixed(2)) : null,
      };
    });
  }, [rows, selectedTeam]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Lịch sử tăng lương theo team
          </h2>
          <p className="text-gray-600">
            Tổng lương theo năm và % tăng so với năm trước
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Tất cả team</SelectItem>
              {teams.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-80">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis
                yAxisId="left"
                label={{
                  value: 'Tổng lương (triệu)',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: '% tăng', angle: 90, position: 'insideRight' }}
              />
              <Tooltip
                formatter={(value: any, name: string) => {
                  if (name === 'totalMillion')
                    return [`${value} triệu VND`, 'Tổng lương'];
                  if (name === 'pct')
                    return [value === null ? '-' : `${value}%`, '% tăng'];
                  return [value, name];
                }}
              />
              <Legend
                formatter={(v) =>
                  v === 'totalMillion' ? 'Tổng lương (triệu VND)' : '% tăng so với năm trước'
                }
              />
              <Bar
                yAxisId="left"
                dataKey="totalMillion"
                fill="#3B82F6"
                name="totalMillion"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="pct"
                stroke="#EF4444"
                strokeWidth={2}
                name="pct"
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}