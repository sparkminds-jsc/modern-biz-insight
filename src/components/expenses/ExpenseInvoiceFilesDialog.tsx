import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ExpenseInvoiceFile {
  name: string;
  path?: string;
  url?: string;
  size?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  expense: any;
  onSaved?: () => void;
}

const BUCKET = 'expense-invoices';

export function ExpenseInvoiceFilesDialog({ open, onClose, expense, onSaved }: Props) {
  const [files, setFiles] = useState<ExpenseInvoiceFile[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setFiles(Array.isArray(expense?.invoice_files) ? (expense.invoice_files as ExpenseInvoiceFile[]) : []);
    }
  }, [open, expense]);

  const persist = async (next: ExpenseInvoiceFile[]) => {
    const { error } = await supabase
      .from('expenses')
      .update({ invoice_files: next as any })
      .eq('id', expense.id);
    if (error) throw error;
    setFiles(next);
    onSaved?.();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    e.target.value = '';
    if (selected.length === 0) return;

    setUploading(true);
    try {
      const uploaded: ExpenseInvoiceFile[] = [];
      for (const file of selected) {
        const safeName = file.name.replace(/[^\w.\-]+/g, '_');
        const path = `${expense.id}/${Date.now()}_${safeName}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
        if (error) throw error;
        uploaded.push({ name: file.name, path, size: file.size });
      }
      await persist([...files, ...uploaded]);
      toast.success(`Đã upload ${uploaded.length} file`);
    } catch (err) {
      console.error(err);
      toast.error('Không thể upload file hóa đơn');
    } finally {
      setUploading(false);
    }
  };

  const handleOpenFile = async (file: ExpenseInvoiceFile) => {
    try {
      if (file.path) {
        const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(file.path, 3600);
        if (error) throw error;
        window.open(data.signedUrl, '_blank');
      } else if (file.url) {
        window.open(file.url, '_blank');
      }
    } catch (err) {
      console.error(err);
      toast.error('Không thể mở file');
    }
  };

  const handleDelete = async (file: ExpenseInvoiceFile) => {
    if (!window.confirm(`Xóa file "${file.name}"?`)) return;
    try {
      if (file.path) {
        await supabase.storage.from(BUCKET).remove([file.path]);
      }
      await persist(files.filter(f => f !== file));
      toast.success('Đã xóa file');
    } catch (err) {
      console.error(err);
      toast.error('Không thể xóa file');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Hóa đơn chi phí</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <input
              id="expense-invoice-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
            <Button asChild disabled={uploading} variant="outline">
              <label htmlFor="expense-invoice-upload" className="cursor-pointer">
                {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                {uploading ? 'Đang upload...' : 'Upload file'}
              </label>
            </Button>
          </div>

          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có file hóa đơn nào.</p>
          ) : (
            <ul className="space-y-2 max-h-72 overflow-y-auto">
              {files.map((file, i) => (
                <li key={`${file.path || file.url || file.name}-${i}`} className="flex items-center justify-between gap-2 rounded-lg border p-2">
                  <button
                    type="button"
                    onClick={() => handleOpenFile(file)}
                    className="flex min-w-0 items-center gap-2 text-left text-sm text-primary hover:underline"
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(file)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
