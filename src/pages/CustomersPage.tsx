import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types/customer";
import { CustomerContact } from "@/types/customerContact";
import { Invoice } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";

interface CustomerWithCalculations extends Customer {
  calculated_revenue: number;
  calculated_debt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersWithCalculations, setCustomersWithCalculations] = useState<CustomerWithCalculations[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerWithCalculations[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingContacts, setEditingContacts] = useState<CustomerContact[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("all");
  const [selectedVipLevel, setSelectedVipLevel] = useState("all");
  const [selectedPotentialLevel, setSelectedPotentialLevel] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      calculateRevenueAndDebt();
    }
  }, [customers]);

  useEffect(() => {
    filterCustomers();
  }, [customersWithCalculations, selectedCustomer, selectedVipLevel, selectedPotentialLevel]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách khách hàng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateRevenueAndDebt = async () => {
    try {
      // Fetch all invoices
      const { data: invoices, error } = await supabase
        .from("invoices")
        .select("*");

      if (error) throw error;

      const customersWithCalc = customers.map((customer) => {
        const customerInvoices = (invoices || []).filter(
          (inv: Invoice) => inv.customer_name === customer.name
        );

        // Calculate revenue from invoices with "Đã thu đủ" or "Thu một phần"
        let totalRevenue = 0;
        customerInvoices.forEach((inv: Invoice) => {
          if (inv.payment_status === "Đã thu đủ" || inv.payment_status === "Thu một phần") {
            const paidAmount = inv.total_amount - inv.remaining_amount;
            if (inv.payment_unit === "VND") {
              totalRevenue += paidAmount;
            } else if (inv.payment_unit === "USD" && inv.vnd_exchange_rate) {
              totalRevenue += paidAmount * inv.vnd_exchange_rate;
            }
          }
        });

        // Calculate debt from invoices with "Chưa thu" or "Thu một phần"
        const debtByUnit: Record<string, number> = {};
        customerInvoices.forEach((inv: Invoice) => {
          if (inv.payment_status === "Chưa thu" || inv.payment_status === "Thu một phần") {
            if (inv.remaining_amount > 0) {
              const unit = inv.payment_unit;
              debtByUnit[unit] = (debtByUnit[unit] || 0) + inv.remaining_amount;
            }
          }
        });

        // Format debt display
        const debtParts: string[] = [];
        if (debtByUnit["VND"]) {
          debtParts.push(`${debtByUnit["VND"].toLocaleString("vi-VN")} VND`);
        }
        if (debtByUnit["USD"]) {
          debtParts.push(`${debtByUnit["USD"].toLocaleString("vi-VN")} USD`);
        }
        const calculatedDebt = debtParts.length > 0 ? debtParts.join(", ") : "0 VND";

        return {
          ...customer,
          calculated_revenue: totalRevenue,
          calculated_debt: calculatedDebt,
        };
      });

      setCustomersWithCalculations(customersWithCalc);
    } catch (error) {
      console.error("Error calculating revenue and debt:", error);
    }
  };

  const filterCustomers = () => {
    let filtered = [...customersWithCalculations];

    if (selectedCustomer !== "all") {
      filtered = filtered.filter((c) => c.id === selectedCustomer);
    }

    if (selectedVipLevel !== "all") {
      filtered = filtered.filter((c) => c.vip_level === selectedVipLevel);
    }

    if (selectedPotentialLevel !== "all") {
      filtered = filtered.filter((c) => c.potential_level === selectedPotentialLevel);
    }

    setFilteredCustomers(filtered);
  };

  const handleSubmit = async (customerData: Partial<Customer>, contacts: Partial<CustomerContact>[]) => {
    try {
      let customerId = editingCustomer?.id;

      // Remove calculated fields before saving
      const { calculated_revenue, calculated_debt, ...dataToSave } = customerData as any;

      if (editingCustomer) {
        const { error } = await supabase
          .from("customers")
          .update(dataToSave)
          .eq("id", editingCustomer.id);

        if (error) throw error;

        // Delete existing contacts and insert new ones
        await supabase
          .from("customer_contacts")
          .delete()
          .eq("customer_id", editingCustomer.id);

      } else {
        const { data, error } = await supabase
          .from("customers")
          .insert([dataToSave])
          .select()
          .single();

        if (error) throw error;
        customerId = data.id;
      }

      // Insert contacts
      if (contacts.length > 0 && customerId) {
        const contactsToInsert = contacts.map((contact) => ({
          ...contact,
          customer_id: customerId,
        }));

        const { error: contactError } = await supabase
          .from("customer_contacts")
          .insert(contactsToInsert as any);

        if (contactError) throw contactError;
      }

      toast({
        title: "Thành công",
        description: editingCustomer ? "Đã cập nhật thông tin khách hàng" : "Đã thêm khách hàng mới",
      });

      fetchCustomers();
      setFormOpen(false);
      setEditingCustomer(null);
      setEditingContacts([]);
    } catch (error) {
      console.error("Error saving customer:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin khách hàng",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (customer: Customer) => {
    setEditingCustomer(customer);
    
    // Fetch contacts for this customer
    try {
      const { data, error } = await supabase
        .from("customer_contacts")
        .select("*")
        .eq("customer_id", customer.id);
      
      if (error) throw error;
      setEditingContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
    
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setFormOpen(true);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6">Đang tải...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Quản lý Khách hàng</h1>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm khách hàng
          </Button>
        </div>

        <CustomerFilters
          selectedCustomer={selectedCustomer}
          selectedVipLevel={selectedVipLevel}
          selectedPotentialLevel={selectedPotentialLevel}
          customers={customers.map((c) => ({ id: c.id, name: c.name }))}
          onCustomerChange={setSelectedCustomer}
          onVipLevelChange={setSelectedVipLevel}
          onPotentialLevelChange={setSelectedPotentialLevel}
        />

        <CustomerTable data={filteredCustomers} onEdit={handleEdit} />

        <CustomerForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleSubmit}
          initialData={editingCustomer}
          initialContacts={editingContacts}
        />
      </div>
    </AppLayout>
  );
}
