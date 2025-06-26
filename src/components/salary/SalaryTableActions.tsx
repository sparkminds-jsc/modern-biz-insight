
import { Eye, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SalaryDetail } from '@/types/salary';

interface SalaryTableActionsProps {
  detail: SalaryDetail;
  onViewDetail: (detail: SalaryDetail) => void;
  onEdit: (detail: SalaryDetail) => void;
  onDelete: (detail: SalaryDetail) => void;
}

export function SalaryTableActions({ detail, onViewDetail, onEdit, onDelete }: SalaryTableActionsProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewDetail(detail)}
      >
        <Eye className="w-4 h-4 mr-1" />
        Chi tiết
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(detail)}
      >
        <Edit className="w-4 h-4 mr-1" />
        Sửa
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDelete(detail)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash className="w-4 h-4 mr-1" />
        Xóa
      </Button>
    </div>
  );
}
