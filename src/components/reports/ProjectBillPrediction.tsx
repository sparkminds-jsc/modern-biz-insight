import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Format number without currency unit
const formatNumber = (value: number): string => {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

// Parse Vietnamese number format (e.g., "2.400.000" -> 2400000)
const parseVietnameseNumber = (value: string): number => {
  // Remove all dots (thousand separators in Vietnamese format)
  // Replace comma with dot for decimal (if any)
  const cleaned = value
    .replace(/\./g, '')  // Remove thousand separators
    .replace(/,/g, '.')  // Convert decimal separator
    .replace(/[^\d.-]/g, ''); // Remove non-numeric chars
  return parseFloat(cleaned) || 0;
};

interface ProjectBillData {
  projectName: string;
  year: number;
  month: number;
  team: string;
  billVnd: number;
  billUsd: number;
  billUsdt: number;
  earnVnd: number;
  earnUsdt: number;
}

interface ProjectBillPredictionProps {
  data: ProjectBillData[];
  selectedMonths: number[];
  selectedYears: number[];
  exchangeRate: number;
  projects: { id: string; name: string }[];
}

interface PredictionData {
  [projectName: string]: {
    [key: string]: number; // key format: "year-month"
  };
}

const MONTH_NAMES = [
  'Tháng 01', 'Tháng 02', 'Tháng 03', 'Tháng 04',
  'Tháng 05', 'Tháng 06', 'Tháng 07', 'Tháng 08',
  'Tháng 09', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

export function ProjectBillPrediction({
  data,
  selectedMonths,
  selectedYears,
  exchangeRate,
  projects
}: ProjectBillPredictionProps) {
  const [predictions, setPredictions] = useState<PredictionData>({});

  // Generate column headers based on selected months and years
  const columns = useMemo(() => {
    const cols: { year: number; month: number; key: string; label: string }[] = [];
    
    const years = selectedYears.length > 0 ? selectedYears.sort((a, b) => a - b) : [new Date().getFullYear()];
    const months = selectedMonths.length > 0 ? selectedMonths.sort((a, b) => a - b) : Array.from({ length: 12 }, (_, i) => i + 1);
    
    years.forEach(year => {
      months.forEach(month => {
        cols.push({
          year,
          month,
          key: `${year}-${month}`,
          label: `${MONTH_NAMES[month - 1]}/${year}`
        });
      });
    });
    
    return cols;
  }, [selectedMonths, selectedYears]);

  // Calculate initial predictions based on Earn VND + (Earn USDT * exchangeRate)
  const calculateInitialPredictions = useMemo(() => {
    const preds: PredictionData = {};
    
    // Get unique project names from both data and projects list
    const projectNames = new Set<string>();
    data.forEach(item => projectNames.add(item.projectName));
    projects.forEach(p => projectNames.add(p.name));
    
    projectNames.forEach(projectName => {
      preds[projectName] = {};
      
      columns.forEach(col => {
        // Find data for this project, year, month
        const matchingData = data.filter(
          item => item.projectName === projectName && 
                  item.year === col.year && 
                  item.month === col.month
        );
        
        if (matchingData.length > 0) {
          // Calculate total: Earn VND + (Earn USDT * exchangeRate)
          const totalEarn = matchingData.reduce((sum, item) => {
            return sum + (item.earnVnd || 0) + ((item.earnUsdt || 0) * exchangeRate);
          }, 0);
          
          preds[projectName][col.key] = Math.round(totalEarn);
        } else {
          preds[projectName][col.key] = 0;
        }
      });
    });
    
    return preds;
  }, [data, columns, exchangeRate, projects]);

  // Initialize predictions when data changes
  useEffect(() => {
    setPredictions(calculateInitialPredictions);
  }, [calculateInitialPredictions]);

  const handlePredictionChange = (projectName: string, key: string, value: string) => {
    // Parse Vietnamese number format correctly
    const numValue = parseVietnameseNumber(value);
    
    setPredictions(prev => ({
      ...prev,
      [projectName]: {
        ...prev[projectName],
        [key]: numValue
      }
    }));
  };

  // Get all project names to display
  const projectNames = useMemo(() => {
    const names = new Set<string>();
    data.forEach(item => names.add(item.projectName));
    projects.forEach(p => names.add(p.name));
    return Array.from(names).sort();
  }, [data, projects]);

  // Calculate row totals (sum of all months for each project)
  const rowTotals = useMemo(() => {
    const totals: { [projectName: string]: number } = {};
    projectNames.forEach(projectName => {
      totals[projectName] = columns.reduce((sum, col) => {
        return sum + (predictions[projectName]?.[col.key] || 0);
      }, 0);
    });
    return totals;
  }, [predictions, projectNames, columns]);

  // Calculate column totals (sum of all projects for each month)
  const columnTotals = useMemo(() => {
    const totals: { [key: string]: number } = {};
    columns.forEach(col => {
      totals[col.key] = projectNames.reduce((sum, projectName) => {
        return sum + (predictions[projectName]?.[col.key] || 0);
      }, 0);
    });
    return totals;
  }, [predictions, projectNames, columns]);

  // Calculate grand total
  const grandTotal = useMemo(() => {
    return Object.values(rowTotals).reduce((sum, val) => sum + val, 0);
  }, [rowTotals]);

  if (columns.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Dự đoán tương lai</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Vui lòng chọn tháng và năm ở section filter để hiển thị dự đoán.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Dự đoán tương lai</CardTitle>
        <p className="text-sm text-muted-foreground">
          Giá trị mặc định = Earn VND + (Earn USDT × Tỷ giá). Có thể chỉnh sửa trực tiếp.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10 min-w-[200px]">
                  Dự án
                </TableHead>
                <TableHead className="min-w-[150px] text-center font-bold">
                  Tổng
                </TableHead>
                {columns.map(col => (
                  <TableHead key={col.key} className="min-w-[150px] text-center">
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectNames.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} className="text-center text-muted-foreground">
                    Không có dự án nào
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {projectNames.map(projectName => (
                    <TableRow key={projectName}>
                      <TableCell className="sticky left-0 bg-background z-10 font-medium">
                        {projectName}
                      </TableCell>
                      <TableCell className="text-right font-semibold bg-muted/50">
                        {formatNumber(rowTotals[projectName] || 0)}
                      </TableCell>
                      {columns.map(col => (
                        <TableCell key={col.key} className="p-1">
                          <Input
                            type="text"
                            value={formatNumber(predictions[projectName]?.[col.key] || 0)}
                            onChange={(e) => handlePredictionChange(projectName, col.key, e.target.value)}
                            className="text-right h-8"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {/* Total Row */}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell className="sticky left-0 bg-muted/50 z-10 font-bold">
                      Tổng
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatNumber(grandTotal)}
                    </TableCell>
                    {columns.map(col => (
                      <TableCell key={col.key} className="text-right font-bold">
                        {formatNumber(columnTotals[col.key] || 0)}
                      </TableCell>
                    ))}
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
