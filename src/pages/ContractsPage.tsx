
import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { ContractFilters } from '../components/contracts/ContractFilters';
import { ContractTable } from '../components/contracts/ContractTable';
import { ContractForm } from '../components/contracts/ContractForm';
import { Contract, ContractSortConfig, ContractFilters as ContractFiltersType, ContractFile } from '@/types/contract';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const ContractsPage = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ContractFiltersType>({
    customer_name: '',
    auto_renewal: 'all'
  });
  const [sortConfig, setSortConfig] = useState<ContractSortConfig>({
    key: null,
    direction: 'asc'
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [contracts, filters]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convert contract_files from JSON to ContractFile[] and handle null values
      const contractsData: Contract[] = (data || []).map(contract => ({
        ...contract,
        auto_renewal: contract.auto_renewal ?? false,
        contract_files: Array.isArray(contract.contract_files) 
          ? (contract.contract_files as ContractFile[])
          : []
      }));
      
      setContracts(contractsData);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách hợp đồng',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = [...contracts];

    if (filters.customer_name) {
      filtered = filtered.filter(contract =>
        contract.customer_name.toLowerCase().includes(filters.customer_name.toLowerCase())
      );
    }

    if (filters.auto_renewal && filters.auto_renewal !== 'all') {
      const autoRenewal = filters.auto_renewal === 'true';
      filtered = filtered.filter(contract => contract.auto_renewal === autoRenewal);
    }

    setFilteredContracts(filtered);
  };

  const handleSort = (key: keyof Contract) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedContracts = [...filteredContracts].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredContracts(sortedContracts);
    setSortConfig({ key, direction });
  };

  const handleAddContract = () => {
    setSelectedContract(null);
    setShowForm(true);
  };

  const handleEditContract = (contract: Contract) => {
    setSelectedContract(contract);
    setShowForm(true);
  };

  const handleDownloadFile = (file: ContractFile) => {
    window.open(file.url, '_blank');
  };

  const handleFormSave = () => {
    fetchContracts();
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý hợp đồng</h1>
            <p className="text-gray-600">Quản lý hợp đồng lao động</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý hợp đồng</h1>
          <p className="text-gray-600">Quản lý hợp đồng lao động</p>
        </div>

        <ContractFilters
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          onAddContract={handleAddContract}
        />

        <ContractTable
          contracts={filteredContracts}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEditContract}
          onDownloadFile={handleDownloadFile}
        />

        <ContractForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          contract={selectedContract}
          onSave={handleFormSave}
        />
      </div>
    </AppLayout>
  );
};

export default ContractsPage;
