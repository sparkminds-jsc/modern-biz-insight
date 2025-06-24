
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginForm } from "./components/auth/LoginForm";
import { ForgotPasswordForm } from "./components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "./components/auth/ResetPasswordForm";
import { ProtectedRoute } from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import EmployeesPage from "./pages/EmployeesPage";
import ContractsPage from "./pages/ContractsPage";
import KPIPage from "./pages/KPIPage";
import SalaryPage from "./pages/SalaryPage";
import InvoicePage from "./pages/InvoicePage";
import RevenuePage from "./pages/RevenuePage";
import ExpensesPage from "./pages/ExpensesPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/employees" element={
            <ProtectedRoute>
              <EmployeesPage />
            </ProtectedRoute>
          } />
          <Route path="/contracts" element={
            <ProtectedRoute>
              <ContractsPage />
            </ProtectedRoute>
          } />
          <Route path="/kpi" element={
            <ProtectedRoute>
              <KPIPage />
            </ProtectedRoute>
          } />
          <Route path="/salary" element={
            <ProtectedRoute>
              <SalaryPage />
            </ProtectedRoute>
          } />
          <Route path="/invoice" element={
            <ProtectedRoute>
              <InvoicePage />
            </ProtectedRoute>
          } />
          <Route path="/revenue" element={
            <ProtectedRoute>
              <RevenuePage />
            </ProtectedRoute>
          } />
          <Route path="/expenses" element={
            <ProtectedRoute>
              <ExpensesPage />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
