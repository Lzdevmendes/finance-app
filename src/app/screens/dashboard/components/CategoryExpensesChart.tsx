import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS as COLORS, dashboardCategories as categories } from './constants';

interface CategoryExpensesChartProps {
  categoryData: { category: string; value: number; percentage: number }[];
  darkMode: boolean;
}

export function CategoryExpensesChart({ categoryData, darkMode }: CategoryExpensesChartProps) {
  if (categoryData.length === 0) return null;
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
  );
}
