import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../contexts/FinanceContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTransactionStats } from '../../hooks/useTransactionStats';
import { getUserName } from '../../utils/user';
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

function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function Dashboard() {
  const { transactions, preferences } = useFinance();
  const { user } = useAuth();
  const { darkMode } = preferences;
  const firstName = getUserName(user).split(' ')[0];
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
      className="px-[22px] pb-28 pt-2 space-y-5"
    >
      <div className="py-3.5 pb-1">
        <div className="text-[13.5px]" style={{ color: 'var(--muted)' }}>
          {greeting()},
        </div>
        <h1 className="text-[25px] font-extrabold tracking-[-0.02em] leading-tight truncate">
          {firstName}
        </h1>
      </div>

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
