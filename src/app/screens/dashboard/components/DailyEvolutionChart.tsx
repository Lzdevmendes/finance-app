import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarDays } from 'lucide-react';
import { chartTheme } from './constants';
import { ChartCard } from './ChartCard';
import { formatMoney } from '../../../utils/format';

interface DailyEvolutionChartProps {
  monthlyData: { day: string; income: number; expenses: number; balance: number; date: string }[];
  darkMode: boolean;
  monthNames: string[];
  selectedMonth: number;
  selectedYear: number;
}

export function DailyEvolutionChart({
  monthlyData,
  darkMode,
  monthNames,
  selectedMonth,
  selectedYear,
}: DailyEvolutionChartProps) {
  if (monthlyData.length === 0) return null;
  const theme = chartTheme(darkMode);

  return (
    <ChartCard
      title={`Evolução diária — ${monthNames[selectedMonth - 1]} ${selectedYear}`}
      icon={CalendarDays}
      tint="var(--info)"
      tintBg="rgba(154,166,240,.13)"
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="daily-income" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.income} stopOpacity={0.3} />
                <stop offset="100%" stopColor={theme.income} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="daily-expense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.expense} stopOpacity={0.3} />
                <stop offset="100%" stopColor={theme.expense} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} horizontal vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: theme.axis, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              tickMargin={10}
            />
            <YAxis
              tick={{ fontSize: 11, fill: theme.axis, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              tickMargin={8}
            />
            <Tooltip
              formatter={(value: number) => formatMoney(value)}
              contentStyle={theme.tooltip}
              labelStyle={theme.tooltipLabel}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke={theme.income}
              fill="url(#daily-income)"
              strokeWidth={2.5}
              dot={{ fill: theme.income, strokeWidth: 2, r: 4, stroke: theme.dotStroke }}
              activeDot={{ r: 6, stroke: theme.income, strokeWidth: 2, fill: theme.dotStroke }}
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke={theme.expense}
              fill="url(#daily-expense)"
              strokeWidth={2.5}
              dot={{ fill: theme.expense, strokeWidth: 2, r: 4, stroke: theme.dotStroke }}
              activeDot={{ r: 6, stroke: theme.expense, strokeWidth: 2, fill: theme.dotStroke }}
              animationDuration={1000}
              animationEasing="ease-out"
              animationBegin={200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
