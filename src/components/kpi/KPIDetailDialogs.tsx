
import { KPIDetailEditForm } from './KPIDetailEditForm';
import { CopyKPIDialog } from './CopyKPIDialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { KPIDetailData } from '@/types/kpiDetail';

interface KPIDetailDialogsProps {
  // Edit form props
  showEditForm: boolean;
  onCloseEditForm: () => void;
  onSave: () => void;
  editingKPIDetail: any;
  month: number;
  year: number;

  // Copy dialog props
  showCopyDialog: boolean;
  onCloseCopyDialog: () => void;
  onCopyConfirm: (copyMonth: number, copyYear: number) => void;

  // Salary incomplete dialog props
  showSalaryIncompleteDialog: boolean;
  onCloseSalaryIncompleteDialog: () => void;

  // Delete dialog props
  showDeleteDialog: boolean;
  onCloseDeleteDialog: () => void;
  deletingKPIDetail: KPIDetailData | null;
  onDeleteConfirm: () => void;
}

export function KPIDetailDialogs({
  showEditForm,
  onCloseEditForm,
  onSave,
  editingKPIDetail,
  month,
  year,
  showCopyDialog,
  onCloseCopyDialog,
  onCopyConfirm,
  showSalaryIncompleteDialog,
  onCloseSalaryIncompleteDialog,
  showDeleteDialog,
  onCloseDeleteDialog,
  deletingKPIDetail,
  onDeleteConfirm
}: KPIDetailDialogsProps) {
  return (
    <>
      {/* Edit Form */}
      <KPIDetailEditForm
        isOpen={showEditForm}
        onClose={onCloseEditForm}
        onSave={onSave}
        kpiDetail={editingKPIDetail}
        month={month}
        year={year}
      />

      {/* Copy KPI Dialog */}
      <CopyKPIDialog
        isOpen={showCopyDialog}
        onClose={onCloseCopyDialog}
        onCopy={onCopyConfirm}
      />

      {/* Salary Sheet Incomplete Dialog */}
      <AlertDialog open={showSalaryIncompleteDialog} onOpenChange={onCloseSalaryIncompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bảng lương chưa hoàn thành</AlertDialogTitle>
            <AlertDialogDescription>
              Bảng lương của tháng/năm đã chọn chưa được hoàn thành. 
              Vui lòng hoàn thành bảng lương trước khi copy KPI.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onCloseSalaryIncompleteDialog}>
              Đã hiểu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={onCloseDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa KPI</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa KPI của nhân viên {deletingKPIDetail?.employeeCode} không? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
