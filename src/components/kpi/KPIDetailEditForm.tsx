
import { KPIFormDialog } from './form/KPIFormDialog';

interface KPIDetailEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  kpiDetail?: any;
  month: number;
  year: number;
}

export function KPIDetailEditForm({
  isOpen,
  onClose,
  onSave,
  kpiDetail,
  month,
  year
}: KPIDetailEditFormProps) {
  return (
    <KPIFormDialog
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      kpiDetail={kpiDetail}
      month={month}
      year={year}
    />
  );
}
