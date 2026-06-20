import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { chartTheme } from './constants';
import { ChartCard } from './ChartCard';
import { formatMoney, formatAmount0 } from '../../../utils/format';

interface TrendsChartProps {
  trendData: { month: string; income: number; expenses: number; balance: number }[];
  darkMode: boolean;
}

export function TrendsChart({ trendData, darkMode }: TrendsChartProps) {
  if (trendData.length === 0) return null;
  const theme = chartTheme(darkMode);

  const totals = trendData.reduce(
    (acc, item) => ({
      income: acc.income + item.income,
      expenses: acc.expenses + item.expenses,
      balance: acc.balance + item.balance,
    }),
    { income: 0, expenses: 0, balance: 0 },
  );

  const series = [
    { key: 'income', color: theme.income },
    { key: 'expenses', color: theme.expense },
    { key: 'balance', color: theme.balance },
  ] as const;

  return (
    <ChartCard title="Tendências (6 meses)" icon={TrendingUp}>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`trend-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} horizontal vertical={false} />
            <XAxis
              dataKey="month"
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
              formatter={(value: number, name: string) => [
                formatMoney(value),
                name === 'income' ? 'Receitas' : name === 'expenses' ? 'Despesas' : 'Saldo',
              ]}
              labelFormatter={(label) => `Mês: ${label}`}
              contentStyle={theme.tooltip}
              labelStyle={theme.tooltipLabel}
            />
            {series.map((s, i) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                fill={`url(#trend-${s.key})`}
                strokeWidth={2.5}
                dot={{ fill: s.color, strokeWidth: 2, r: 4, stroke: theme.dotStroke }}
                activeDot={{ r: 6, stroke: s.color, strokeWidth: 2, fill: theme.dotStroke }}
                animationDuration={1000}
                animationEasing="ease-out"
                animationBegin={i * 200}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mt-4">
        <Summary label="Receitas" value={totals.income} color="var(--income)" />
        <Summary label="Despesas" value={totals.expenses} color="var(--expense)" />
        <Summary label="Saldo" value={totals.balance} color="var(--info)" />
      </div>
    </ChartCard>
  );
}

function Summary({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="p-2.5 rounded-[12px] text-center border"
      style={{ background: 'var(--surface2)', borderColor: 'var(--line)' }}
    >
      <div className="text-[11px] mb-0.5" style={{ color: 'var(--faint)' }}>
        {label}
      </div>
      <div className="font-bold text-[13px] tnum" style={{ color }}>
        R$ {formatAmount0(value)}
      </div>
      <div className="text-[10.5px]" style={{ color: 'var(--faint)' }}>
        6 meses
      </div>
    </div>
  );
}
