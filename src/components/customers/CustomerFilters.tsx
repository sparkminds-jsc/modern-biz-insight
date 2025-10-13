import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VIP_LEVELS, POTENTIAL_LEVELS } from "@/types/customer";

interface CustomerFiltersProps {
  selectedCustomer: string;
  selectedVipLevel: string;
  selectedPotentialLevel: string;
  customers: Array<{ id: string; name: string }>;
  onCustomerChange: (value: string) => void;
  onVipLevelChange: (value: string) => void;
  onPotentialLevelChange: (value: string) => void;
}

export function CustomerFilters({
  selectedCustomer,
  selectedVipLevel,
  selectedPotentialLevel,
  customers,
  onCustomerChange,
  onVipLevelChange,
  onPotentialLevelChange,
}: CustomerFiltersProps) {
  return (
    <div className="flex gap-4 mb-6">
      <Select value={selectedCustomer} onValueChange={onCustomerChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Tất cả khách hàng" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả khách hàng</SelectItem>
          {customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedVipLevel} onValueChange={onVipLevelChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Cấp VIP" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả cấp VIP</SelectItem>
          {VIP_LEVELS.map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedPotentialLevel} onValueChange={onPotentialLevelChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Cấp Tiềm năng" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả cấp tiềm năng</SelectItem>
          {POTENTIAL_LEVELS.map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
