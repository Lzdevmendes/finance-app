import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TrendsChartProps {
  trendData: { month: string; income: number; expenses: number; balance: number }[];
  darkMode: boolean;
}

export function TrendsChart({ trendData, darkMode }: TrendsChartProps) {
  if (trendData.length === 0) return null;
  return (
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
  );
}
