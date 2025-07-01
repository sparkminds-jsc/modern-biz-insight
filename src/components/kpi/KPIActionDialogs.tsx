
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface KPIActionDialogsProps {
  showCompleteDialog: boolean;
  onCloseCompleteDialog: () => void;
  onConfirmComplete: () => void;
  showDeleteDialog: boolean;
  onCloseDeleteDialog: () => void;
  onConfirmDelete: () => void;
  selectedKPI: { year: number; month: number } | null;
}

export function KPIActionDialogs({
  showCompleteDialog,
  onCloseCompleteDialog,
  onConfirmComplete,
  showDeleteDialog,
  onCloseDeleteDialog,
  onConfirmDelete,
  selectedKPI
}: KPIActionDialogsProps) {
  return (
    <>
      {/* Complete Confirmation Dialog */}
      <AlertDialog open={showCompleteDialog} onOpenChange={onCloseCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hoàn thành KPI</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đánh dấu KPI tháng {selectedKPI?.month?.toString().padStart(2, '0')}/{selectedKPI?.year} là hoàn thành không? 
              Sau khi hoàn thành, bạn sẽ không thể chỉnh sửa hoặc xóa KPI này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCloseCompleteDialog}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmComplete} className="bg-green-600 hover:bg-green-700">
              Đồng ý
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
              Bạn có chắc chắn muốn xóa KPI tháng {selectedKPI?.month?.toString().padStart(2, '0')}/{selectedKPI?.year} không? 
              Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu KPI chi tiết liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCloseDeleteDialog}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
