import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/types/project';

interface ProjectTableProps {
  projects: Project[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang chạy':
        return 'bg-green-100 text-green-800';
      case 'Kết thúc':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">STT</TableHead>
          <TableHead>Tên dự án</TableHead>
          <TableHead>Thông tin dự án</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project, index) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{project.name}</TableCell>
            <TableCell>{project.description || '-'}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}