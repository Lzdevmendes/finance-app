import { motion } from 'framer-motion';
import { PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS as COLORS, chartTheme } from './constants';
import { ChartCard } from './ChartCard';
import { formatMoney } from '../../../utils/format';

interface ExpensesPieChartProps {
  chartData: { name: string; value: number }[];
  darkMode: boolean;
}

export function ExpensesPieChart({ chartData, darkMode }: ExpensesPieChartProps) {
  if (chartData.length === 0) return null;
  const theme = chartTheme(darkMode);

  return (
    <ChartCard title="Principais despesas" icon={PieChartIcon}>
      <div className="h-72 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={72}
              outerRadius={108}
              paddingAngle={4}
              dataKey="value"
              animationBegin={200}
              animationDuration={900}
              animationEasing="ease-out"
              label={({ name, percent }) => (percent > 0.08 ? `${name}\n${(percent * 100).toFixed(0)}%` : '')}
              labelLine={false}
            >
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={theme.dotStroke}
                  strokeWidth={3}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatMoney(value)}
              contentStyle={theme.tooltip}
              labelStyle={theme.tooltipLabel}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {chartData.map((entry, index) => (
          <motion.div
            key={entry.name}
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
              <span className="text-[13px] font-medium truncate block">{entry.name}</span>
              <span className="text-[11.5px] tnum" style={{ color: 'var(--faint)' }}>
                {formatMoney(entry.value)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </ChartCard>
  );
}
