import { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../../../constants/ui';
import { TransactionType } from '../../../types';

type FilterType = 'all' | 'income' | 'expense';
type DateRange = { start: string; end: string };

interface TransactionFiltersProps {
  show: boolean;
  darkMode: boolean;
  filterType: FilterType;
  setFilterType: Dispatch<SetStateAction<FilterType>>;
  filterCategory: string;
  setFilterCategory: Dispatch<SetStateAction<string>>;
  filterAccount: string;
  setFilterAccount: Dispatch<SetStateAction<string>>;
  dateRange: DateRange;
  setDateRange: Dispatch<SetStateAction<DateRange>>;
  accounts: string[];
  onClear: () => void;
}

const fieldStyle = { background: 'var(--surface2)', borderColor: 'var(--line)', color: 'var(--text)' };
const fieldClass = 'w-full p-2.5 rounded-[12px] border outline-none text-[14px]';

export function TransactionFilters({
  show,
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  filterAccount,
  setFilterAccount,
  dateRange,
  setDateRange,
  accounts,
  onClear,
}: TransactionFiltersProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div
            className="p-4 rounded-[16px] border space-y-4"
            style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[14px]">Filtros avançados</h4>
              <button
                onClick={onClear}
                className="text-[13px] font-semibold"
                style={{ color: 'var(--accent)' }}
              >
                Limpar
              </button>
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-[13px] font-medium mb-2 block" style={{ color: 'var(--muted)' }}>
                Tipo
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'Todas' },
                  { value: TransactionType.INCOME, label: 'Receitas' },
                  { value: TransactionType.EXPENSE, label: 'Despesas' },
                ].map((type) => {
                  const isActive = filterType === type.value;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setFilterType(type.value as FilterType)}
                      className="px-3 py-1.5 rounded-full text-[13px] font-medium border"
                      style={
                        isActive
                          ? { background: 'var(--accent)', color: 'var(--accent-on)', borderColor: 'transparent' }
                          : { background: 'var(--surface2)', color: 'var(--muted)', borderColor: 'var(--line)' }
                      }
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-[13px] font-medium mb-2 block" style={{ color: 'var(--muted)' }}>
                Categoria
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={fieldClass}
                style={fieldStyle}
              >
                <option value="all">Todas as categorias</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Filter */}
            {accounts.length > 0 && (
              <div>
                <label className="text-[13px] font-medium mb-2 block" style={{ color: 'var(--muted)' }}>
                  Conta
                </label>
                <select
                  value={filterAccount}
                  onChange={(e) => setFilterAccount(e.target.value)}
                  className={fieldClass}
                  style={fieldStyle}
                >
                  <option value="all">Todas as contas</option>
                  {accounts.map((account) => (
                    <option key={account} value={account}>
                      {account}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[13px] font-medium mb-1 block" style={{ color: 'var(--muted)' }}>
                  Data inicial
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                  className={fieldClass}
                  style={fieldStyle}
                />
              </div>
              <div>
                <label className="text-[13px] font-medium mb-1 block" style={{ color: 'var(--muted)' }}>
                  Data final
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                  className={fieldClass}
                  style={fieldStyle}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
