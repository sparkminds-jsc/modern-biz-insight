import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { EstimatesSection } from '@/components/strategy/EstimatesSection';
import { AverageCostsSection } from '@/components/strategy/AverageCostsSection';
import { StatisticsSection } from '@/components/strategy/StatisticsSection';
import { ProjectStaffSection } from '@/components/strategy/ProjectStaffSection';

export default function StrategyPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dự đoán chiến lược</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý ước tính dự án và chi phí trung bình theo team
          </p>
        </div>

        <ProjectStaffSection refreshTrigger={refreshKey} />
        
        <StatisticsSection key="statistics" />

        <EstimatesSection onSave={handleDataChange} />
        <AverageCostsSection onSave={handleDataChange} />
      </div>
    </AppLayout>
  );
}
