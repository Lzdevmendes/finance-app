import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS as COLORS, chartTheme, dashboardCategories as categories } from './constants';
import { ChartCard } from './ChartCard';
import { formatMoney } from '../../../utils/format';

interface CategoryExpensesChartProps {
  categoryData: { category: string; value: number; percentage: number }[];
  darkMode: boolean;
}

export function CategoryExpensesChart({ categoryData, darkMode }: CategoryExpensesChartProps) {
  if (categoryData.length === 0) return null;
  const theme = chartTheme(darkMode);
  const labelOf = (value: string) => categories.find((c) => c.value === value)?.label ?? value;

  return (
    <ChartCard
      title="Despesas por categoria"
      icon={BarChart3}
      tint="var(--info)"
      tintBg="rgba(154,166,240,.13)"
    >
      <div className="h-72 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData} margin={{ top: 12, right: 12, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} horizontal vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: theme.axis, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
              tickFormatter={labelOf}
            />
            <YAxis
              tick={{ fontSize: 11, fill: theme.axis, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              tickMargin={8}
            />
            <Tooltip
              formatter={(value: number) => [formatMoney(value), 'Valor']}
              labelFormatter={labelOf}
              contentStyle={theme.tooltip}
              labelStyle={theme.tooltipLabel}
              cursor={{ fill: theme.grid }}
            />
            <Bar dataKey="value" fill="var(--info)" radius={[8, 8, 0, 0]} animationDuration={900} animationEasing="ease-out" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {categoryData.slice(0, 4).map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
            className="flex items-center gap-2.5 p-2.5 rounded-[12px] border"
            style={{ background: 'var(--surface2)', borderColor: 'var(--line)' }}
          >
            <span
              className="w-3 h-3 rounded-full flex-none"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-medium truncate block">{labelOf(item.category)}</span>
              <span className="text-[11.5px] tnum" style={{ color: 'var(--faint)' }}>
                {item.percentage.toFixed(1)}% • {formatMoney(item.value)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </ChartCard>
  );
}
