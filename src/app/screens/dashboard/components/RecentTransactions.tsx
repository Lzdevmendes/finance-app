import { motion } from 'framer-motion';
import { CategoryIcon } from '../../../components/CategoryIcon';
import { dashboardCategories as categories } from './constants';
import { formatMoney } from '../../../utils/format';
import { Transaction } from '../../../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  darkMode: boolean;
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="space-y-2.5">
      <h4 className="font-bold text-[15px] px-1">Transações recentes</h4>

      {transactions.slice(0, 5).map((t, index) => {
        const income = t.type === 'income';
        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06, duration: 0.35 }}
            className="p-3.5 rounded-[16px] flex items-center justify-between border will-change-transform"
            style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-[42px] h-[42px] flex-none rounded-[13px] flex items-center justify-center"
                style={{
                  background: income ? 'rgba(111,215,163,.13)' : 'rgba(232,137,107,.13)',
                  color: income ? 'var(--income)' : 'var(--expense)',
                }}
              >
                <CategoryIcon category={t.category} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[14px] truncate">{t.description}</p>
                <p className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--faint)' }}>
                  {categories.find((c) => c.value === t.category)?.label} •{' '}
                  {new Date(t.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <span
              className="font-bold text-[14px] tnum flex-none"
              style={{ color: income ? 'var(--income)' : 'var(--expense)' }}
            >
              {income ? '+' : '-'} {formatMoney(t.value)}
            </span>
          </motion.div>
        );
      })}

      {transactions.length === 0 && (
        <div className="text-center py-12" style={{ color: 'var(--faint)' }}>
          <p className="text-[14px]">Nenhuma transação ainda</p>
          <p className="text-[12.5px] mt-0.5">Toque no + para adicionar</p>
        </div>
      )}
    </div>
  );
}
