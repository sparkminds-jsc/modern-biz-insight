
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus } from 'lucide-react';
import { InvoiceFilters as InvoiceFiltersType } from '@/types/invoice';

interface InvoiceFiltersProps {
  filters: InvoiceFiltersType;
  onFiltersChange: (filters: InvoiceFiltersType) => void;
  onSearch: () => void;
  onAddInvoice: () => void;
}

export function InvoiceFilters({ filters, onFiltersChange, onSearch, onAddInvoice }: InvoiceFiltersProps) {
  const handleFilterChange = (key: keyof InvoiceFiltersType, value: string) => {
    // Convert "all" values back to empty strings for the actual filter
    const actualValue = value === "all" ? "" : value;
    onFiltersChange({
      ...filters,
      [key]: actualValue
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên khách hàng
          </label>
          <Input
            placeholder="Nhập tên khách hàng"
            value={filters.customer_name}
            onChange={(e) => handleFilterChange('customer_name', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên Invoice
          </label>
          <Input
            placeholder="Nhập tên invoice"
            value={filters.invoice_name}
            onChange={(e) => handleFilterChange('invoice_name', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Mới tạo">Mới tạo</SelectItem>
              <SelectItem value="Đã xuất hóa đơn">Đã xuất hóa đơn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thu tiền
          </label>
          <Select value={filters.payment_status || "all"} onValueChange={(value) => handleFilterChange('payment_status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn tình trạng thu tiền" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Chưa thu">Chưa thu</SelectItem>
              <SelectItem value="Đã thu đủ">Đã thu đủ</SelectItem>
              <SelectItem value="Thu một phần">Thu một phần</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Là Crypto
          </label>
          <Select value={filters.is_crypto || "all"} onValueChange={(value) => handleFilterChange('is_crypto', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="true">Đúng</SelectItem>
              <SelectItem value="false">Không</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onSearch} className="bg-blue-600 hover:bg-blue-700">
          <Search className="w-4 h-4 mr-2" />
          Tìm kiếm
        </Button>
        <Button onClick={onAddInvoice} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Invoice
        </Button>
      </div>
    </div>
  );
}
