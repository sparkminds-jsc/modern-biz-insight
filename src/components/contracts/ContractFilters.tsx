
import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContractFilters as ContractFiltersType } from '@/types/contract';

interface ContractFiltersProps {
  filters: ContractFiltersType;
  onFiltersChange: (filters: ContractFiltersType) => void;
  onSearch: () => void;
  onAddContract: () => void;
}

export function ContractFilters({ filters, onFiltersChange, onSearch, onAddContract }: ContractFiltersProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên khách hàng
          </label>
          <Input
            type="text"
            placeholder="Nhập tên khách hàng..."
            value={filters.customer_name}
            onChange={(e) => onFiltersChange({ ...filters, customer_name: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tự động gia hạn
          </label>
          <Select
            value={filters.auto_renewal}
            onValueChange={(value) => onFiltersChange({ ...filters, auto_renewal: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="true">Có</SelectItem>
              <SelectItem value="false">Không</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end space-x-2">
          <Button onClick={onSearch} className="flex-1">
            <Search className="w-4 h-4 mr-2" />
            Tìm kiếm
          </Button>
          <Button onClick={onAddContract} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Thêm hợp đồng
          </Button>
        </div>
      </div>
    </div>
  );
}
