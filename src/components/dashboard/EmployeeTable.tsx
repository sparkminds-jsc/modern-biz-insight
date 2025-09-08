
import { Calendar, AlertCircle, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Employee {
  id: string;
  full_name: string;
  position: string;
  birth_date: string | null;
  contract_end_date: string | null;
  team: string;
  birthdayGiftDate: string | null;
  contractSignedDate: string | null;
}

type SortField = 'birth_date' | 'contract_end_date';
type SortDirection = 'asc' | 'desc';

export function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('birth_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'Đang làm');

      if (error) throw error;

      const currentYear = new Date().getFullYear();

      // Fetch all employee events to get historical birthday gift and contract signing dates
      const { data: employeeEvents, error: eventsError } = await supabase
        .from('employee_events')
        .select('*');

      if (eventsError) throw eventsError;

      const processedEmployees = (data || []).map((employee) => {
        // Find the most recent birthday gift and contract signing dates for this employee
        const employeeEventsList = employeeEvents?.filter(event => event.employee_id === employee.id) || [];
        
        let birthdayGiftDate = null;
        let contractSignedDate = null;

        // Get the most recent dates from events
        employeeEventsList.forEach(event => {
          if (event.birthday_gift_date && (!birthdayGiftDate || new Date(event.birthday_gift_date) > new Date(birthdayGiftDate))) {
            birthdayGiftDate = event.birthday_gift_date;
          }
          if (event.contract_signed_date && (!contractSignedDate || new Date(event.contract_signed_date) > new Date(contractSignedDate))) {
            contractSignedDate = event.contract_signed_date;
          }
        });

        // Check if employee has events with years different from current year
        let showForBirthday = false;
        let showForContract = false;

        if (employee.birth_date) {
          const lastGiftYear = birthdayGiftDate ? new Date(birthdayGiftDate).getFullYear() : null;
          showForBirthday = !lastGiftYear || lastGiftYear !== currentYear;
        }

        if (employee.contract_end_date) {
          const lastSignYear = contractSignedDate ? new Date(contractSignedDate).getFullYear() : null;
          showForContract = !lastSignYear || lastSignYear !== currentYear;
        }

        return {
          ...employee,
          birthdayGiftDate,
          contractSignedDate
        };
      }).filter(employee => {
        // Show employees who have birth dates or contract end dates and don't have current year events
        const birthdayGiftYear = employee.birthdayGiftDate ? new Date(employee.birthdayGiftDate).getFullYear() : null;
        const contractSignedYear = employee.contractSignedDate ? new Date(employee.contractSignedDate).getFullYear() : null;
        
        const showForBirthday = employee.birth_date && (!birthdayGiftYear || birthdayGiftYear !== currentYear);
        const showForContract = employee.contract_end_date && (!contractSignedYear || contractSignedYear !== currentYear);
        
        return showForBirthday || showForContract;
      });

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    if (selectedMonth === 'all') return true;
    
    const month = parseInt(selectedMonth);
    const birthMonth = employee.birth_date ? new Date(employee.birth_date).getMonth() + 1 : null;
    const contractMonth = employee.contract_end_date ? new Date(employee.contract_end_date).getMonth() + 1 : null;
    
    return birthMonth === month || contractMonth === month;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (!aValue && !bValue) return 0;
    if (!aValue) return 1;
    if (!bValue) return -1;
    
    const comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleBirthdayGift = async (employeeId: string) => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const { error } = await supabase
        .from('employee_events')
        .upsert({
          employee_id: employeeId,
          month: currentMonth,
          year: currentYear,
          birthday_handled: true,
          birthday_gift_date: currentDate.toISOString()
        }, {
          onConflict: 'employee_id,month,year'
        });

      if (error) throw error;

      // Refresh the data to show updated dates
      fetchEmployees();
      
      toast({
        title: 'Thành công',
        description: 'Đã đánh dấu đã tặng quà sinh nhật',
      });
    } catch (error) {
      console.error('Error updating birthday status:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái sinh nhật',
        variant: 'destructive',
      });
    }
  };

  const handleContractSigned = async (employeeId: string) => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const { error } = await supabase
        .from('employee_events')
        .upsert({
          employee_id: employeeId,
          month: currentMonth,
          year: currentYear,
          contract_handled: true,
          contract_signed_date: currentDate.toISOString()
        }, {
          onConflict: 'employee_id,month,year'
        });

      if (error) throw error;

      // Refresh the data to show updated dates
      fetchEmployees();
      
      toast({
        title: 'Thành công',
        description: 'Đã đánh dấu đã ký hợp đồng',
      });
    } catch (error) {
      console.error('Error updating contract status:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái hợp đồng',
        variant: 'destructive',
      });
    }
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
            <h2 className="text-xl font-bold text-gray-900">Sự kiện nhân viên</h2>
            <p className="text-gray-600">Sinh nhật và kết thúc hợp đồng</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="month-filter" className="text-sm font-medium text-gray-700">
                Tháng:
              </label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Chọn tháng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="1">Tháng 1</SelectItem>
                  <SelectItem value="2">Tháng 2</SelectItem>
                  <SelectItem value="3">Tháng 3</SelectItem>
                  <SelectItem value="4">Tháng 4</SelectItem>
                  <SelectItem value="5">Tháng 5</SelectItem>
                  <SelectItem value="6">Tháng 6</SelectItem>
                  <SelectItem value="7">Tháng 7</SelectItem>
                  <SelectItem value="8">Tháng 8</SelectItem>
                  <SelectItem value="9">Tháng 9</SelectItem>
                  <SelectItem value="10">Tháng 10</SelectItem>
                  <SelectItem value="11">Tháng 11</SelectItem>
                  <SelectItem value="12">Tháng 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              Năm {new Date().getFullYear()}
            </div>
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
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('birth_date')}
              >
                <div className="flex items-center gap-1">
                  Ngày sinh
                  {sortField === 'birth_date' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('contract_end_date')}
              >
                <div className="flex items-center gap-1">
                  Kết thúc HĐ
                  {sortField === 'contract_end_date' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tặng SN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày ký HĐ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEmployees.map((employee) => {
              const currentYear = new Date().getFullYear();
              const birthdayGiftYear = employee.birthdayGiftDate ? new Date(employee.birthdayGiftDate).getFullYear() : null;
              const contractSignedYear = employee.contractSignedDate ? new Date(employee.contractSignedDate).getFullYear() : null;
              
              const canGiveBirthdayGift = employee.birth_date && (!birthdayGiftYear || birthdayGiftYear !== currentYear);
              const canSignContract = employee.contract_end_date && (!contractSignedYear || contractSignedYear !== currentYear);

              return (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.birth_date ? (
                      new Date(employee.birth_date).toLocaleDateString('vi-VN')
                    ) : (
                      'Không có'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.contract_end_date ? (
                      new Date(employee.contract_end_date).toLocaleDateString('vi-VN')
                    ) : (
                      'Vô thời hạn'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.birthdayGiftDate ? (
                      new Date(employee.birthdayGiftDate).toLocaleDateString('vi-VN')
                    ) : (
                      'Chưa tặng'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.contractSignedDate ? (
                      new Date(employee.contractSignedDate).toLocaleDateString('vi-VN')
                    ) : (
                      'Chưa ký'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {canGiveBirthdayGift && (
                        <button
                          onClick={() => handleBirthdayGift(employee.id)}
                          className="inline-flex items-center px-3 py-1 border border-green-300 text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Đã tặng SN
                        </button>
                      )}
                      {canSignContract && (
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
              );
            })}
          </tbody>
        </table>
        {sortedEmployees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {selectedMonth === 'all' 
              ? 'Không có nhân viên nào cần xử lý sự kiện'
              : `Không có nhân viên nào có sự kiện trong tháng ${selectedMonth}`
            }
          </div>
        )}
      </div>
    </div>
  );
}
