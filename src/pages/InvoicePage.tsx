
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '../components/layout/AppLayout';
import { InvoiceFilters } from '../components/invoice/InvoiceFilters';
import { InvoiceTable } from '../components/invoice/InvoiceTable';
import { InvoiceForm } from '../components/invoice/InvoiceForm';
import { InvoiceDetailDialog } from '../components/invoice/InvoiceDetailDialog';
import { supabase } from '../integrations/supabase/client';
import { Invoice, InvoiceItem, InvoiceFilters as InvoiceFiltersType, CreateInvoiceData, CreateInvoiceItemData } from '../types/invoice';
import { useToast } from '../hooks/use-toast';

const InvoicePage = () => {
  const [filters, setFilters] = useState<InvoiceFiltersType>({
    customer_name: '',
    invoice_name: '',
    status: '',
    payment_status: '',
    is_crypto: '',
    project_id: ''
  });
  
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedInvoiceItems, setSelectedInvoiceItems] = useState<InvoiceItem[]>([]);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch invoices
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices', filters],
    queryFn: async () => {
      let query = supabase.from('invoices').select('*').order('created_date', { ascending: false });

      if (filters.customer_name) {
        query = query.ilike('customer_name', `%${filters.customer_name}%`);
      }
      if (filters.invoice_name) {
        query = query.ilike('invoice_name', `%${filters.invoice_name}%`);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.payment_status) {
        query = query.eq('payment_status', filters.payment_status);
      }
      if (filters.is_crypto) {
        query = query.eq('is_crypto', filters.is_crypto === 'true');
      }
      if (filters.project_id) {
        query = query.eq('project_id', filters.project_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Invoice[];
    }
  });

  // Fetch invoice items for selected invoice
  const { data: invoiceItems = [] } = useQuery({
    queryKey: ['invoice-items', selectedInvoice?.id],
    queryFn: async () => {
      if (!selectedInvoice?.id) return [];
      const { data, error } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', selectedInvoice.id)
        .order('created_at');
      if (error) throw error;
      return data as InvoiceItem[];
    },
    enabled: !!selectedInvoice?.id
  });

  // Create invoice mutation
  const createInvoiceMutation = useMutation({
    mutationFn: async ({ invoiceData, items }: { invoiceData: CreateInvoiceData; items: CreateInvoiceItemData[] }) => {
      const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0);
      
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          ...invoiceData,
          total_amount: totalAmount
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      if (items.length > 0) {
        const invoiceItems = items.map(item => ({
          ...item,
          invoice_id: invoice.id,
          amount: item.qty * item.unit_price
        }));

        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(invoiceItems);

        if (itemsError) throw itemsError;
      }

      return invoice;
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Invoice đã được tạo thành công."
      });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setShowForm(false);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo invoice.",
        variant: "destructive"
      });
      console.error('Error creating invoice:', error);
    }
  });

  // Update invoice mutation
  const updateInvoiceMutation = useMutation({
    mutationFn: async ({ id, invoiceData, items }: { id: string; invoiceData: CreateInvoiceData; items: CreateInvoiceItemData[] }) => {
      const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0);
      
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .update({
          ...invoiceData,
          total_amount: totalAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Delete existing items
      const { error: deleteError } = await supabase
        .from('invoice_items')
        .delete()
        .eq('invoice_id', id);

      if (deleteError) throw deleteError;

      // Insert new items
      if (items.length > 0) {
        const invoiceItems = items.map(item => ({
          ...item,
          invoice_id: id,
          amount: item.qty * item.unit_price
        }));

        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(invoiceItems);

        if (itemsError) throw itemsError;
      }

      return invoice;
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Invoice đã được cập nhật thành công."
      });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-items'] });
      setShowForm(false);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật invoice.",
        variant: "destructive"
      });
      console.error('Error updating invoice:', error);
    }
  });

  // Delete invoice mutation
  const deleteInvoiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Invoice đã được xóa thành công."
      });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xóa invoice.",
        variant: "destructive"
      });
      console.error('Error deleting invoice:', error);
    }
  });

  const handleSearch = () => {
    queryClient.invalidateQueries({ queryKey: ['invoices'] });
  };

  const handleAddInvoice = () => {
    setSelectedInvoice(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleViewDetail = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetail(true);
  };

  const handleExportPDF = (invoice: Invoice) => {
    toast({
      title: "Thông báo",
      description: "Tính năng xuất PDF đang được phát triển."
    });
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa invoice này?')) {
      deleteInvoiceMutation.mutate(id);
    }
  };

  const handleFormSubmit = (invoiceData: CreateInvoiceData, items: CreateInvoiceItemData[]) => {
    if (formMode === 'create') {
      createInvoiceMutation.mutate({ invoiceData, items });
    } else if (selectedInvoice) {
      updateInvoiceMutation.mutate({ id: selectedInvoice.id, invoiceData, items });
    }
  };

  // Update selectedInvoiceItems when invoiceItems changes
  useEffect(() => {
    if (showDetail && invoiceItems) {
      setSelectedInvoiceItems(invoiceItems);
    }
  }, [invoiceItems, showDetail]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Invoice</h1>
          <p className="text-gray-600">Quản lý hóa đơn và thanh toán</p>
        </div>

        <InvoiceFilters
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          onAddInvoice={handleAddInvoice}
        />

        {isLoading ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <InvoiceTable
            invoices={invoices}
            onViewDetail={handleViewDetail}
            onExportPDF={handleExportPDF}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <InvoiceForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          invoice={selectedInvoice}
          invoiceItems={invoiceItems}
          mode={formMode}
        />

        <InvoiceDetailDialog
          open={showDetail}
          onClose={() => setShowDetail(false)}
          invoice={selectedInvoice}
          invoiceItems={selectedInvoiceItems}
        />
      </div>
    </AppLayout>
  );
};

export default InvoicePage;
