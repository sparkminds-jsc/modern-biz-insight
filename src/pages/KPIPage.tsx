
import { AppLayout } from '../components/layout/AppLayout';

const KPIPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý KPI</h1>
          <p className="text-gray-600">Đánh giá hiệu suất làm việc</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">Trang quản lý KPI đang được phát triển</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default KPIPage;
