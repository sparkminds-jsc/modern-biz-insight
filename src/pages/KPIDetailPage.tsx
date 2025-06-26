import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { KPIDetailFilters } from '../components/kpi/KPIDetailFilters';
import { KPIDetailSummary } from '../components/kpi/KPIDetailSummary';
import { KPIDetailTable } from '../components/kpi/KPIDetailTable';
import { KPIDetailEditForm } from '../components/kpi/KPIDetailEditForm';
import { CopyKPIDialog } from '../components/kpi/CopyKPIDialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const KPIDetailPage = () => {
  const { year, month } = useParams();
  const navigate = useNavigate();
  
  // Filter states
  const [employeeCode, setEmployeeCode] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [hasKPIGap, setHasKPIGap] = useState('all');
  
  // Edit form states
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingKPIDetail, setEditingKPIDetail] = useState(null);

  // Copy KPI states
  const [showCopyDialog, setShowCopyDialog] = useState(false);

  // Mock data - replace with real data later
  const [kpiDetails, setKpiDetails] = useState([
    {
      id: '1',
      employeeCode: 'EMP001',
      hasKPIGap: true,
      basicSalary: 15000000,
      kpi: 85,
      totalSalary: 18000000,
      salaryCoefficient: 1.2,
      kpiCoefficient: 0.85,
      totalMonthlyKPI: 102,
      workProductivity: {
        total: 95,
        completedOnTime: 0,
        overdueTask: 2,
        taskTarget: 0,
        locTarget: 12000,
        lotTarget: 1200,
        effortRatio: 0,
        gitActivity: 0
      },
      workQuality: {
        total: 88,
        prodBugs: 1,
        testBugs: 3,
        mergeRatio: 0
      },
      attitude: {
        total: 92,
        positiveAttitude: 0,
        techSharing: 2,
        techArticles: 1,
        mentoring: 1,
        teamManagement: 1
      },
      progress: {
        total: 87,
        onTimeCompletion: 0,
        storyPointAccuracy: 0,
        planChanges: 2
      },
      requirements: {
        total: 93,
        changeRequests: 1,
        misunderstandingErrors: 0
      },
      recruitment: {
        total: 0,
        cvCount: 0,
        passedCandidates: 0,
        recruitmentCost: 0
      },
      revenue: {
        clientsOver100M: 1
      }
    },
    {
      id: '2',
      employeeCode: 'EMP002',
      hasKPIGap: false,
      basicSalary: 20000000,
      kpi: 95,
      totalSalary: 24000000,
      salaryCoefficient: 1.2,
      kpiCoefficient: 0.95,
      totalMonthlyKPI: 114,
      workProductivity: {
        total: 98,
        completedOnTime: 0.5,
        overdueTask: 0,
        taskTarget: 0.2,
        locTarget: 15000,
        lotTarget: 1500,
        effortRatio: 0.2,
        gitActivity: 0.1
      },
      workQuality: {
        total: 95,
        prodBugs: 0,
        testBugs: 1,
        mergeRatio: 0.01
      },
      attitude: {
        total: 96,
        positiveAttitude: 0.001,
        techSharing: 3,
        techArticles: 2,
        mentoring: 2,
        teamManagement: 1
      },
      progress: {
        total: 94,
        onTimeCompletion: 0.05,
        storyPointAccuracy: 0.02,
        planChanges: 1
      },
      requirements: {
        total: 97,
        changeRequests: 0,
        misunderstandingErrors: 0
      },
      recruitment: {
        total: 85,
        cvCount: 1,
        passedCandidates: 5,
        recruitmentCost: 2000000
      },
      revenue: {
        clientsOver100M: 2
      }
    }
  ]);

  const [filteredData, setFilteredData] = useState(kpiDetails);

  const handleSearch = () => {
    let filtered = [...kpiDetails];
    
    if (employeeCode) {
      filtered = filtered.filter(item => 
        item.employeeCode.toLowerCase().includes(employeeCode.toLowerCase())
      );
    }
    
    if (hasKPIGap !== 'all') {
      const hasGap = hasKPIGap === 'yes';
      filtered = filtered.filter(item => item.hasKPIGap === hasGap);
    }
    
    setFilteredData(filtered);
  };

  const handleAddKPI = () => {
    setEditingKPIDetail(null);
    setShowEditForm(true);
  };

  const handleCopyKPI = () => {
    setShowCopyDialog(true);
  };

  const handleCopyConfirm = (copyMonth: number, copyYear: number) => {
    // In a real app, you would copy the KPI data to the new month/year
    console.log(`Copying KPI to ${copyMonth}/${copyYear}`);
    toast.success(`KPI đã được copy sang tháng ${copyMonth}/${copyYear}`);
    navigate('/kpi');
  };

  const handleViewDetail = (id: string) => {
    toast.info(`Xem chi tiết KPI của nhân viên ${id}`);
  };

  const handleEdit = (id: string) => {
    const kpiDetail = kpiDetails.find(item => item.id === id);
    setEditingKPIDetail(kpiDetail);
    setShowEditForm(true);
  };

  const handleFormSave = () => {
    // Refresh data after save
    // In a real app, you would fetch fresh data from the API
    toast.success('KPI đã được lưu thành công');
  };

  const handleBackToKPI = () => {
    navigate('/kpi');
  };

  const totalEmployeesWithKPIGap = filteredData.filter(item => item.hasKPIGap).length;

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back button */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleBackToKPI}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            KPI Chi tiết - {month?.padStart(2, '0')}/{year}
          </h1>
          <p className="text-gray-600">Chi tiết đánh giá KPI từng nhân viên</p>
        </div>

        {/* Filters */}
        <KPIDetailFilters
          employeeCode={employeeCode}
          employeeName={employeeName}
          hasKPIGap={hasKPIGap}
          onEmployeeCodeChange={setEmployeeCode}
          onEmployeeNameChange={setEmployeeName}
          onHasKPIGapChange={setHasKPIGap}
          onSearch={handleSearch}
          onAddKPI={handleAddKPI}
          onCopyKPI={handleCopyKPI}
        />

        {/* Summary */}
        <KPIDetailSummary totalEmployeesWithKPIGap={totalEmployeesWithKPIGap} />

        {/* Table */}
        <KPIDetailTable
          data={filteredData}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
        />

        {/* Edit Form */}
        <KPIDetailEditForm
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          onSave={handleFormSave}
          kpiDetail={editingKPIDetail}
          month={parseInt(month || '1')}
          year={parseInt(year || '2024')}
        />

        {/* Copy KPI Dialog */}
        <CopyKPIDialog
          isOpen={showCopyDialog}
          onClose={() => setShowCopyDialog(false)}
          onCopy={handleCopyConfirm}
        />
      </div>
    </AppLayout>
  );
};

export default KPIDetailPage;
