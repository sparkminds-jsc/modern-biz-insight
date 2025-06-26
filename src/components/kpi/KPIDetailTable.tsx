
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
import { ChevronUp, ChevronDown, Eye, Edit } from 'lucide-react';

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
  // Chất lượng công việc
  workQuality: {
    total: number;
    prodBugs: number;
    testBugs: number;
  };
  // Tỷ lệ pull request
  pullRequest: {
    mergeRatio: number;
  };
  // Thái độ và đóng góp
  attitude: {
    total: number;
    positiveAttitude: number;
    techContribution: number;
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
}

type SortField = string;
type SortDirection = 'asc' | 'desc';

export function KPIDetailTable({ data, onViewDetail, onEdit }: KPIDetailTableProps) {
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader field="stt">Số TT</SortableHeader>
            <SortableHeader field="employeeCode">Mã nhân viên</SortableHeader>
            <SortableHeader field="hasKPIGap">Lệch KPI</SortableHeader>
            <SortableHeader field="basicSalary">Lương căn bản</SortableHeader>
            <SortableHeader field="kpi">KPI</SortableHeader>
            <SortableHeader field="totalSalary">Tổng Lương</SortableHeader>
            <SortableHeader field="salaryCoefficient">Hệ số lương</SortableHeader>
            <SortableHeader field="kpiCoefficient">Hệ số KPI</SortableHeader>
            <SortableHeader field="totalMonthlyKPI">Tổng KPI trong tháng</SortableHeader>
            
            {/* Năng suất công việc */}
            <TableHead className="text-center border-l border-gray-200" colSpan={8}>
              Năng suất công việc
            </TableHead>
            
            {/* Chất lượng công việc */}
            <TableHead className="text-center border-l border-gray-200" colSpan={3}>
              Chất lượng công việc
            </TableHead>
            
            {/* Tỷ lệ pull request */}
            <TableHead className="text-center border-l border-gray-200">
              Tỷ lệ pull request
            </TableHead>
            
            {/* Thái độ và đóng góp */}
            <TableHead className="text-center border-l border-gray-200" colSpan={7}>
              Thái độ và đóng góp
            </TableHead>
            
            {/* Tiến độ & kế hoạch */}
            <TableHead className="text-center border-l border-gray-200" colSpan={4}>
              Tiến độ & kế hoạch
            </TableHead>
            
            {/* Quản lý yêu cầu & chất lượng đầu ra */}
            <TableHead className="text-center border-l border-gray-200" colSpan={3}>
              Quản lý yêu cầu & chất lượng đầu ra
            </TableHead>
            
            {/* Tuyển dụng */}
            <TableHead className="text-center border-l border-gray-200" colSpan={4}>
              Tuyển dụng
            </TableHead>
            
            {/* Doanh số */}
            <TableHead className="text-center border-l border-gray-200">
              Doanh số
            </TableHead>
            
            <TableHead className="text-center border-l border-gray-200">Action</TableHead>
          </TableRow>
          
          {/* Sub headers */}
          <TableRow className="bg-gray-50">
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            
            {/* Năng suất công việc sub headers */}
            <SortableHeader field="workProductivity.total" className="text-xs">Tổng</SortableHeader>
            <SortableHeader field="workProductivity.completedOnTime" className="text-xs">Hoàn thành đúng deadline</SortableHeader>
            <SortableHeader field="workProductivity.overdueTask" className="text-xs">Task trễ deadline</SortableHeader>
            <SortableHeader field="workProductivity.taskTarget" className="text-xs">Đạt chỉ tiêu task (10)</SortableHeader>
            <SortableHeader field="workProductivity.locTarget" className="text-xs">LOC vượt chỉ tiêu (10000)</SortableHeader>
            <SortableHeader field="workProductivity.lotTarget" className="text-xs">LOT vượt chỉ tiêu (1000)</SortableHeader>
            <SortableHeader field="workProductivity.effortRatio" className="text-xs">Tỷ lệ effort (>80%)</SortableHeader>
            <SortableHeader field="workProductivity.gitActivity" className="text-xs">Git activity (5)</SortableHeader>
            
            {/* Chất lượng công việc sub headers */}
            <SortableHeader field="workQuality.total" className="text-xs">Tổng</SortableHeader>
            <SortableHeader field="workQuality.prodBugs" className="text-xs">Bug môi trường thực tế</SortableHeader>
            <SortableHeader field="workQuality.testBugs" className="text-xs">Bug môi trường test</SortableHeader>
            
            {/* Pull request sub header */}
            <SortableHeader field="pullRequest.mergeRatio" className="text-xs">Merge không chỉnh sửa (>30%)</SortableHeader>
            
            {/* Thái độ sub headers */}
            <SortableHeader field="attitude.total" className="text-xs">Tổng</SortableHeader>
            <SortableHeader field="attitude.positiveAttitude" className="text-xs">Thái độ tích cực</SortableHeader>
            <SortableHeader field="attitude.techContribution" className="text-xs">Đóng góp kĩ thuật</SortableHeader>
            <SortableHeader field="attitude.techSharing" className="text-xs">Tech sharing</SortableHeader>
            <SortableHeader field="attitude.techArticles" className="text-xs">Bài viết kỹ thuật</SortableHeader>
            <SortableHeader field="attitude.mentoring" className="text-xs">Đào tạo nhân sự</SortableHeader>
            <SortableHeader field="attitude.teamManagement" className="text-xs">Quản lý team</SortableHeader>
            
            {/* Tiến độ sub headers */}
            <SortableHeader field="progress.total" className="text-xs">Tổng</SortableHeader>
            <SortableHeader field="progress.onTimeCompletion" className="text-xs">Hoàn thành đúng tiến độ</SortableHeader>
            <SortableHeader field="progress.storyPointAccuracy" className="text-xs">Story point đúng plan</SortableHeader>
            <SortableHeader field="progress.planChanges" className="text-xs">Thay đổi kế hoạch</SortableHeader>
            
            {/* Yêu cầu sub headers */}
            <SortableHeader field="requirements.total" className="text-xs">Tổng</SortableHeader>
            <SortableHeader field="requirements.changeRequests" className="text-xs">Yêu cầu thay đổi</SortableHeader>
            <SortableHeader field="requirements.misunderstandingErrors" className="text-xs">Lỗi hiểu sai yêu cầu</SortableHeader>
            
            {/* Tuyển dụng sub headers */}
            <SortableHeader field="recruitment.total" className="text-xs">Tổng</SortableHeader>
            <SortableHeader field="recruitment.cvCount" className="text-xs">CV tuyển dụng</SortableHeader>
            <SortableHeader field="recruitment.passedCandidates" className="text-xs">Ứng viên vượt qua</SortableHeader>
            <SortableHeader field="recruitment.recruitmentCost" className="text-xs">Chi phí/ứng viên</SortableHeader>
            
            {/* Doanh số sub header */}
            <SortableHeader field="revenue.clientsOver100M" className="text-xs">KH >100tr/tháng</SortableHeader>
            
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={37} className="text-center py-8 text-gray-500">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.employeeCode}</TableCell>
                <TableCell>{item.hasKPIGap ? 'Có' : 'Không'}</TableCell>
                <TableCell>{Math.round(item.basicSalary).toLocaleString()}</TableCell>
                <TableCell>{Math.round(item.kpi)}</TableCell>
                <TableCell>{Math.round(item.totalSalary).toLocaleString()}</TableCell>
                <TableCell>{Math.round(item.salaryCoefficient)}</TableCell>
                <TableCell>{Math.round(item.kpiCoefficient)}</TableCell>
                <TableCell>{Math.round(item.totalMonthlyKPI)}</TableCell>
                
                {/* Năng suất công việc */}
                <TableCell className="border-l border-gray-200">{Math.round(item.workProductivity.total)}</TableCell>
                <TableCell>{Math.round(item.workProductivity.completedOnTime)}</TableCell>
                <TableCell>{Math.round(item.workProductivity.overdueTask)}</TableCell>
                <TableCell>{Math.round(item.workProductivity.taskTarget)}</TableCell>
                <TableCell>{Math.round(item.workProductivity.locTarget)}</TableCell>
                <TableCell>{Math.round(item.workProductivity.lotTarget)}</TableCell>
                <TableCell>{Math.round(item.workProductivity.effortRatio)}</TableCell>
                <TableCell>{Math.round(item.workProductivity.gitActivity)}</TableCell>
                
                {/* Chất lượng công việc */}
                <TableCell className="border-l border-gray-200">{Math.round(item.workQuality.total)}</TableCell>
                <TableCell>{Math.round(item.workQuality.prodBugs)}</TableCell>
                <TableCell>{Math.round(item.workQuality.testBugs)}</TableCell>
                
                {/* Pull request */}
                <TableCell className="border-l border-gray-200">{Math.round(item.pullRequest.mergeRatio)}</TableCell>
                
                {/* Thái độ */}
                <TableCell className="border-l border-gray-200">{Math.round(item.attitude.total)}</TableCell>
                <TableCell>{Math.round(item.attitude.positiveAttitude)}</TableCell>
                <TableCell>{Math.round(item.attitude.techContribution)}</TableCell>
                <TableCell>{Math.round(item.attitude.techSharing)}</TableCell>
                <TableCell>{Math.round(item.attitude.techArticles)}</TableCell>
                <TableCell>{Math.round(item.attitude.mentoring)}</TableCell>
                <TableCell>{Math.round(item.attitude.teamManagement)}</TableCell>
                
                {/* Tiến độ */}
                <TableCell className="border-l border-gray-200">{Math.round(item.progress.total)}</TableCell>
                <TableCell>{Math.round(item.progress.onTimeCompletion)}</TableCell>
                <TableCell>{Math.round(item.progress.storyPointAccuracy)}</TableCell>
                <TableCell>{Math.round(item.progress.planChanges)}</TableCell>
                
                {/* Yêu cầu */}
                <TableCell className="border-l border-gray-200">{Math.round(item.requirements.total)}</TableCell>
                <TableCell>{Math.round(item.requirements.changeRequests)}</TableCell>
                <TableCell>{Math.round(item.requirements.misunderstandingErrors)}</TableCell>
                
                {/* Tuyển dụng */}
                <TableCell className="border-l border-gray-200">{Math.round(item.recruitment.total)}</TableCell>
                <TableCell>{Math.round(item.recruitment.cvCount)}</TableCell>
                <TableCell>{Math.round(item.recruitment.passedCandidates)}</TableCell>
                <TableCell>{Math.round(item.recruitment.recruitmentCost)}</TableCell>
                
                {/* Doanh số */}
                <TableCell className="border-l border-gray-200">{Math.round(item.revenue.clientsOver100M)}</TableCell>
                
                {/* Actions */}
                <TableCell className="border-l border-gray-200">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetail(item.id)}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Eye className="h-3 w-3" />
                      Chi tiết
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(item.id)}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Edit className="h-3 w-3" />
                      Sửa
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
