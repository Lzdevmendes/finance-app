import { motion } from 'framer-motion';
import { PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS as COLORS } from './constants';

interface ExpensesPieChartProps {
  chartData: { name: string; value: number }[];
  darkMode: boolean;
}

export function ExpensesPieChart({ chartData, darkMode }: ExpensesPieChartProps) {
  if (chartData.length === 0) return null;
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
  );
}
