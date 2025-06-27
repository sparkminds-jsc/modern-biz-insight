import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SalaryDetail } from "@/types/salary";
import { SortableTableHeader } from "./SortableTableHeader";
import { SalaryTableRow } from "./SalaryTableRow";

interface SalaryDetailTableProps {
  salaryDetails: SalaryDetail[];
  onViewDetail: (detail: SalaryDetail) => void;
  onEdit: (detail: SalaryDetail) => void;
  onDelete: (detail: SalaryDetail) => void;
}

export function SalaryDetailTable({ salaryDetails, onViewDetail, onEdit, onDelete }: SalaryDetailTableProps) {
  if (!salaryDetails) {
    return <p>Không có dữ liệu lương.</p>;
  }

  if (salaryDetails.length === 0) {
    return <p>Không có dữ liệu lương.</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHeader>STT</SortableTableHeader>
              <SortableTableHeader>Mã NV</SortableTableHeader>
              <SortableTableHeader>Tên NV</SortableTableHeader>
              <SortableTableHeader>Team</SortableTableHeader>
              <SortableTableHeader>Loại lương</SortableTableHeader>
              <SortableTableHeader>Tháng</SortableTableHeader>
              <SortableTableHeader>Năm</SortableTableHeader>
              <SortableTableHeader>Lương Gross</SortableTableHeader>
              <SortableTableHeader>Ngày công</SortableTableHeader>
              <SortableTableHeader>Mức lương/Ngày</SortableTableHeader>
              <SortableTableHeader>Tiền lương theo ngày công</SortableTableHeader>
              <SortableTableHeader>Thưởng KPI</SortableTableHeader>
              <SortableTableHeader>Tăng ca 1.5</SortableTableHeader>
              <SortableTableHeader>Tăng ca 2</SortableTableHeader>
              <SortableTableHeader>Tăng ca 3</SortableTableHeader>
              <SortableTableHeader>Tổng thu nhập</SortableTableHeader>
              <SortableTableHeader>Mức đóng BH</SortableTableHeader>
              <SortableTableHeader>BHDN - BHXH</SortableTableHeader>
              <SortableTableHeader>BHDN - TNLĐ</SortableTableHeader>
              <SortableTableHeader>BHDN - BHYT</SortableTableHeader>
              <SortableTableHeader>BHDN - BHTN</SortableTableHeader>
              <SortableTableHeader>Tổng BHDN</SortableTableHeader>
              <SortableTableHeader>Tổng DN chi trả</SortableTableHeader>
              <SortableTableHeader>BHNLD - BHXH</SortableTableHeader>
              <SortableTableHeader>BHNLD - BHYT</SortableTableHeader>
              <SortableTableHeader>BHNLD - BHTN</SortableTableHeader>
              <SortableTableHeader>Tổng BHNLD</SortableTableHeader>
              <SortableTableHeader>Giảm trừ gia cảnh</SortableTableHeader>
              <SortableTableHeader>Số người phụ thuộc</SortableTableHeader>
              <SortableTableHeader>Giảm trừ người phụ thuộc</SortableTableHeader>
              <SortableTableHeader>Giảm trừ BH</SortableTableHeader>
              <SortableTableHeader>Tổng giảm trừ</SortableTableHeader>
              <SortableTableHeader>Thu nhập chịu thuế</SortableTableHeader>
              <SortableTableHeader>Thuế 5%</SortableTableHeader>
              <SortableTableHeader>Thuế 10%</SortableTableHeader>
              <SortableTableHeader>Thuế 15%</SortableTableHeader>
              <SortableTableHeader>Thuế 20%</SortableTableHeader>
              <SortableTableHeader>Thuế 25%</SortableTableHeader>
              <SortableTableHeader>Thuế 30%</SortableTableHeader>
              <SortableTableHeader>Thuế 35%</SortableTableHeader>
              <SortableTableHeader>Tổng thuế TNCN</SortableTableHeader>
              <SortableTableHeader>Lương Net</SortableTableHeader>
              <SortableTableHeader>Tạm Ứng</SortableTableHeader>
              <SortableTableHeader>Thực nhận</SortableTableHeader>
              <TableHead className="w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salaryDetails.map((detail, index) => (
              <SalaryTableRow
                key={detail.id}
                detail={detail}
                index={index}
                onViewDetail={onViewDetail}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
