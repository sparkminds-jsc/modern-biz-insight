
import { useState, useEffect } from 'react';
import { X, Upload, Download, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Contract, ContractFile } from '@/types/contract';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Customer } from '@/types/customer';

interface ContractFormProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
  onSave: () => void;
}

export function ContractForm({ isOpen, onClose, contract, onSave }: ContractFormProps) {
  // Fetch customers
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Customer[];
    }
  });

  const [formData, setFormData] = useState({
    contract_code: '',
    contract_name: '',
    customer_name: '',
    sign_date: '',
    expire_date: '',
    auto_renewal: false,
    status: 'Đang còn'
  });
  const [files, setFiles] = useState<ContractFile[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (contract) {
      setFormData({
        contract_code: contract.contract_code,
        contract_name: contract.contract_name,
        customer_name: contract.customer_name,
        sign_date: contract.sign_date,
        expire_date: contract.expire_date,
        auto_renewal: contract.auto_renewal,
        status: contract.status
      });
      setFiles(contract.contract_files || []);
    } else {
      setFormData({
        contract_code: '',
        contract_name: '',
        customer_name: '',
        sign_date: '',
        expire_date: '',
        auto_renewal: false,
        status: 'Đang còn'
      });
      setFiles([]);
    }
  }, [contract]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    setUploading(true);
    const newFiles: ContractFile[] = [];

    for (const file of Array.from(uploadedFiles)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('contracts')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('contracts')
          .getPublicUrl(fileName);

        newFiles.push({
          id: fileName,
          name: file.name,
          url: urlData.publicUrl,
          size: file.size
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          title: 'Lỗi',
          description: `Không thể upload file ${file.name}`,
          variant: 'destructive',
        });
      }
    }

    setFiles(prev => [...prev, ...newFiles]);
    setUploading(false);
  };

  const handleRemoveFile = async (fileToRemove: ContractFile) => {
    try {
      const { error } = await supabase.storage
        .from('contracts')
        .remove([fileToRemove.id]);

      if (error) throw error;

      setFiles(prev => prev.filter(f => f.id !== fileToRemove.id));
      toast({
        title: 'Thành công',
        description: 'Đã xóa file thành công',
      });
    } catch (error) {
      console.error('Error removing file:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa file',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadFile = (file: ContractFile) => {
    window.open(file.url, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const contractData = {
        ...formData,
        contract_files: files as any, // Convert to JSON for database
        updated_at: new Date().toISOString()
      };

      if (contract) {
        const { error } = await supabase
          .from('contracts')
          .update(contractData)
          .eq('id', contract.id);

        if (error) throw error;
        
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật hợp đồng thành công',
        });
      } else {
        const { error } = await supabase
          .from('contracts')
          .insert([contractData]);

        if (error) throw error;
        
        toast({
          title: 'Thành công',
          description: 'Đã thêm hợp đồng thành công',
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving contract:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu hợp đồng',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {contract ? 'Chỉnh sửa hợp đồng' : 'Thêm hợp đồng mới'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã hợp đồng *
              </label>
              <Input
                required
                value={formData.contract_code}
                onChange={(e) => setFormData({...formData, contract_code: e.target.value})}
                placeholder="Nhập mã hợp đồng"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên hợp đồng *
              </label>
              <Input
                required
                value={formData.contract_name}
                onChange={(e) => setFormData({...formData, contract_name: e.target.value})}
                placeholder="Nhập tên hợp đồng"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên khách hàng *
            </label>
            <Select
              required
              value={formData.customer_name}
              onValueChange={(value) => setFormData({...formData, customer_name: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.name}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày kí *
              </label>
              <Input
                type="date"
                required
                value={formData.sign_date}
                onChange={(e) => setFormData({...formData, sign_date: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày hết hạn *
              </label>
              <Input
                type="date"
                required
                value={formData.expire_date}
                onChange={(e) => setFormData({...formData, expire_date: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tự động gia hạn
              </label>
              <Select
                value={formData.auto_renewal.toString()}
                onValueChange={(value) => setFormData({...formData, auto_renewal: value === 'true'})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Không</SelectItem>
                  <SelectItem value="true">Có</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đang còn">Đang còn</SelectItem>
                  <SelectItem value="Đã kết thúc">Đã kết thúc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link hợp đồng
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {uploading ? 'Đang upload...' : 'Click để upload file hợp đồng'}
                </span>
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Files đã upload:</h4>
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadFile(file)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(file)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {contract ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
