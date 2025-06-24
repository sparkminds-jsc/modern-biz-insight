
import { AppLayout } from '../components/layout/AppLayout';

const ExpensesPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý chi phí</h1>
          <p className="text-gray-600">Theo dõi và kiểm soát chi phí</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">Trang quản lý chi phí đang được phát triển</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default ExpensesPage;
