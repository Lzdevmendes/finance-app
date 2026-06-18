import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../contexts/FinanceContext';
import { useTransactionStats } from '../../hooks/useTransactionStats';
import { BalanceCard } from './components/BalanceCard';
import { ExpensesPieChart } from './components/ExpensesPieChart';
import { CategoryExpensesChart } from './components/CategoryExpensesChart';
import { TrendsChart } from './components/TrendsChart';
import { DailyEvolutionChart } from './components/DailyEvolutionChart';
import { RecentTransactions } from './components/RecentTransactions';

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function Dashboard() {
  const { transactions, preferences } = useFinance();
  const { darkMode } = preferences;
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  const { stats, chartData, categoryData, monthlyData, trendData } = useTransactionStats(selectedMonth, selectedYear);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    const currentYear = new Date().getFullYear();

    // Add years from 2020 to 2030
    for (let year = 2020; year <= 2030; year++) {
      years.add(year);
    }

    // Add current year and surrounding years if not already included
    for (let i = -2; i <= 2; i++) {
      years.add(currentYear + i);
    }

    // Add years from transactions
    transactions.forEach((t) => {
      years.add(new Date(t.date).getFullYear());
    });

    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <BalanceCard
        stats={stats}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        monthNames={monthNames}
        availableYears={availableYears}
      />

      {/* Charts Grid */}
      <div className="grid gap-4">
        <ExpensesPieChart chartData={chartData} darkMode={darkMode} />
        <CategoryExpensesChart categoryData={categoryData} darkMode={darkMode} />
        <TrendsChart trendData={trendData} darkMode={darkMode} />
        <DailyEvolutionChart
          monthlyData={monthlyData}
          darkMode={darkMode}
          monthNames={monthNames}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </div>

      <RecentTransactions transactions={transactions} darkMode={darkMode} />
    </motion.div>
  );
}
