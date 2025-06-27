
import { Calendar, AlertCircle, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Employee {
  id: string;
  full_name: string;
  position: string;
  birth_date: string | null;
  contract_end_date: string | null;
  team: string;
  hasBirthdayThisMonth: boolean;
  hasContractEndThisMonth: boolean;
  birthdayHandled: boolean;
  contractHandled: boolean;
}

export function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'Đang làm');

      if (error) throw error;

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const processedEmployees = (data || []).map((employee) => {
        let hasBirthdayThisMonth = false;
        let hasContractEndThisMonth = false;

        if (employee.birth_date) {
          const birthDate = new Date(employee.birth_date);
          hasBirthdayThisMonth = birthDate.getMonth() + 1 === currentMonth;
        }

        if (employee.contract_end_date) {
          const contractEndDate = new Date(employee.contract_end_date);
          hasContractEndThisMonth = 
            contractEndDate.getMonth() + 1 === currentMonth && 
            contractEndDate.getFullYear() === currentYear;
        }

        return {
          ...employee,
          hasBirthdayThisMonth,
          hasContractEndThisMonth,
          birthdayHandled: false,
          contractHandled: false
        };
      }).filter(employee => employee.hasBirthdayThisMonth || employee.hasContractEndThisMonth);

      setEmployees(processedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách nhân viên',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleBirthdayGift = (employeeId: string) => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === employeeId ? { ...emp, birthdayHandled: true } : emp
      )
    );
    toast({
      title: 'Thành công',
      description: 'Đã đánh dấu đã tặng quà sinh nhật',
    });
  };

  const handleContractSigned = (employeeId: string) => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === employeeId ? { ...emp, contractHandled: true } : emp
      )
    );
    toast({
      title: 'Thành công',
      description: 'Đã đánh dấu đã ký hợp đồng',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

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
            Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {employee.full_name.split(' ').pop()?.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.full_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.team}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.birth_date ? (
                    <span className={`text-sm ${
                      employee.hasBirthdayThisMonth && !employee.birthdayHandled 
                        ? 'font-bold text-red-600' 
                        : 'text-gray-500'
                    }`}>
                      {new Date(employee.birth_date).toLocaleDateString('vi-VN')}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Không có</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.contract_end_date ? (
                    <span className={`text-sm ${
                      employee.hasContractEndThisMonth && !employee.contractHandled 
                        ? 'font-bold text-red-600' 
                        : 'text-gray-500'
                    }`}>
                      {new Date(employee.contract_end_date).toLocaleDateString('vi-VN')}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Vô thời hạn</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {employee.hasBirthdayThisMonth && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee.birthdayHandled 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {employee.birthdayHandled ? 'Đã tặng SN' : 'Sinh nhật'}
                      </span>
                    )}
                    {employee.hasContractEndThisMonth && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee.contractHandled 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {employee.contractHandled ? 'Đã ký HĐ' : 'Hết HĐ'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {employee.hasBirthdayThisMonth && !employee.birthdayHandled && (
                      <button
                        onClick={() => handleBirthdayGift(employee.id)}
                        className="inline-flex items-center px-3 py-1 border border-green-300 text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Đã tặng SN
                      </button>
                    )}
                    {employee.hasContractEndThisMonth && !employee.contractHandled && (
                      <button
                        onClick={() => handleContractSigned(employee.id)}
                        className="inline-flex items-center px-3 py-1 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Đã ký HĐ
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không có nhân viên nào có sự kiện trong tháng này
          </div>
        )}
      </div>
    </div>
  );
}
