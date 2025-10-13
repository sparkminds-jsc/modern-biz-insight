import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EstimatesSection } from '@/components/strategy/EstimatesSection';
import { AverageCostsSection } from '@/components/strategy/AverageCostsSection';

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

        <Card>
          <CardHeader>
            <CardTitle>Thống kê</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Chức năng sẽ được bổ sung sau</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline nhân sự</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Chức năng sẽ được bổ sung sau</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
