
import { useState } from 'react';

export const useRevenueExpenseOperations = () => {
  const [selectedRevenue, setSelectedRevenue] = useState<any>(null);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [showRevenueDetail, setShowRevenueDetail] = useState(false);
  const [showExpenseDetail, setShowExpenseDetail] = useState(false);

  const handleViewRevenue = (revenue: any) => {
    setSelectedRevenue(revenue);
    setShowRevenueDetail(true);
  };

  const handleViewExpense = (expense: any) => {
    setSelectedExpense(expense);
    setShowExpenseDetail(true);
  };

  return {
    selectedRevenue,
    selectedExpense,
    showRevenueDetail,
    showExpenseDetail,
    setShowRevenueDetail,
    setShowExpenseDetail,
    handleViewRevenue,
    handleViewExpense
  };
};
