
import { ChevronUp, ChevronDown } from 'lucide-react';
import { TableHead } from '@/components/ui/table';
import { SalaryDetail } from '@/types/salary';

type SortField = keyof SalaryDetail;
type SortDirection = 'asc' | 'desc';

interface SortableTableHeaderProps {
  field: SortField;
  children: React.ReactNode;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export function SortableTableHeader({ 
  field, 
  children, 
  sortField, 
  sortDirection, 
  onSort 
}: SortableTableHeaderProps) {
  return (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
        )}
      </div>
    </TableHead>
  );
}
