
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import RevenuePage from './pages/RevenuePage';
import ExpensesPage from './pages/ExpensesPage';
import ReportsPage from './pages/ReportsPage';
import SalaryPage from './pages/SalaryPage';
import SalaryDetailPage from './pages/SalaryDetailPage';
import InvoicePage from './pages/InvoicePage';
import ContractsPage from './pages/ContractsPage';
import KPIPage from './pages/KPIPage';
import KPIDetailPage from './pages/KPIDetailPage';
import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute';
import TeamReportDetailPage from './pages/TeamReportDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
        <Route path="/revenue" element={<ProtectedRoute><RevenuePage /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/reports/team/:teamReportId" element={<ProtectedRoute><TeamReportDetailPage /></ProtectedRoute>} />
        <Route path="/salary" element={<ProtectedRoute><SalaryPage /></ProtectedRoute>} />
        <Route path="/salary/:salarySheetId" element={<ProtectedRoute><SalaryDetailPage /></ProtectedRoute>} />
        <Route path="/invoice" element={<ProtectedRoute><InvoicePage /></ProtectedRoute>} />
        <Route path="/contracts" element={<ProtectedRoute><ContractsPage /></ProtectedRoute>} />
        <Route path="/kpi" element={<ProtectedRoute><KPIPage /></ProtectedRoute>} />
        <Route path="/kpi/detail/:year/:month" element={<ProtectedRoute><KPIDetailPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
