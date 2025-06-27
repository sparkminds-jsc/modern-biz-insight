import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronUp, ChevronDown, Eye, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface KPIDetailData {
  id: string;
  employeeCode: string;
  hasKPIGap: boolean;
  basicSalary: number;
  kpi: number;
  totalSalary: number;
  salaryCoefficient: number;
  kpiCoefficient: number;
  totalMonthlyKPI: number;
  // Năng suất công việc
  workProductivity: {
    total: number;
    completedOnTime: number;
    overdueTask: number;
    taskTarget: number;
    locTarget: number;
    lotTarget: number;
    effortRatio: number;
    gitActivity: number;
  };
  // Chất lượng công việc (đã gộp với tỷ lệ pull request)
  workQuality: {
    total: number;
    prodBugs: number;
    testBugs: number;
    mergeRatio: number;
  };
  // Thái độ và đóng góp
  attitude: {
    total: number;
    positiveAttitude: number;
    techSharing: number;
    techArticles: number;
    mentoring: number;
    teamManagement: number;
  };
  // Tiến độ & kế hoạch
  progress: {
    total: number;
    onTimeCompletion: number;
    storyPointAccuracy: number;
    planChanges: number;
  };
  // Quản lý yêu cầu & chất lượng đầu ra
  requirements: {
    total: number;
    changeRequests: number;
    misunderstandingErrors: number;
  };
  // Tuyển dụng
  recruitment: {
    total: number;
    cvCount: number;
    passedCandidates: number;
    recruitmentCost: number;
  };
  // Doanh số
  revenue: {
    clientsOver100M: number;
  };
}

interface KPIDetailTableProps {
  data: KPIDetailData[];
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

type SortField = string;
type SortDirection = 'asc' | 'desc';

export function KPIDetailTable({ data, onViewDetail, onEdit, onDelete }: KPIDetailTableProps) {
  const [sortField, setSortField] = useState<SortField>('');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const SortableHeader = ({ field, children, className = "" }: { field: string; children: React.ReactNode; className?: string }) => (
    <TableHead 
      className={`cursor-pointer hover:bg-gray-50 ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-center gap-1">
        {children}
        {getSortIcon(field)}
      </div>
    </TableHead>
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Mã NV</TableHead>
            <TableHead>Lệch KPI</TableHead>
            <TableHead>Lương cơ bản</TableHead>
            <TableHead>KPI (%)</TableHead>
            <TableHead>Tổng lương</TableHead>
            <TableHead>Hệ số lương</TableHead>
            <TableHead>Hệ số KPI</TableHead>
            <TableHead>Tổng KPI tháng</TableHead>
            <TableHead>Năng suất làm việc</TableHead>
            <TableHead>Chất lượng công việc</TableHead>
            <TableHead>Thái độ làm việc</TableHead>
            <TableHead>Tiến độ công việc</TableHead>
            <TableHead>Yêu cầu công việc</TableHead>
            <TableHead>Tuyển dụng</TableHead>
            <TableHead>Doanh thu</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((detail, index) => (
            <TableRow key={detail.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{detail.employeeCode}</TableCell>
              <TableCell>
                <Badge variant={detail.hasKPIGap ? "destructive" : "secondary"}>
                  {detail.hasKPIGap ? 'Có' : 'Không'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{formatKPINumber(detail.basicSalary)}</TableCell>
              <TableCell className="text-right">{formatKPINumber(detail.kpi)}</TableCell>
              <TableCell className="text-right">{formatKPINumber(detail.totalSalary)}</TableCell>
              <TableCell className="text-right">{formatKPINumber(detail.salaryCoefficient)}</TableCell>
              <TableCell className="text-right">{formatKPINumber(detail.kpiCoefficient)}</TableCell>
              <TableCell className="text-right">{formatKPINumber(detail.totalMonthlyKPI)}</TableCell>
              <TableCell className="text-right">{formatKPINumber(detail.workProductivity.total)}</TableCell>
              <TableCell className="text-right">{formatKPINumber(detail.workQuality.total)}</TableCell>
              <TableCell className="text-right">{formatKPINumber(detail.attitude.total)}</TableCell>
              <TableCell className="text-right">{formatKPINumber(detail.progress.total)}</TableCell>
              <TableCell className="text-right">{formatKPINumber(detail.requirements.total)}</TableCell>
              <TableCell className="text-right">{formatKPINumber(detail.recruitment.total)}</TableCell>
              <TableCell className="text-right">{formatKPINumber(detail.revenue.clientsOver100M)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetail(detail.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(detail.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(detail.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function formatKPINumber(value: number): string {
  return Math.round(value).toLocaleString();
}
