import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Employee } from '@/types/employee';

interface EmployeeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export function EmployeeDetail({ isOpen, onClose, employee }: EmployeeDetailProps) {
  if (!employee) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Không có';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết nhân viên</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Mã nhân viên</h3>
              <p className="text-gray-600">{employee.employee_code}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Họ và tên</h3>
              <p className="text-gray-600">{employee.full_name}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Email</h3>
            <p className="text-gray-600">{employee.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Ngày sinh</h3>
              <p className="text-gray-600">{formatDate(employee.birth_date)}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Chức vụ</h3>
              <p className="text-gray-600">{employee.position}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Loại hợp đồng</h3>
              <p className="text-gray-600">{employee.contract_type}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Ngày kết thúc HĐ</h3>
              <p className="text-gray-600">{formatDate(employee.contract_end_date)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Team</h3>
              <p className="text-gray-600">{employee.team}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Trạng thái</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                employee.status === 'Đang làm' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {employee.status}
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">Ngày tạo</h3>
                <p className="text-gray-600">{formatDateTime(employee.created_at)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Cập nhật lần cuối</h3>
                <p className="text-gray-600">{formatDateTime(employee.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
