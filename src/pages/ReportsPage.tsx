
import { AppLayout } from '../components/layout/AppLayout';

const ReportsPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý báo cáo team</h1>
          <p className="text-gray-600">Báo cáo hiệu suất và thống kê team</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">Trang quản lý báo cáo team đang được phát triển</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
