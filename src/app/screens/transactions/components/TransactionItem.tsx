import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import { CategoryIcon } from '../../../components/CategoryIcon';
import { Transaction } from '../../../types';

interface TransactionItemProps {
  transaction: Transaction;
  darkMode: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionItem({ transaction: t, darkMode, onEdit, onDelete }: TransactionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } p-4 rounded-2xl flex items-center justify-between shadow-sm border ${
        darkMode ? 'border-gray-700' : 'border-gray-100'
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          className={`p-3 rounded-xl ${
            t.type === 'income'
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-rose-100 text-rose-600'
          }`}
        >
          <CategoryIcon category={t.category} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">{t.description}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {t.tags.map((tag, i) => (
              <span
                key={i}
                className={`text-xs px-2 py-0.5 rounded-full ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <span
            className={`font-bold block ${
              t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {t.type === 'income' ? '+' : '-'} R$
            {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs opacity-50">{t.account}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(t)}
            className="text-gray-400 hover:text-blue-500 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 will-change-transform"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => {
              if (confirm('Deseja excluir esta transação?')) {
                onDelete(t.id);
              }
            }}
            className="text-gray-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-200 will-change-transform"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
