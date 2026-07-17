import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
  onImported?: () => void;
}

export function ImportCashDialog({ open, onClose, onImported }: Props) {
  const [fileName, setFileName] = useState('');
  const [sheetName, setSheetName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [importing, setImporting] = useState(false);

  const reset = () => {
    setFileName('');
    setSheetName('');
    setPassword('');
    setShowPassword(false);
    setConfirming(false);
    setImporting(false);
  };

  const handleClose = () => {
    if (importing) return;
    reset();
    onClose();
    setTimeout(() => { document.body.style.pointerEvents = ''; }, 100);
  };

  const doImport = async () => {
    setImporting(true);
    try {
      // Placeholder: hook to webhook when provided
      toast.success(`Đã gửi yêu cầu import tiền mặt từ sheet ${sheetName}, file ${fileName}`);
      onImported?.();
      reset();
      onClose();
    } catch (e: any) {
      console.error(e);
      toast.error('Import thất bại: ' + (e?.message || 'Lỗi không xác định'));
    } finally {
      setImporting(false);
      setConfirming(false);
      setTimeout(() => { document.body.style.pointerEvents = ''; }, 100);
    }
  };

  const canSubmit = fileName.trim() !== '' && sheetName.trim() !== '' && password !== '';

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => { if (!o && !confirming && !importing) handleClose(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Tiền Mặt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tên file</Label>
              <Input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Nhập tên file" />
            </div>
            <div className="space-y-2">
              <Label>Tên sheet</Label>
              <Input value={sheetName} onChange={(e) => setSheetName(e.target.value)} placeholder="Nhập tên sheet" />
            </div>
            <div className="space-y-2">
              <Label>Mật khẩu</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={importing}>Hủy</Button>
            <Button onClick={() => setConfirming(true)} disabled={!canSubmit || importing}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận import</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn import tiền mặt từ sheet <b>{sheetName}</b>, file <b>{fileName}</b> không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={importing}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={doImport} disabled={importing}>
              {importing ? 'Đang import...' : 'Xác nhận'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}