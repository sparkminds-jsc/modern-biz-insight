import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Customer, CUSTOMER_TYPES, CUSTOMER_STATUSES, VIP_LEVELS, POTENTIAL_LEVELS } from "@/types/customer";

interface CustomerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (customer: Partial<Customer>) => void;
  initialData?: Customer | null;
}

export function CustomerForm({ open, onOpenChange, onSubmit, initialData }: CustomerFormProps) {
  const [formData, setFormData] = useState<Partial<Customer>>(
    initialData || {
      name: "",
      address: "",
      country: "",
      customer_type: "Cá nhân",
      status: "Chưa kết nối",
      vip_level: "Bỏ qua",
      potential_level: "Không đáng đầu tư",
      total_revenue: 0,
      total_debt: 0,
      notes: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Chỉnh sửa khách hàng" : "Thêm khách hàng"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tên khách hàng *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Quốc gia</Label>
              <Input
                id="country"
                value={formData.country || ""}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_type">Loại khách hàng</Label>
              <Select
                value={formData.customer_type}
                onValueChange={(value) => setFormData({ ...formData, customer_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOMER_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOMER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vip_level">Cấp Khách Hàng</Label>
              <Select
                value={formData.vip_level}
                onValueChange={(value) => setFormData({ ...formData, vip_level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VIP_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="potential_level">Cấp Tiềm Năng</Label>
              <Select
                value={formData.potential_level}
                onValueChange={(value) => setFormData({ ...formData, potential_level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POTENTIAL_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="last_contact_date">Lần liên hệ cuối</Label>
              <Input
                id="last_contact_date"
                type="date"
                value={formData.last_contact_date || ""}
                onChange={(e) => setFormData({ ...formData, last_contact_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="total_revenue">Tổng doanh thu (VND)</Label>
              <Input
                id="total_revenue"
                type="number"
                value={formData.total_revenue || 0}
                onChange={(e) => setFormData({ ...formData, total_revenue: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total_debt">Tổng nợ</Label>
              <Input
                id="total_debt"
                type="number"
                value={formData.total_debt || 0}
                onChange={(e) => setFormData({ ...formData, total_debt: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="first_project">Dự án đầu tiên</Label>
              <Input
                id="first_project"
                value={formData.first_project || ""}
                onChange={(e) => setFormData({ ...formData, first_project: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_project_start_date">Ngày bắt đầu dự án đầu</Label>
              <Input
                id="first_project_start_date"
                type="date"
                value={formData.first_project_start_date || ""}
                onChange={(e) => setFormData({ ...formData, first_project_start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="latest_project">Dự án gần nhất</Label>
              <Input
                id="latest_project"
                value={formData.latest_project || ""}
                onChange={(e) => setFormData({ ...formData, latest_project: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="latest_project_end_date">Ngày kết thúc dự án gần nhất</Label>
            <Input
              id="latest_project_end_date"
              type="date"
              value={formData.latest_project_end_date || ""}
              onChange={(e) => setFormData({ ...formData, latest_project_end_date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
