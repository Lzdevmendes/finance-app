import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, TrendingUp, TrendingDown, Trophy, ArrowLeftRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../contexts/FinanceContext';
import { ScreenHeader } from '../../components/ScreenHeader';
import { chartTheme } from '../dashboard/components/constants';
import { categories } from '../../constants/ui';
import { formatMoney, formatAmount0, formatPercentDelta } from '../../utils/format';
import { TransactionType, type Transaction } from '../../types';

const MONTH_ABBR = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const catLabel = (v: string) => categories.find((c) => c.value === v)?.label ?? v;

interface MonthBucket {
  key: string;
  label: string;
  income: number;
  expenses: number;
  net: number;
}

/** Soma receitas/despesas de um conjunto de transações. */
function totals(list: Transaction[]) {
  let income = 0;
  let expenses = 0;
  list.forEach((t) => {
    if (t.type === TransactionType.INCOME) income += t.value;
    else expenses += t.value;
  });
  return { income, expenses, net: income - expenses };
}

export function ReportsScreen() {
  const { transactions, preferences } = useFinance();
  const theme = chartTheme(preferences.darkMode);

  // Últimos 6 meses (inclui o atual).
  const months = useMemo<MonthBucket[]>(() => {
    const now = new Date();
    const out: MonthBucket[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const inMonth = transactions.filter((t) => {
        const td = new Date(t.date);
        return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
      });
      const { income, expenses, net } = totals(inMonth);
      out.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_ABBR[d.getMonth()], income, expenses, net });
    }
    return out;
  }, [transactions]);

  const thisM = months[months.length - 1];
  const lastM = months[months.length - 2];

  // Score de saúde (0–100), transparente.
  const score = useMemo(() => {
    const savingsRate = thisM.income > 0 ? thisM.net / thisM.income : 0;
    const savingsPts = Math.max(0, Math.min(savingsRate / 0.3, 1)) * 50;
    const balancePts = thisM.net >= 0 ? 25 : 0;
    const last3 = months.slice(-3);
    const positiveMonths = last3.filter((m) => m.net >= 0).length;
    const consistencyPts = (positiveMonths / 3) * 25;
    const total = Math.round(savingsPts + balancePts + consistencyPts);
    return {
      total,
      savingsRate,
      factors: [
        { label: 'Taxa de poupança', value: `${Math.round(savingsRate * 100)}%`, pts: Math.round(savingsPts), max: 50 },
        { label: 'Saldo do mês positivo', value: thisM.net >= 0 ? 'sim' : 'não', pts: balancePts, max: 25 },
        { label: 'Consistência (3 meses)', value: `${positiveMonths}/3`, pts: Math.round(consistencyPts), max: 25 },
      ],
    };
  }, [thisM, months]);

  const scoreLabel = score.total >= 70 ? 'Saudável' : score.total >= 40 ? 'Regular' : 'Atenção';
  const scoreColor = score.total >= 70 ? 'var(--income)' : score.total >= 40 ? 'var(--warn)' : 'var(--expense)';

  // Maiores gastos do mês: top categorias + top transações.
  const topThisMonth = useMemo(() => {
    const now = new Date();
    const expenses = transactions.filter(
      (t) =>
        t.type === TransactionType.EXPENSE &&
        new Date(t.date).getMonth() === now.getMonth() &&
        new Date(t.date).getFullYear() === now.getFullYear(),
    );
    const byCat: Record<string, number> = {};
    expenses.forEach((t) => (byCat[t.category] = (byCat[t.category] ?? 0) + t.value));
    const topCats = Object.entries(byCat)
      .map(([cat, value]) => ({ cat, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    const maxCat = topCats[0]?.value ?? 1;
    const topTx = [...expenses].sort((a, b) => b.value - a.value).slice(0, 3);
    return { topCats, maxCat, topTx };
  }, [transactions]);

  const incomeDelta = lastM.income > 0 ? ((thisM.income - lastM.income) / lastM.income) * 100 : 0;
  const expenseDelta = lastM.expenses > 0 ? ((thisM.expenses - lastM.expenses) / lastM.expenses) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-[22px] pb-28 pt-2 space-y-4"
    >
      <ScreenHeader title="Relatórios" back="more" />

      {/* Score de saúde */}
      <Card>
        <CardTitle icon={HeartPulse} title="Saúde financeira" />
        <div className="flex items-center gap-5 mb-4">
          <div
            className="w-[88px] h-[88px] rounded-full flex flex-col items-center justify-center flex-none"
            style={{ background: 'var(--surface2)', border: `3px solid ${scoreColor}` }}
          >
            <span className="text-[26px] font-extrabold tnum leading-none" style={{ color: scoreColor }}>
              {score.total}
            </span>
            <span className="text-[10px]" style={{ color: 'var(--faint)' }}>
              / 100
            </span>
          </div>
          <div>
            <div className="text-[16px] font-bold" style={{ color: scoreColor }}>
              {scoreLabel}
            </div>
            <p className="text-[12.5px] mt-0.5 leading-snug" style={{ color: 'var(--muted)' }}>
              Calculado pela taxa de poupança, saldo do mês e consistência.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {score.factors.map((f) => (
            <div key={f.label} className="flex items-center justify-between text-[13px]">
              <span style={{ color: 'var(--muted)' }}>{f.label}</span>
              <span className="tnum font-semibold">
                {f.value} <span style={{ color: 'var(--faint)' }}>· {f.pts}/{f.max}</span>
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Fluxo de caixa mensal */}
      <Card>
        <CardTitle icon={ArrowLeftRight} title="Fluxo de caixa (6 meses)" />
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={months} margin={{ top: 8, right: 4, left: 0, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} horizontal vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: theme.axis, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: theme.axis, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} width={32} />
              <Tooltip
                formatter={(v: number, n: string) => [formatMoney(v), n === 'income' ? 'Receitas' : 'Despesas']}
                contentStyle={theme.tooltip}
                labelStyle={theme.tooltipLabel}
                cursor={{ fill: theme.grid }}
              />
              <Bar dataKey="income" fill={theme.income} radius={[5, 5, 0, 0]} />
              <Bar dataKey="expenses" fill={theme.expense} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-2 text-[12.5px]" style={{ color: 'var(--muted)' }}>
          <span>Saldo líquido (6m)</span>
          <span className="tnum font-bold" style={{ color: months.reduce((a, m) => a + m.net, 0) >= 0 ? 'var(--income)' : 'var(--expense)' }}>
            R$ {formatAmount0(months.reduce((a, m) => a + m.net, 0))}
          </span>
        </div>
      </Card>

      {/* Comparativo mês a mês */}
      <Card>
        <CardTitle icon={TrendingUp} title="Comparativo com o mês anterior" />
        <div className="grid grid-cols-2 gap-3">
          <Delta label="Receitas" value={thisM.income} delta={incomeDelta} goodWhenUp />
          <Delta label="Despesas" value={thisM.expenses} delta={expenseDelta} goodWhenUp={false} />
        </div>
      </Card>

      {/* Maiores gastos */}
      <Card>
        <CardTitle icon={Trophy} title="Maiores gastos do mês" />
        {topThisMonth.topCats.length === 0 ? (
          <p className="text-[13px] py-4 text-center" style={{ color: 'var(--faint)' }}>
            Sem despesas neste mês.
          </p>
        ) : (
          <>
            <div className="space-y-2.5 mb-4">
              {topThisMonth.topCats.map((c) => (
                <div key={c.cat}>
                  <div className="flex justify-between text-[13px] mb-1">
                    <span className="font-medium">{catLabel(c.cat)}</span>
                    <span className="tnum" style={{ color: 'var(--muted)' }}>{formatMoney(c.value)}</span>
                  </div>
                  <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'var(--surface2)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(c.value / topThisMonth.maxCat) * 100}%`, background: 'var(--expense)' }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 space-y-2" style={{ borderTop: '1px solid var(--line)' }}>
              {topThisMonth.topTx.map((t) => (
                <div key={t.id} className="flex justify-between text-[13px]">
                  <span className="truncate mr-3" style={{ color: 'var(--muted)' }}>{t.description}</span>
                  <span className="tnum font-semibold flex-none" style={{ color: 'var(--expense)' }}>{formatMoney(t.value)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-[20px] border" style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}>
      {children}
    </div>
  );
}

function CardTitle({ icon: Icon, title }: { icon: typeof HeartPulse; title: string }) {
  return (
    <h4 className="font-bold text-[15px] mb-4 flex items-center gap-2.5">
      <span className="w-[34px] h-[34px] rounded-[11px] flex items-center justify-center" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
        <Icon size={18} strokeWidth={2} />
      </span>
      {title}
    </h4>
  );
}

function Delta({ label, value, delta, goodWhenUp }: { label: string; value: number; delta: number; goodWhenUp: boolean }) {
  const up = delta > 0;
  const good = up === goodWhenUp;
  const color = delta === 0 ? 'var(--muted)' : good ? 'var(--income)' : 'var(--expense)';
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <div className="p-3.5 rounded-[14px]" style={{ background: 'var(--surface2)' }}>
      <div className="text-[12px] mb-1" style={{ color: 'var(--faint)' }}>{label}</div>
      <div className="text-[16px] font-bold tnum">{formatMoney(value)}</div>
      <div className="flex items-center gap-1 mt-1 text-[12px] font-semibold" style={{ color }}>
        {delta !== 0 && <Icon size={13} strokeWidth={2.4} />}
        {delta === 0 ? '—' : formatPercentDelta(delta)}
      </div>
    </div>
  );
}
