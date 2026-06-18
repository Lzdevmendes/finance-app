import { motion } from 'framer-motion';
import { CategoryIcon } from '../../../components/CategoryIcon';
import { dashboardCategories as categories } from './constants';
import { Transaction } from '../../../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  darkMode: boolean;
}

export function RecentTransactions({ transactions, darkMode }: RecentTransactionsProps) {
  return (
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h4 className="font-bold">Transações Recentes</h4>
        </div>
        {transactions.slice(0, 5).map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } p-4 rounded-2xl flex items-center justify-between shadow-sm border will-change-transform ${
              darkMode ? 'border-gray-700' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  t.type === 'income'
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-rose-100 text-rose-600'
                }`}
              >
                <CategoryIcon category={t.category} />
              </div>
              <div>
                <p className="font-bold text-sm">{t.description}</p>
                <p className="text-xs opacity-50">
                  {categories.find((c) => c.value === t.category)?.label} •{' '}
                  {new Date(t.date).toLocaleDateString('pt-PT')}
                </p>
              </div>
            </div>
            <span
              className={`font-bold ${
                t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {t.type === 'income' ? '+' : '-'} R$
              {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </motion.div>
        ))}
        {transactions.length === 0 && (
          <div className="text-center py-12 opacity-50">
            <p>Nenhuma transação ainda</p>
            <p className="text-sm">Clique no + para adicionar</p>
          </div>
        )}
      </div>
  );
}
