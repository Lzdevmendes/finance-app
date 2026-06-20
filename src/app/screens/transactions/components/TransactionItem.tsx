import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { CategoryIcon } from '../../../components/CategoryIcon';
import { formatMoney } from '../../../utils/format';
import { Transaction } from '../../../types';

interface TransactionItemProps {
  transaction: Transaction;
  darkMode: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionItem({ transaction: t, onEdit, onDelete }: TransactionItemProps) {
  const income = t.type === 'income';
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-3.5 rounded-[16px] flex items-center justify-between border"
      style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="w-[42px] h-[42px] flex-none rounded-[13px] flex items-center justify-center"
          style={{
            background: income ? 'rgba(111,215,163,.13)' : 'rgba(232,137,107,.13)',
            color: income ? 'var(--income)' : 'var(--expense)',
          }}
        >
          <CategoryIcon category={t.category} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[14px] truncate">{t.description}</p>
          {t.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {t.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-none">
        <div className="text-right">
          <span
            className="font-bold text-[14px] tnum block"
            style={{ color: income ? 'var(--income)' : 'var(--expense)' }}
          >
            {income ? '+' : '-'} {formatMoney(t.value)}
          </span>
          <span className="text-[11.5px]" style={{ color: 'var(--faint)' }}>
            {t.account}
          </span>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => onEdit(t)}
            aria-label="Editar"
            className="p-2 rounded-[10px]"
            style={{ color: 'var(--faint)' }}
          >
            <Pencil size={17} strokeWidth={2} />
          </button>
          <button
            onClick={() => {
              if (confirm('Deseja excluir esta transação?')) {
                onDelete(t.id);
              }
            }}
            aria-label="Excluir"
            className="p-2 rounded-[10px]"
            style={{ color: 'var(--faint)' }}
          >
            <Trash2 size={17} strokeWidth={2} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
