
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
import { ChevronUp, ChevronDown, Eye, Edit, Trash2, Lock, Unlock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  getPerformanceLabel,
  getTaskTargetLabel,
  getEffortRatioLabel,
  getGitActivityLabel,
  getMergeRatioLabel,
  getPositiveAttitudeLabel,
  getTeamManagementLabel,
  getOnTimeCompletionLabel,
  getStoryPointAccuracyLabel,
  getCvCountLabel,
  getRecruitmentCostLabel
} from '@/utils/kpiValueToLabel';

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
  isLocked?: boolean;
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
  onToggleLock: (detail: KPIDetailData) => void;
}

type SortField = string;
type SortDirection = 'asc' | 'desc';

export function KPIDetailTable({ data, onViewDetail, onEdit, onDelete, onToggleLock }: KPIDetailTableProps) {
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
      <div className="overflow-x-auto">
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
              
              {/* Năng suất làm việc - chi tiết */}
              <TableHead className="bg-blue-50">(NSLV) - Tổng</TableHead>
              <TableHead className="bg-blue-50">(NSLV) - Hoàn thành đúng deadline</TableHead>
              <TableHead className="bg-blue-50">(NSLV) - Task trễ deadline</TableHead>
              <TableHead className="bg-blue-50">(NSLV) - Đạt chỉ tiêu task</TableHead>
              <TableHead className="bg-blue-50">(NSLV) - LOC vượt chỉ tiêu</TableHead>
              <TableHead className="bg-blue-50">(NSLV) - LOT vượt chỉ tiêu</TableHead>
              <TableHead className="bg-blue-50">(NSLV) - Tỷ lệ effort</TableHead>
              <TableHead className="bg-blue-50">(NSLV) - Git activity</TableHead>
              
              {/* Chất lượng công việc - chi tiết */}
              <TableHead className="bg-green-50">(CLCV) - Tổng</TableHead>
              <TableHead className="bg-green-50">(CLCV) - Bug production</TableHead>
              <TableHead className="bg-green-50">(CLCV) - Bug testing</TableHead>
              <TableHead className="bg-green-50">(CLCV) - Tỷ lệ merge</TableHead>
              
              {/* Thái độ làm việc - chi tiết */}
              <TableHead className="bg-yellow-50">(TDLV) - Tổng</TableHead>
              <TableHead className="bg-yellow-50">(TDLV) - Thái độ tích cực</TableHead>
              <TableHead className="bg-yellow-50">(TDLV) - Tech sharing</TableHead>
              <TableHead className="bg-yellow-50">(TDLV) - Bài viết kỹ thuật</TableHead>
              <TableHead className="bg-yellow-50">(TDLV) - Số NV đào tạo</TableHead>
              <TableHead className="bg-yellow-50">(TDLV) - Quản lý team</TableHead>
              
              {/* Tiến độ công việc - chi tiết */}
              <TableHead className="bg-purple-50">(TDCV) - Tổng</TableHead>
              <TableHead className="bg-purple-50">(TDCV) - Hoàn thành đúng tiến độ</TableHead>
              <TableHead className="bg-purple-50">(TDCV) - Story point đúng plan</TableHead>
              <TableHead className="bg-purple-50">(TDCV) - Thay đổi kế hoạch</TableHead>
              
              {/* Yêu cầu công việc - chi tiết */}
              <TableHead className="bg-red-50">(YCCV) - Tổng</TableHead>
              <TableHead className="bg-red-50">(YCCV) - Yêu cầu thay đổi</TableHead>
              <TableHead className="bg-red-50">(YCCV) - Lỗi hiểu sai YC</TableHead>
              
              {/* Tuyển dụng - chi tiết */}
              <TableHead className="bg-indigo-50">(TD) - Tổng</TableHead>
              <TableHead className="bg-indigo-50">(TD) - CV tuyển dụng</TableHead>
              <TableHead className="bg-indigo-50">(TD) - Ứng viên vượt qua</TableHead>
              <TableHead className="bg-indigo-50">(TD) - Chi phí/ứng viên</TableHead>
              
              {/* Doanh thu */}
              <TableHead className="bg-orange-50">KH &gt;100tr/tháng</TableHead>
              
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((detail, index) => (
              <TableRow key={detail.id} className={detail.isLocked ? "bg-green-100" : ""}>
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
                
                {/* Năng suất làm việc - chi tiết */}
                <TableCell className="text-right bg-blue-50">{formatKPINumber(detail.workProductivity.total)}</TableCell>
                <TableCell className="bg-blue-50">{getPerformanceLabel(detail.workProductivity.completedOnTime)}</TableCell>
                <TableCell className="text-right bg-blue-50">{formatKPINumber(detail.workProductivity.overdueTask)}</TableCell>
                <TableCell className="bg-blue-50">{getTaskTargetLabel(detail.workProductivity.taskTarget)}</TableCell>
                <TableCell className="text-right bg-blue-50">{formatKPINumber(detail.workProductivity.locTarget)}</TableCell>
                <TableCell className="text-right bg-blue-50">{formatKPINumber(detail.workProductivity.lotTarget)}</TableCell>
                <TableCell className="bg-blue-50">{getEffortRatioLabel(detail.workProductivity.effortRatio)}</TableCell>
                <TableCell className="bg-blue-50">{getGitActivityLabel(detail.workProductivity.gitActivity)}</TableCell>
                
                {/* Chất lượng công việc - chi tiết */}
                <TableCell className="text-right bg-green-50">{formatKPINumber(detail.workQuality.total)}</TableCell>
                <TableCell className="text-right bg-green-50">{formatKPINumber(detail.workQuality.prodBugs)}</TableCell>
                <TableCell className="text-right bg-green-50">{formatKPINumber(detail.workQuality.testBugs)}</TableCell>
                <TableCell className="bg-green-50">{getMergeRatioLabel(detail.workQuality.mergeRatio)}</TableCell>
                
                {/* Thái độ làm việc - chi tiết */}
                <TableCell className="text-right bg-yellow-50">{formatKPINumber(detail.attitude.total)}</TableCell>
                <TableCell className="bg-yellow-50">{getPositiveAttitudeLabel(detail.attitude.positiveAttitude)}</TableCell>
                <TableCell className="text-right bg-yellow-50">{formatKPINumber(detail.attitude.techSharing)}</TableCell>
                <TableCell className="text-right bg-yellow-50">{formatKPINumber(detail.attitude.techArticles)}</TableCell>
                <TableCell className="text-right bg-yellow-50">{formatKPINumber(detail.attitude.mentoring)}</TableCell>
                <TableCell className="bg-yellow-50">{getTeamManagementLabel(detail.attitude.teamManagement)}</TableCell>
                
                {/* Tiến độ công việc - chi tiết */}
                <TableCell className="text-right bg-purple-50">{formatKPINumber(detail.progress.total)}</TableCell>
                <TableCell className="bg-purple-50">{getOnTimeCompletionLabel(detail.progress.onTimeCompletion)}</TableCell>
                <TableCell className="bg-purple-50">{getStoryPointAccuracyLabel(detail.progress.storyPointAccuracy)}</TableCell>
                <TableCell className="text-right bg-purple-50">{formatKPINumber(detail.progress.planChanges)}</TableCell>
                
                {/* Yêu cầu công việc - chi tiết */}
                <TableCell className="text-right bg-red-50">{formatKPINumber(detail.requirements.total)}</TableCell>
                <TableCell className="text-right bg-red-50">{formatKPINumber(detail.requirements.changeRequests)}</TableCell>
                <TableCell className="text-right bg-red-50">{formatKPINumber(detail.requirements.misunderstandingErrors)}</TableCell>
                
                {/* Tuyển dụng - chi tiết */}
                <TableCell className="text-right bg-indigo-50">{formatKPINumber(detail.recruitment.total)}</TableCell>
                <TableCell className="bg-indigo-50">{getCvCountLabel(detail.recruitment.cvCount)}</TableCell>
                <TableCell className="text-right bg-indigo-50">{formatKPINumber(detail.recruitment.passedCandidates)}</TableCell>
                <TableCell className="bg-indigo-50">{getRecruitmentCostLabel(detail.recruitment.recruitmentCost)}</TableCell>
                
                {/* Doanh thu */}
                <TableCell className="text-right bg-orange-50">{formatKPINumber(detail.revenue.clientsOver100M)}</TableCell>
                
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleLock(detail)}
                      className={detail.isLocked ? "text-green-600 hover:text-green-700 hover:bg-green-50" : ""}
                    >
                      {detail.isLocked ? (
                        <Unlock className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function formatKPINumber(value: number): string {
  return Math.round(value).toLocaleString();
}
