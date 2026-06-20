import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, PieChart } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ScreenHeader } from '../../components/ScreenHeader';
import { categories } from '../../constants/ui';
import { formatMoney } from '../../utils/format';
import { TransactionType } from '../../types';
import { BudgetSheet } from './BudgetSheet';

type Budgets = Record<string, number>;

const catInfo = (v: string) => categories.find((c) => c.value === v);

/** Cor da barra: verde (ok), warn (≥80%), expense (>100%). */
function barColor(ratio: number): string {
  if (ratio > 1) return 'var(--expense)';
  if (ratio >= 0.8) return 'var(--warn)';
  return 'var(--accent)';
}

export function BudgetsScreen() {
  const { transactions } = useFinance();
  const [budgets, setBudgets] = useLocalStorage<Budgets>('budgets', {});
  const [sheetCategory, setSheetCategory] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  // Gasto do mês por categoria (apenas despesas).
  const monthSpend = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.type !== TransactionType.EXPENSE) return;
      const d = new Date(t.date);
      if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
        map[t.category] = (map[t.category] ?? 0) + t.value;
      }
    });
    return map;
  }, [transactions, thisMonth, thisYear]);

  // Média mensal por categoria nos 3 meses anteriores (sugestão). Sem histórico → indefinido.
  const suggested = useMemo(() => {
    const buckets: Record<string, Set<string>> = {};
    const sums: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.type !== TransactionType.EXPENSE) return;
      const d = new Date(t.date);
      const monthsAgo = (thisYear - d.getFullYear()) * 12 + (thisMonth - d.getMonth());
      if (monthsAgo >= 1 && monthsAgo <= 3) {
        sums[t.category] = (sums[t.category] ?? 0) + t.value;
        (buckets[t.category] ??= new Set()).add(`${d.getFullYear()}-${d.getMonth()}`);
      }
    });
    const out: Record<string, number> = {};
    Object.keys(sums).forEach((cat) => {
      const months = buckets[cat]?.size || 1;
      out[cat] = sums[cat] / months;
    });
    return out;
  }, [transactions, thisMonth, thisYear]);

  // Categorias exibidas: com orçamento OU com gasto no mês.
  const rows = useMemo(() => {
    const cats = new Set([...Object.keys(budgets), ...Object.keys(monthSpend)]);
    return [...cats]
      .map((cat) => ({ cat, limit: budgets[cat] ?? 0, spent: monthSpend[cat] ?? 0 }))
      .sort((a, b) => b.spent - a.spent);
  }, [budgets, monthSpend]);

  const totals = rows.reduce(
    (acc, r) => ({ limit: acc.limit + r.limit, spent: acc.spent + r.spent }),
    { limit: 0, spent: 0 },
  );

  const availableToAdd = categories.filter((c) => budgets[c.value] == null);

  const saveBudget = (category: string, limit: number) => {
    setBudgets((prev) => ({ ...prev, [category]: limit }));
    setSheetCategory(null);
    setAdding(false);
  };
  const removeBudget = (category: string) => {
    setBudgets((prev) => {
      const next = { ...prev };
      delete next[category];
      return next;
    });
    setSheetCategory(null);
  };

  const sheetOpen = adding || sheetCategory !== null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-[22px] pb-28 pt-2 space-y-4"
    >
      <ScreenHeader
        title="Orçamentos"
        action={
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setAdding(true)}
            aria-label="Novo orçamento"
            className="w-10 h-10 flex-none rounded-[13px] flex items-center justify-center"
            style={{ background: 'var(--accent)', color: 'var(--accent-on)' }}
          >
            <Plus size={20} strokeWidth={2.4} />
          </motion.button>
        }
      />

      {/* Resumo do mês */}
      {totals.limit > 0 && (
        <div className="p-5 rounded-[20px] border" style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}>
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-[13px]" style={{ color: 'var(--muted)' }}>
              Gasto do mês
            </span>
            <span className="text-[13px] tnum" style={{ color: 'var(--faint)' }}>
              de {formatMoney(totals.limit)}
            </span>
          </div>
          <div className="text-[26px] font-extrabold tnum mb-3" style={{ color: barColor(totals.spent / totals.limit) }}>
            {formatMoney(totals.spent)}
          </div>
          <Bar ratio={totals.spent / totals.limit} />
        </div>
      )}

      {/* Lista de categorias */}
      <div className="space-y-2.5">
        {rows.map(({ cat, limit, spent }) => {
          const info = catInfo(cat);
          const ratio = limit > 0 ? spent / limit : 0;
          return (
            <button
              key={cat}
              onClick={() => setSheetCategory(cat)}
              className="w-full p-4 rounded-[16px] border text-left"
              style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
            >
              <div className="flex items-center gap-3 mb-2.5">
                <span
                  className="w-[38px] h-[38px] flex-none rounded-[12px] flex items-center justify-center text-[18px]"
                  style={{ background: 'var(--surface2)' }}
                >
                  {info?.icon ?? '📝'}
                </span>
                <span className="flex-1 font-bold text-[14.5px]">{info?.label ?? cat}</span>
                <span className="text-[13px] tnum text-right" style={{ color: 'var(--muted)' }}>
                  {formatMoney(spent)}
                  {limit > 0 && <span style={{ color: 'var(--faint)' }}> / {formatMoney(limit)}</span>}
                </span>
              </div>
              {limit > 0 ? (
                <Bar ratio={ratio} />
              ) : (
                <span className="text-[12.5px]" style={{ color: 'var(--accent)' }}>
                  Definir um limite
                </span>
              )}
            </button>
          );
        })}

        {rows.length === 0 && (
          <div className="text-center py-14" style={{ color: 'var(--faint)' }}>
            <div
              className="w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
            >
              <PieChart size={28} />
            </div>
            <p className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>
              Nenhum orçamento ainda
            </p>
            <p className="text-[13px] mt-1">Toque no + para definir limites por categoria</p>
          </div>
        )}
      </div>

      <BudgetSheet
        open={sheetOpen}
        category={adding ? null : sheetCategory}
        available={availableToAdd}
        suggested={adding ? undefined : suggested[sheetCategory ?? '']}
        initialLimit={sheetCategory ? budgets[sheetCategory] : undefined}
        onClose={() => {
          setSheetCategory(null);
          setAdding(false);
        }}
        onSave={saveBudget}
        onRemove={removeBudget}
      />
    </motion.div>
  );
}

function Bar({ ratio }: { ratio: number }) {
  return (
    <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ background: 'var(--surface2)' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(ratio * 100, 100)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: barColor(ratio) }}
      />
    </div>
  );
}
