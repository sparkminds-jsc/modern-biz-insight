import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/numberFormat';

interface ProjectBillSummaryProps {
  data: Array<{
    billVnd: number;
    billUsd: number;
    billUsdt: number;
  }>;
}

export function ProjectBillSummary({ data }: ProjectBillSummaryProps) {
  const totalVnd = data.reduce((sum, item) => sum + item.billVnd, 0);
  const totalUsd = data.reduce((sum, item) => sum + item.billUsd, 0);
  const totalUsdt = data.reduce((sum, item) => sum + item.billUsdt, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-blue-700 text-sm font-medium">
            Tổng Bill VND
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">
            {formatCurrency(totalVnd, 'VND')}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-700 text-sm font-medium">
            Tổng Bill USD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">
            {formatCurrency(totalUsd, 'USD')}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-purple-700 text-sm font-medium">
            Tổng Bill USDT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">
            {formatCurrency(totalUsdt, 'USDT')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}