
import { Eye, Edit, Download, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Contract, ContractSortConfig, ContractFile } from '@/types/contract';

interface ContractTableProps {
  contracts: Contract[];
  sortConfig: ContractSortConfig;
  onSort: (key: keyof Contract) => void;
  onEdit: (contract: Contract) => void;
  onDownloadFile: (file: ContractFile) => void;
}

export function ContractTable({ contracts, sortConfig, onSort, onEdit, onDownloadFile }: ContractTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getSortIcon = (key: keyof Contract) => {
    if (sortConfig.key !== key) {
      return <ArrowUp className="w-4 h-4 opacity-30" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  const renderSortableHeader = (key: keyof Contract, label: string) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => onSort(key)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {getSortIcon(key)}
      </div>
    </TableHead>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {renderSortableHeader('contract_code', 'Mã hợp đồng')}
            {renderSortableHeader('contract_name', 'Tên hợp đồng')}
            {renderSortableHeader('customer_name', 'Tên khách hàng')}
            {renderSortableHeader('sign_date', 'Ngày kí')}
            {renderSortableHeader('expire_date', 'Ngày hết hạn')}
            <TableHead>Link hợp đồng</TableHead>
            {renderSortableHeader('status', 'Trạng thái')}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{contract.contract_code}</TableCell>
              <TableCell>{contract.contract_name}</TableCell>
              <TableCell>{contract.customer_name}</TableCell>
              <TableCell>{formatDate(contract.sign_date)}</TableCell>
              <TableCell>{formatDate(contract.expire_date)}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  {contract.contract_files.map((file) => (
                    <Button
                      key={file.id}
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-blue-600"
                      onClick={() => onDownloadFile(file)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      {file.name}
                    </Button>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  contract.status === 'Đang còn' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {contract.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(contract)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {contracts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không có dữ liệu hợp đồng
        </div>
      )}
    </div>
  );
}
