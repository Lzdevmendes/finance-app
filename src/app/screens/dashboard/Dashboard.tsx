// src/app/screens/Dashboard.tsx
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpCircle, ArrowDownCircle, PieChart as PieChartIcon, TrendingUp, BarChart3 } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { useFinance } from '../../contexts/FinanceContext';
import { CategoryIcon } from '../../components/CategoryIcon';
import { useTransactionStats } from '../../hooks/useTransactionStats';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f97316', '#ef4444'];

const categories = [
  { value: 'alimentacao', label: 'Alimentação', icon: '🍽️' },
  { value: 'transporte', label: 'Transporte', icon: '🚗' },
  { value: 'lazer', label: 'Lazer', icon: '🎮' },
  { value: 'saude', label: 'Saúde', icon: '🏥' },
  { value: 'educacao', label: 'Educação', icon: '📚' },
  { value: 'outros', label: 'Outros', icon: '📦' },
];

export function Dashboard() {
  const { transactions, preferences } = useFinance();
  const { darkMode } = preferences;
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return now.getMonth() + 1;
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    const now = new Date();
    return now.getFullYear();
  });

  const { stats, chartData, categoryData, monthlyData, trendData } = useTransactionStats(selectedMonth, selectedYear);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

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
      const date = new Date(t.date);
      years.add(date.getFullYear());
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
      {/* Balance Card */}
      <div
        className="bg-gradient-to-br theme-gradient p-6 rounded-[2rem] text-white shadow-xl space-y-4"
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm opacity-90">Saldo do Mês</span>
            <h3 className="text-3xl font-bold mt-1">
              R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="flex gap-2 mr-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-2 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {monthNames.map((month, index) => (
                <option key={index + 1} value={index + 1} className="text-gray-900">
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-2 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {availableYears.map((year) => (
                <option key={year} value={year} className="text-gray-900">
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpCircle size={18} />
              <span className="text-xs opacity-90">Receitas</span>
            </div>
            <span className="font-bold text-lg">
              R$ {stats.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <div className="text-xs opacity-75 mt-1">
              {stats.incomeCount} transações
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownCircle size={18} />
              <span className="text-xs opacity-90">Despesas</span>
            </div>
            <span className="font-bold text-lg">
              R$ {stats.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <div className="text-xs opacity-75 mt-1">
              {stats.expenseCount} transações
            </div>
          </div>
        </div>

        {/* Estatísticas Premium */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl text-center">
            <div className="text-xs opacity-80 mb-1">Total</div>
            <div className="font-bold text-sm">
              {stats.transactionCount}
            </div>
            <div className="text-xs opacity-60">Transações</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl text-center">
            <div className="text-xs opacity-80 mb-1">Média</div>
            <div className="font-bold text-sm">
              R$ {stats.averageTransaction.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
            <div className="text-xs opacity-60">por transação</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl text-center">
            <div className="text-xs opacity-80 mb-1">Maior</div>
            <div className="font-bold text-sm">
              R$ {Math.max(stats.largestIncome, stats.largestExpense).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
            <div className="text-xs opacity-60">valor</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4">
        {/* Pie Chart - Top Categories */}
        {chartData.length > 0 && (
          <div
            className={`relative overflow-hidden ${
              darkMode
                ? 'bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900'
                : 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
            } p-6 rounded-3xl shadow-2xl border ${
              darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            } backdrop-blur-sm`}
            style={{
              background: darkMode
                ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
              boxShadow: darkMode
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.8)',
            }}
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-2xl translate-y-12 -translate-x-12" />

            <div className="relative z-10">
              <h4 className="font-bold mb-6 flex items-center gap-3 text-lg">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                  <PieChartIcon size={20} className="text-white" />
                </div>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                  Principais Despesas
                </span>
              </h4>

              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <filter id="pieGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.1)"/>
                      </filter>
                    </defs>
                    <Pie
                      data={chartData}
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={4}
                      dataKey="value"
                      animationBegin={300}
                      animationDuration={1200}
                      animationEasing="ease-out"
                      label={({ name, percent }) =>
                        percent > 0.08 ? `${name}\n${(percent * 100).toFixed(0)}%` : ''
                      }
                      labelLine={false}
                      style={{ filter: 'url(#pieGlow) url(#pieShadow)' }}
                    >
                      {chartData.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'}
                          strokeWidth={3}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      }
                      contentStyle={{
                        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '20px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        fontSize: '14px',
                        fontWeight: '600',
                        backdropFilter: 'blur(20px)',
                        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                      }}
                      labelStyle={{
                        color: darkMode ? '#F9FAFB' : '#111827',
                        fontWeight: '700',
                        marginBottom: '4px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {chartData.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {chartData.map((entry, index) => (
                    <motion.div
                      key={entry.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        darkMode ? 'bg-gray-700/50' : 'bg-white/60'
                      } backdrop-blur-sm border ${
                        darkMode ? 'border-gray-600/50' : 'border-gray-200/50'
                      } shadow-sm hover:shadow-md transition-all duration-300`}
                    >
                      <div
                        className="w-4 h-4 rounded-full shadow-lg ring-2 ring-white/20"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                          boxShadow: `0 0 20px ${COLORS[index % COLORS.length]}40`
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-medium truncate block ${
                          darkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {entry.name}
                        </span>
                        <span className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Expenses Chart */}
        {categoryData.length > 0 && (
          <div
            className={`relative overflow-hidden ${
              darkMode
                ? 'bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900'
                : 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
            } p-6 rounded-3xl shadow-2xl border ${
              darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            } backdrop-blur-sm`}
            style={{
              background: darkMode
                ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
              boxShadow: darkMode
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.8)',
            }}
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/10 to-red-400/10 rounded-full blur-2xl translate-y-12 -translate-x-12" />

            <div className="relative z-10">
              <h4 className="font-bold mb-6 flex items-center gap-3 text-lg">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <BarChart3 size={20} className="text-white" />
                </div>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                  Despesas por Categoria
                </span>
              </h4>

              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      </linearGradient>
                      <filter id="barGlow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.1)"/>
                      </filter>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={darkMode ? 'rgba(156, 163, 175, 0.2)' : 'rgba(107, 114, 128, 0.2)'}
                      strokeWidth={1}
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 12, fill: darkMode ? '#9CA3AF' : '#6B7280', fontWeight: '600' }}
                      axisLine={false}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tickFormatter={(value) => {
                        const category = categories.find(c => c.value === value);
                        return category ? category.label : value;
                      }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: darkMode ? '#9CA3AF' : '#6B7280', fontWeight: '600' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                      tickMargin={8}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                        'Valor'
                      ]}
                      labelFormatter={(label) => {
                        const category = categories.find(c => c.value === label);
                        return category ? category.label : label;
                      }}
                      contentStyle={{
                        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '20px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        fontSize: '14px',
                        fontWeight: '600',
                        backdropFilter: 'blur(20px)',
                        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                      }}
                      labelStyle={{
                        color: darkMode ? '#F9FAFB' : '#111827',
                        fontWeight: '700',
                        marginBottom: '4px'
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#barGradient)"
                      radius={[8, 8, 0, 0]}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      style={{ filter: 'url(#barGlow) url(#barShadow)' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {categoryData.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {categoryData.slice(0, 4).map((item, index) => (
                    <motion.div
                      key={item.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        darkMode ? 'bg-gray-700/50' : 'bg-white/60'
                      } backdrop-blur-sm border ${
                        darkMode ? 'border-gray-600/50' : 'border-gray-200/50'
                      } shadow-sm hover:shadow-md transition-all duration-300`}
                    >
                      <div
                        className="w-4 h-4 rounded-full shadow-lg ring-2 ring-white/20"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                          boxShadow: `0 0 20px ${COLORS[index % COLORS.length]}40`
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-medium truncate block ${
                          darkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {categories.find(c => c.value === item.category)?.label || item.category}
                        </span>
                        <span className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {item.percentage.toFixed(1)}% • R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Monthly Trends Chart */}
        {trendData.length > 0 && (
          <div
            className={`relative overflow-hidden ${
              darkMode
                ? 'bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900'
                : 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
            } p-6 rounded-3xl shadow-2xl border ${
              darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            } backdrop-blur-sm`}
            style={{
              background: darkMode
                ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)',
              boxShadow: darkMode
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.8)',
            }}
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-400/8 to-purple-400/8 rounded-full blur-3xl -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-400/8 to-blue-400/8 rounded-full blur-3xl translate-y-16 -translate-x-16" />

            <div className="relative z-10">
              <h4 className="font-bold mb-6 flex items-center gap-3 text-lg">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                  Tendências dos Últimos 6 Meses
                </span>
              </h4>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="trendIncomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="30%" stopColor="#06b6d4" stopOpacity={0.2}/>
                        <stop offset="70%" stopColor="#06b6d4" stopOpacity={0.1}/>
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02}/>
                      </linearGradient>
                      <linearGradient id="trendExpenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        <stop offset="30%" stopColor="#f59e0b" stopOpacity={0.2}/>
                        <stop offset="70%" stopColor="#f59e0b" stopOpacity={0.1}/>
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02}/>
                      </linearGradient>
                      <linearGradient id="trendBalanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="30%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="70%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.02}/>
                      </linearGradient>
                      <filter id="trendGlow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="trendShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="rgba(0,0,0,0.15)"/>
                      </filter>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={darkMode ? 'rgba(156, 163, 175, 0.2)' : 'rgba(107, 114, 128, 0.2)'}
                      strokeWidth={1}
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: darkMode ? '#9CA3AF' : '#6B7280', fontWeight: '600' }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                      tickMargin={12}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: darkMode ? '#9CA3AF' : '#6B7280', fontWeight: '600' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                      tickMargin={8}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                        name === 'income' ? 'Receitas' : name === 'expenses' ? 'Despesas' : 'Saldo'
                      ]}
                      labelFormatter={(label) => `Mês: ${label}`}
                      contentStyle={{
                        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '20px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        fontSize: '14px',
                        fontWeight: '600',
                        backdropFilter: 'blur(20px)',
                        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                      }}
                      labelStyle={{
                        color: darkMode ? '#F9FAFB' : '#111827',
                        fontWeight: '700',
                        marginBottom: '4px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#06b6d4"
                      fillOpacity={1}
                      fill="url(#trendIncomeGradient)"
                      strokeWidth={3}
                      dot={{
                        fill: '#06b6d4',
                        strokeWidth: 2,
                        r: 5,
                        filter: 'url(#trendGlow)',
                        stroke: darkMode ? '#1F2937' : '#ffffff'
                      }}
                      activeDot={{
                        r: 7,
                        stroke: '#06b6d4',
                        strokeWidth: 3,
                        filter: 'url(#trendGlow)',
                        fill: darkMode ? '#1F2937' : '#ffffff'
                      }}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      style={{ filter: 'url(#trendShadow)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#f59e0b"
                      fillOpacity={1}
                      fill="url(#trendExpenseGradient)"
                      strokeWidth={3}
                      dot={{
                        fill: '#f59e0b',
                        strokeWidth: 2,
                        r: 5,
                        filter: 'url(#trendGlow)',
                        stroke: darkMode ? '#1F2937' : '#ffffff'
                      }}
                      activeDot={{
                        r: 7,
                        stroke: '#f59e0b',
                        strokeWidth: 3,
                        filter: 'url(#trendGlow)',
                        fill: darkMode ? '#1F2937' : '#ffffff'
                      }}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      animationBegin={300}
                      style={{ filter: 'url(#trendShadow)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#trendBalanceGradient)"
                      strokeWidth={3}
                      dot={{
                        fill: '#10b981',
                        strokeWidth: 2,
                        r: 5,
                        filter: 'url(#trendGlow)',
                        stroke: darkMode ? '#1F2937' : '#ffffff'
                      }}
                      activeDot={{
                        r: 7,
                        stroke: '#10b981',
                        strokeWidth: 3,
                        filter: 'url(#trendGlow)',
                        fill: darkMode ? '#1F2937' : '#ffffff'
                      }}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      animationBegin={600}
                      style={{ filter: 'url(#trendShadow)' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Trend Summary */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className={`p-3 rounded-xl text-center ${
                  darkMode ? 'bg-gray-700/50' : 'bg-white/60'
                } backdrop-blur-sm border ${
                  darkMode ? 'border-gray-600/50' : 'border-gray-200/50'
                }`}>
                  <div className="text-xs opacity-80 mb-1">Receitas</div>
                  <div className="font-bold text-sm text-cyan-500">
                    R$ {trendData.reduce((acc, item) => acc + item.income, 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs opacity-60">6 meses</div>
                </div>
                <div className={`p-3 rounded-xl text-center ${
                  darkMode ? 'bg-gray-700/50' : 'bg-white/60'
                } backdrop-blur-sm border ${
                  darkMode ? 'border-gray-600/50' : 'border-gray-200/50'
                }`}>
                  <div className="text-xs opacity-80 mb-1">Despesas</div>
                  <div className="font-bold text-sm text-amber-500">
                    R$ {trendData.reduce((acc, item) => acc + item.expenses, 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs opacity-60">6 meses</div>
                </div>
                <div className={`p-3 rounded-xl text-center ${
                  darkMode ? 'bg-gray-700/50' : 'bg-white/60'
                } backdrop-blur-sm border ${
                  darkMode ? 'border-gray-600/50' : 'border-gray-200/50'
                }`}>
                  <div className="text-xs opacity-80 mb-1">Saldo</div>
                  <div className="font-bold text-sm text-emerald-500">
                    R$ {trendData.reduce((acc, item) => acc + item.balance, 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs opacity-60">6 meses</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Trend Chart */}
        {monthlyData.length > 0 && (
          <div
            className={`relative overflow-hidden ${
              darkMode
                ? 'bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900'
                : 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
            } p-6 rounded-3xl shadow-2xl border ${
              darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            } backdrop-blur-sm`}
            style={{
              background: darkMode
                ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
              boxShadow: darkMode
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.8)',
            }}
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/8 to-teal-400/8 rounded-full blur-3xl -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400/8 to-indigo-400/8 rounded-full blur-3xl translate-y-16 -translate-x-16" />

            <div className="relative z-10">
              <h4 className="font-bold mb-6 flex items-center gap-3 text-lg">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                  Evolução Diária - {monthNames[selectedMonth - 1]} {selectedYear}
                </span>
              </h4>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="30%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="70%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.02}/>
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.4}/>
                        <stop offset="30%" stopColor="#f43f5e" stopOpacity={0.2}/>
                        <stop offset="70%" stopColor="#f43f5e" stopOpacity={0.1}/>
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.02}/>
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="areaShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="rgba(0,0,0,0.15)"/>
                      </filter>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={darkMode ? 'rgba(156, 163, 175, 0.2)' : 'rgba(107, 114, 128, 0.2)'}
                      strokeWidth={1}
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 12, fill: darkMode ? '#9CA3AF' : '#6B7280', fontWeight: '600' }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                      tickMargin={12}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: darkMode ? '#9CA3AF' : '#6B7280', fontWeight: '600' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                      tickMargin={8}
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      }
                      labelFormatter={(label) => `${label}`}
                      contentStyle={{
                        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '20px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        fontSize: '14px',
                        fontWeight: '600',
                        backdropFilter: 'blur(20px)',
                        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                      }}
                      labelStyle={{
                        color: darkMode ? '#F9FAFB' : '#111827',
                        fontWeight: '700',
                        marginBottom: '4px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#incomeGradient)"
                      strokeWidth={3}
                      dot={{
                        fill: '#10b981',
                        strokeWidth: 2,
                        r: 5,
                        filter: 'url(#glow)',
                        stroke: darkMode ? '#1F2937' : '#ffffff'
                      }}
                      activeDot={{
                        r: 7,
                        stroke: '#10b981',
                        strokeWidth: 3,
                        filter: 'url(#glow)',
                        fill: darkMode ? '#1F2937' : '#ffffff'
                      }}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      style={{ filter: 'url(#areaShadow)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#f43f5e"
                      fillOpacity={1}
                      fill="url(#expenseGradient)"
                      strokeWidth={3}
                      dot={{
                        fill: '#f43f5e',
                        strokeWidth: 2,
                        r: 5,
                        filter: 'url(#glow)',
                        stroke: darkMode ? '#1F2937' : '#ffffff'
                      }}
                      activeDot={{
                        r: 7,
                        stroke: '#f43f5e',
                        strokeWidth: 3,
                        filter: 'url(#glow)',
                        fill: darkMode ? '#1F2937' : '#ffffff'
                      }}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      animationBegin={300}
                      style={{ filter: 'url(#areaShadow)' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h4 className="font-bold">Transações Recentes</h4>
        </div>
        {transactions.slice(0, 5).map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } p-4 rounded-2xl flex items-center justify-between shadow-sm border will-change-transform ${
              darkMode ? 'border-gray-700' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  t.type === 'income'
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-rose-100 text-rose-600'
                }`}
              >
                <CategoryIcon category={t.category} />
              </div>
              <div>
                <p className="font-bold text-sm">{t.description}</p>
                <p className="text-xs opacity-50">
                  {categories.find((c) => c.value === t.category)?.label} •{' '}
                  {new Date(t.date).toLocaleDateString('pt-PT')}
                </p>
              </div>
            </div>
            <span
              className={`font-bold ${
                t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {t.type === 'income' ? '+' : '-'} R$
              {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </motion.div>
        ))}
        {transactions.length === 0 && (
          <div className="text-center py-12 opacity-50">
            <p>Nenhuma transação ainda</p>
            <p className="text-sm">Clique no + para adicionar</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}