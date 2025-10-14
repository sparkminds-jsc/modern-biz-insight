import { useState } from "react";
import { Customer } from "@/types/customer";
import { CustomerContact } from "@/types/customerContact";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
                  <TableCell>{customer.status}</TableCell>
                  <TableCell>{customer.vip_level}</TableCell>
                  <TableCell>{customer.potential_level}</TableCell>
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
                                    <TableCell className="max-w-xs truncate">{contact.contact_info || "-"}</TableCell>
                                    <TableCell>{formatLastContact(contact.last_contact_date)}</TableCell>
                                    <TableCell className="max-w-xs truncate">{contact.notes || "-"}</TableCell>
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
