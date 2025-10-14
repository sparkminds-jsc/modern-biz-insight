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
import { useToast } from "@/hooks/use-toast";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
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
    filterCustomers();
  }, [customers, selectedCustomer, selectedVipLevel, selectedPotentialLevel]);

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

  const filterCustomers = () => {
    let filtered = [...customers];

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

      if (editingCustomer) {
        const { error } = await supabase
          .from("customers")
          .update(customerData)
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
          .insert([customerData as any])
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
