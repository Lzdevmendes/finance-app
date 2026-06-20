import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, PiggyBank, CreditCard, Pencil, type LucideIcon } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { useAccountInitials } from '../../hooks/useAccountInitials';
import { ScreenHeader } from '../../components/ScreenHeader';
import { formatMoney } from '../../utils/format';
import { AccountType, TransactionType } from '../../types';
import { AccountBalanceSheet } from './AccountBalanceSheet';

const ACCOUNTS: { type: AccountType; label: string; icon: LucideIcon }[] = [
  { type: AccountType.CHECKING, label: 'Conta Corrente', icon: Landmark },
  { type: AccountType.SAVINGS, label: 'Conta Poupança', icon: PiggyBank },
];

export function AccountsScreen() {
  const { transactions } = useFinance();
  const { initials, setInitial } = useAccountInitials();
  const [editing, setEditing] = useState<{ type: AccountType; label: string } | null>(null);

  // Movimento (income − expense) por conta, todas as transações.
  const movement = useMemo(() => {
    const map: Partial<Record<AccountType, number>> = {};
    transactions.forEach((t) => {
      const sign = t.type === TransactionType.INCOME ? 1 : -1;
      map[t.account] = (map[t.account] ?? 0) + sign * t.value;
    });
    return map;
  }, [transactions]);

  // Cartão: fatura do mês (despesas no cartão) e total gasto histórico.
  const card = useMemo(() => {
    const now = new Date();
    let invoice = 0;
    let total = 0;
    transactions.forEach((t) => {
      if (t.account !== AccountType.CREDIT_CARD || t.type !== TransactionType.EXPENSE) return;
      total += t.value;
      const d = new Date(t.date);
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) invoice += t.value;
    });
    return { invoice, total };
  }, [transactions]);

  const balanceOf = (type: AccountType) => (initials[type] ?? 0) + (movement[type] ?? 0);
  const totalInAccounts = ACCOUNTS.reduce((acc, a) => acc + balanceOf(a.type), 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-[22px] pb-28 pt-2 space-y-4"
    >
      <ScreenHeader title="Contas & Cartões" back="more" />

      {/* Patrimônio em contas */}
      <div
        className="p-[22px] rounded-[24px]"
        style={{ background: 'var(--theme-gradient)', color: 'var(--accent-on)', boxShadow: '0 18px 40px -16px var(--accent)' }}
      >
        <span className="text-[13px] opacity-85">Saldo em contas</span>
        <div className="text-[30px] font-extrabold tnum mt-1">{formatMoney(totalInAccounts)}</div>
        <div className="text-[12.5px] opacity-75 mt-1">Corrente + Poupança (saldo inicial + transações)</div>
      </div>

      {/* Contas */}
      <div className="space-y-2.5">
        {ACCOUNTS.map(({ type, label, icon: Icon }) => (
          <div
            key={type}
            className="p-4 rounded-[16px] border flex items-center gap-3"
            style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
          >
            <div
              className="w-[44px] h-[44px] flex-none rounded-[13px] flex items-center justify-center"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
            >
              <Icon size={21} strokeWidth={1.9} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[14.5px]">{label}</div>
              <div className="text-[12px]" style={{ color: 'var(--faint)' }}>
                Inicial {formatMoney(initials[type] ?? 0)}
              </div>
            </div>
            <div className="text-right">
              <div
                className="font-bold text-[15px] tnum"
                style={{ color: balanceOf(type) >= 0 ? 'var(--text)' : 'var(--expense)' }}
              >
                {formatMoney(balanceOf(type))}
              </div>
            </div>
            <button
              onClick={() => setEditing({ type, label })}
              aria-label={`Editar saldo inicial · ${label}`}
              className="w-9 h-9 flex-none rounded-[11px] flex items-center justify-center"
              style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
            >
              <Pencil size={16} strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>

      {/* Cartão de crédito */}
      <div className="p-5 rounded-[20px] border" style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-[44px] h-[44px] flex-none rounded-[13px] flex items-center justify-center"
            style={{ background: 'rgba(224,162,70,.13)', color: 'var(--warn)' }}
          >
            <CreditCard size={21} strokeWidth={1.9} />
          </div>
          <div className="flex-1">
            <div className="font-bold text-[14.5px]">Cartão de Crédito</div>
            <div className="text-[12px]" style={{ color: 'var(--faint)' }}>
              Fatura do mês atual
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-[14px]" style={{ background: 'var(--surface2)' }}>
            <div className="text-[12px] mb-1" style={{ color: 'var(--faint)' }}>
              Fatura do mês
            </div>
            <div className="text-[18px] font-bold tnum" style={{ color: 'var(--warn)' }}>
              {formatMoney(card.invoice)}
            </div>
          </div>
          <div className="p-3.5 rounded-[14px]" style={{ background: 'var(--surface2)' }}>
            <div className="text-[12px] mb-1" style={{ color: 'var(--faint)' }}>
              Total no cartão
            </div>
            <div className="text-[18px] font-bold tnum">{formatMoney(card.total)}</div>
          </div>
        </div>
      </div>

      <AccountBalanceSheet
        open={editing !== null}
        label={editing?.label ?? ''}
        initial={editing ? initials[editing.type] ?? 0 : 0}
        onClose={() => setEditing(null)}
        onSave={(value) => {
          if (editing) setInitial(editing.type, value);
          setEditing(null);
        }}
      />
    </motion.div>
  );
}
