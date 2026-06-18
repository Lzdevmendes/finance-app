// hooks/useFinanceLogic.ts - Hook otimizado para lógica de finanças
import { useMemo, useCallback } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Goal, GoalWithFeasibility, CategoryExpense } from '../types';

export function useFinanceLogic() {
  const {
    transactions,
    goals,
    preferences,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    updatePreferences
  } = useFinance();

  // Cálculos financeiros otimizados com useMemo
  const totalIncome = useMemo(() =>
    transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.value, 0),
    [transactions]
  );

  const totalExpenses = useMemo(() =>
    transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.value, 0),
    [transactions]
  );

  const balance = useMemo(() =>
    totalIncome - totalExpenses,
    [totalIncome, totalExpenses]
  );

  // Metas inteligentes com cálculo de viabilidade
  const goalFeasibility = useMemo((): GoalWithFeasibility[] => {
    if (balance <= 0) return [];

    return goals.map((goal: Goal): GoalWithFeasibility => {
      const monthlySavings = Math.max(0, balance * 0.2); // 20% para poupança
      const remainingAmount = goal.targetAmount - goal.currentAmount;
      const monthsNeeded = monthlySavings > 0
        ? Math.max(1, Math.ceil(remainingAmount / monthlySavings))
        : Infinity;

      return {
        ...goal,
        monthlySavings,
        monthsNeeded,
        isFeasible: monthsNeeded <= 12 && remainingAmount > 0, // Viável se <= 1 ano
      };
    });
  }, [goals, balance]);

  // Transações por categoria (apenas despesas)
  const expensesByCategory = useMemo((): CategoryExpense[] => {
    const categoryTotals: Record<string, number> = {};

    transactions
      .filter(transaction => transaction.type === 'expense')
      .forEach(transaction => {
        const categoryKey = transaction.category;
        categoryTotals[categoryKey] = (categoryTotals[categoryKey] || 0) + transaction.value;
      });

    return Object.entries(categoryTotals)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Dados para gráficos mensais
  const monthlyData = useMemo(() => {
    const monthsMap: Record<string, { receitas: number; despesas: number }> = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = { receitas: 0, despesas: 0 };
      }

      if (transaction.type === 'income') {
        monthsMap[monthKey].receitas += transaction.value;
      } else {
        monthsMap[monthKey].despesas += transaction.value;
      }
    });

    return Object.entries(monthsMap)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Últimos 6 meses
  }, [transactions]);

  // Dados para gráfico de pizza (top categorias)
  const chartData = useMemo(() =>
    expensesByCategory.slice(0, 5).map(item => ({
      name: item.category,
      value: item.value,
    })),
    [expensesByCategory]
  );

  // Callbacks otimizados para evitar re-renders desnecessários
  const handleAddTransaction = useCallback(async (transactionData: any) => {
    await addTransaction(transactionData);
  }, [addTransaction]);

  const handleUpdateTransaction = useCallback(async (id: string, updates: any) => {
    await updateTransaction(id, updates);
  }, [updateTransaction]);

  const handleDeleteTransaction = useCallback(async (id: string) => {
    await deleteTransaction(id);
  }, [deleteTransaction]);

  const handleAddGoal = useCallback(async (goalData: any) => {
    await addGoal(goalData);
  }, [addGoal]);

  const handleUpdateGoal = useCallback(async (id: string, updates: any) => {
    await updateGoal(id, updates);
  }, [updateGoal]);

  const handleDeleteGoal = useCallback(async (id: string) => {
    await deleteGoal(id);
  }, [deleteGoal]);

  const handleUpdatePreferences = useCallback(async (updates: any) => {
    await updatePreferences(updates);
  }, [updatePreferences]);

  return {
    // Dados
    transactions,
    goals,
    preferences,

    // Cálculos
    totalIncome,
    totalExpenses,
    balance,
    goalFeasibility,
    expensesByCategory,
    monthlyData,
    chartData,

    // Ações
    addTransaction: handleAddTransaction,
    updateTransaction: handleUpdateTransaction,
    deleteTransaction: handleDeleteTransaction,
    addGoal: handleAddGoal,
    updateGoal: handleUpdateGoal,
    deleteGoal: handleDeleteGoal,
    updatePreferences: handleUpdatePreferences,
  };
}