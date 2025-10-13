import { AppLayout } from '@/components/layout/AppLayout';
import { EstimatesSection } from '@/components/strategy/EstimatesSection';
import { AverageCostsSection } from '@/components/strategy/AverageCostsSection';
import { StatisticsSection } from '@/components/strategy/StatisticsSection';
import { TimelineSection } from '@/components/strategy/TimelineSection';

export default function StrategyPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dự đoán chiến lược</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý ước tính dự án và chi phí trung bình theo team
          </p>
        </div>

        <EstimatesSection />
        <AverageCostsSection />

        <StatisticsSection />

        <TimelineSection />
      </div>
    </AppLayout>
  );
}
