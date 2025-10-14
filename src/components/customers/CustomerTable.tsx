import { useState } from "react";
import { Customer } from "@/types/customer";
import { CustomerContact } from "@/types/customerContact";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/numberFormat";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CustomerWithCalculations extends Customer {
  calculated_revenue: number;
  calculated_debt: string;
}

interface CustomerTableProps {
  data: CustomerWithCalculations[];
  onEdit: (customer: Customer) => void;
}

export function CustomerTable({ data, onEdit }: CustomerTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [contacts, setContacts] = useState<Record<string, CustomerContact[]>>({});
  const { toast } = useToast();

  const toggleRow = async (customerId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(customerId)) {
      newExpanded.delete(customerId);
    } else {
      newExpanded.add(customerId);
      if (!contacts[customerId]) {
        await fetchContacts(customerId);
      }
    }
    setExpandedRows(newExpanded);
  };

  const fetchContacts = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from("customer_contacts")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts((prev) => ({ ...prev, [customerId]: data || [] }));
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách liên hệ",
        variant: "destructive",
      });
    }
  };

  const deleteContact = async (contactId: string, customerId: string) => {
    try {
      const { error } = await supabase
        .from("customer_contacts")
        .delete()
        .eq("id", contactId);

      if (error) throw error;

      await fetchContacts(customerId);
      toast({
        title: "Thành công",
        description: "Đã xóa liên hệ",
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa liên hệ",
        variant: "destructive",
      });
    }
  };

  const formatLastContact = (date?: string) => {
    if (!date) return "-";
    return format(new Date(date), "dd/MM/yyyy HH:mm");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chưa kết nối":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "Đã kết nối":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Đã kí HĐ":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Dự án đang dang dở":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Đã hoàn thành dự án đầu":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "Đã trở thành khách hàng thân thiết":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100";
      case "Đã là khách hàng VIP":
        return "bg-pink-100 text-pink-800 hover:bg-pink-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getVipLevelColor = (level: string) => {
    switch (level) {
      case "Bỏ qua":
        return "bg-gray-100 text-gray-600 hover:bg-gray-100";
      case "Ít chú ý cũng được":
        return "bg-slate-100 text-slate-700 hover:bg-slate-100";
      case "Cần chú ý nhiều 1 chút":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Cần chú ý kĩ càng":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "Cần phục vụ hết mình":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      case "Cần xem như thượng đế":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    }
  };

  const getPotentialLevelColor = (level: string) => {
    switch (level) {
      case "Không đáng đầu tư":
        return "bg-gray-100 text-gray-600 hover:bg-gray-100";
      case "Đầu tư nhỏ cũng được":
        return "bg-cyan-100 text-cyan-700 hover:bg-cyan-100";
      case "Đầu tư vừa":
        return "bg-teal-100 text-teal-700 hover:bg-teal-100";
      case "Đầu tư lớn":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "Đầu tư hết mình":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Tên khách hàng</TableHead>
            <TableHead>Địa chỉ</TableHead>
            <TableHead>Quốc gia</TableHead>
            <TableHead>Loại KH</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Cấp VIP</TableHead>
            <TableHead>Mức độ tiềm năng</TableHead>
            <TableHead>Tổng Doanh Thu</TableHead>
            <TableHead>Tổng nợ</TableHead>
            <TableHead>Dự án đầu</TableHead>
            <TableHead>Ngày bắt đầu</TableHead>
            <TableHead>Dự án cuối</TableHead>
            <TableHead>Ngày kết thúc</TableHead>
            <TableHead>Ghi chú</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={16} className="text-center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            data.map((customer) => (
              <>
                <TableRow key={customer.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell onClick={() => toggleRow(customer.id)}>
                    {expandedRows.has(customer.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </TableCell>
                  <TableCell onClick={() => toggleRow(customer.id)}>{customer.name}</TableCell>
                  <TableCell>{customer.address || "-"}</TableCell>
                  <TableCell>{customer.country || "-"}</TableCell>
                  <TableCell>{customer.customer_type}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getVipLevelColor(customer.vip_level)}>
                      {customer.vip_level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPotentialLevelColor(customer.potential_level)}>
                      {customer.potential_level}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(customer.calculated_revenue)}</TableCell>
                  <TableCell>{customer.calculated_debt}</TableCell>
                  <TableCell>{customer.first_project || "-"}</TableCell>
                  <TableCell>
                    {customer.first_project_start_date
                      ? format(new Date(customer.first_project_start_date), "dd/MM/yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>{customer.latest_project || "-"}</TableCell>
                  <TableCell>
                    {customer.latest_project_end_date
                      ? format(new Date(customer.latest_project_end_date), "dd/MM/yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{customer.notes || "-"}</TableCell>
                  <TableCell>
                    <Button onClick={() => onEdit(customer)} size="sm">
                      Chỉnh sửa
                    </Button>
                  </TableCell>
                </TableRow>
                
                {expandedRows.has(customer.id) && (
                  <TableRow>
                    <TableCell colSpan={16} className="bg-muted/30 p-0">
                      <div className="p-4">
                        <h3 className="font-semibold mb-3">Danh sách liên hệ</h3>
                        {contacts[customer.id]?.length > 0 ? (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Tên</TableHead>
                                  <TableHead>Chức vụ</TableHead>
                                  <TableHead>Thông tin liên hệ</TableHead>
                                  <TableHead>Lần liên hệ cuối</TableHead>
                                  <TableHead>Ghi chú</TableHead>
                                  <TableHead>Hành động</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {contacts[customer.id].map((contact) => (
                                  <TableRow key={contact.id}>
                                    <TableCell>{contact.name}</TableCell>
                                    <TableCell>{contact.position || "-"}</TableCell>
                                    <TableCell className="max-w-xs whitespace-pre-wrap">{contact.contact_info || "-"}</TableCell>
                                    <TableCell>{formatLastContact(contact.last_contact_date)}</TableCell>
                                    <TableCell className="max-w-xs whitespace-pre-wrap">{contact.notes || "-"}</TableCell>
                                    <TableCell>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteContact(contact.id, customer.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Chưa có liên hệ nào</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
