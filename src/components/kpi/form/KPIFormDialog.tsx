
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { KPIFormContent } from './KPIFormContent';

interface KPIFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  kpiDetail?: any;
  month: number;
  year: number;
}

export function KPIFormDialog({
  isOpen,
  onClose,
  onSave,
  kpiDetail,
  month,
  year
}: KPIFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {kpiDetail ? 'Chỉnh sửa KPI chi tiết' : 'Thêm KPI chi tiết'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <KPIFormContent
            onClose={onClose}
            onSave={onSave}
            kpiDetail={kpiDetail}
            month={month}
            year={year}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
