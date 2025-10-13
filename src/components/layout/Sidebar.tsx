
import { 
  BarChart3, 
  Users, 
  FileText, 
  Target, 
  DollarSign, 
  Receipt, 
  TrendingUp, 
  PieChart,
  FileBarChart,
  Menu,
  Home,
  FolderOpen,
  UserCog
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Quản lý nhân viên', path: '/employees' },
  { icon: FileText, label: 'Quản lý hợp đồng', path: '/contracts' },
  { icon: Target, label: 'Quản lý KPI', path: '/kpi' },
  { icon: DollarSign, label: 'Quản lý lương', path: '/salary' },
  { icon: Receipt, label: 'Quản lý Invoice', path: '/invoice' },
  { icon: TrendingUp, label: 'Quản lý doanh thu', path: '/revenue' },
  { icon: PieChart, label: 'Quản lý chi phí', path: '/expenses' },
  { icon: FileBarChart, label: 'Quản lý báo cáo', path: '/reports' },
  { icon: FolderOpen, label: 'Quản lý dự án', path: '/projects' },
  { icon: UserCog, label: 'Quản lý allocate', path: '/allocate' },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-xl z-50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isOpen && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HR Management
          </h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mx-2 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
              {isOpen && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
