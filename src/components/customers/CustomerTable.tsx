import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Customer } from "@/types/customer";
import { formatCurrency } from "@/utils/numberFormat";

interface CustomerTableProps {
  data: Customer[];
  onEdit: (customer: Customer) => void;
}

export function CustomerTable({ data, onEdit }: CustomerTableProps) {
  const formatLastContact = (date?: string) => {
    if (!date) return "-";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
    } catch {
      return "-";
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">STT</TableHead>
            <TableHead>Tên khách hàng</TableHead>
            <TableHead>Địa chỉ</TableHead>
            <TableHead>Quốc gia</TableHead>
            <TableHead>Loại KH</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Cấp KH</TableHead>
            <TableHead>Cấp Tiềm năng</TableHead>
            <TableHead>Liên hệ cuối</TableHead>
            <TableHead className="text-right">Tổng DT</TableHead>
            <TableHead className="text-right">Tổng nợ</TableHead>
            <TableHead>Dự án đầu</TableHead>
            <TableHead>Ngày bắt đầu</TableHead>
            <TableHead>Dự án gần nhất</TableHead>
            <TableHead>Ngày KT</TableHead>
            <TableHead>Ghi chú</TableHead>
            <TableHead className="w-24">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={17} className="text-center text-muted-foreground">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            data.map((customer, index) => (
              <TableRow key={customer.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.address || "-"}</TableCell>
                <TableCell>{customer.country || "-"}</TableCell>
                <TableCell>{customer.customer_type}</TableCell>
                <TableCell>{customer.status}</TableCell>
                <TableCell>{customer.vip_level}</TableCell>
                <TableCell>{customer.potential_level}</TableCell>
                <TableCell>{formatLastContact(customer.last_contact_date)}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(customer.total_revenue)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(customer.total_debt)}
                </TableCell>
                <TableCell>{customer.first_project || "-"}</TableCell>
                <TableCell>
                  {customer.first_project_start_date
                    ? new Date(customer.first_project_start_date).toLocaleDateString("vi-VN")
                    : "-"}
                </TableCell>
                <TableCell>{customer.latest_project || "-"}</TableCell>
                <TableCell>
                  {customer.latest_project_end_date
                    ? new Date(customer.latest_project_end_date).toLocaleDateString("vi-VN")
                    : "-"}
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={customer.notes}>
                  {customer.notes || "-"}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(customer)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
