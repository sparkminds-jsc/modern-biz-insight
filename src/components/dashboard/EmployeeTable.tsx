
import { Calendar, AlertCircle } from 'lucide-react';

const employees = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    position: 'Developer',
    birthday: '2024-06-15',
    contractEnd: null,
    department: 'IT',
    hasBirthdayThisMonth: true,
    hasContractEndThisMonth: false
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    position: 'Designer',
    birthday: '1990-03-20',
    contractEnd: '2024-06-30',
    department: 'Design',
    hasBirthdayThisMonth: false,
    hasContractEndThisMonth: true
  },
  {
    id: 3,
    name: 'Lê Văn Cường',
    position: 'Manager',
    birthday: '2024-06-25',
    contractEnd: null,
    department: 'Management',
    hasBirthdayThisMonth: true,
    hasContractEndThisMonth: false
  },
  {
    id: 4,
    name: 'Phạm Thị Dung',
    position: 'HR Specialist',
    birthday: '1992-08-10',
    contractEnd: '2024-06-28',
    department: 'HR',
    hasBirthdayThisMonth: false,
    hasContractEndThisMonth: true
  },
  {
    id: 5,
    name: 'Hoàng Văn Em',
    position: 'Sales',
    birthday: '1988-12-05',
    contractEnd: null,
    department: 'Sales',
    hasBirthdayThisMonth: false,
    hasContractEndThisMonth: false
  },
];

export function EmployeeTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nhân viên có sự kiện trong tháng</h2>
            <p className="text-gray-600">Sinh nhật và kết thúc hợp đồng</p>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            Tháng 6/2024
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhân viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chức vụ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phòng ban
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày sinh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kết thúc HĐ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {employee.name.split(' ').pop()?.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm ${employee.hasBirthdayThisMonth ? 'font-bold text-red-600' : 'text-gray-500'}`}>
                    {new Date(employee.birthday).toLocaleDateString('vi-VN')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.contractEnd ? (
                    <span className={`text-sm ${employee.hasContractEndThisMonth ? 'font-bold text-red-600' : 'text-gray-500'}`}>
                      {new Date(employee.contractEnd).toLocaleDateString('vi-VN')}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Vô thời hạn</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {employee.hasBirthdayThisMonth && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <Calendar className="w-3 h-3 mr-1" />
                        Sinh nhật
                      </span>
                    )}
                    {employee.hasContractEndThisMonth && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Hết HĐ
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
