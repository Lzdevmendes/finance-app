import { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themes, categories } from '../../../constants/ui';
import { TransactionType } from '../../../types';

type FilterType = 'all' | 'income' | 'expense';
type DateRange = { start: string; end: string };

interface TransactionFiltersProps {
  show: boolean;
  darkMode: boolean;
  theme: keyof typeof themes;
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

export function TransactionFilters({
  show,
  darkMode,
  theme,
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
          <div className={`p-4 rounded-2xl border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          } space-y-4`}>
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Filtros Avançados</h4>
              <button
                onClick={onClear}
                className="text-sm text-emerald-500 hover:text-emerald-600"
              >
                Limpar
              </button>
            </div>
            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo</label>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'Todas' },
                  { value: TransactionType.INCOME, label: 'Receitas' },
                  { value: TransactionType.EXPENSE, label: 'Despesas' },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFilterType(type.value as FilterType)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      filterType === type.value
                        ? `${themes[theme].primary} text-white`
                        : darkMode
                        ? 'bg-gray-700 border border-gray-600'
                        : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Categoria</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`w-full p-2 rounded-xl border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-200'
                } outline-none`}
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
                <label className="text-sm font-medium mb-2 block">Conta</label>
                <select
                  value={filterAccount}
                  onChange={(e) => setFilterAccount(e.target.value)}
                  className={`w-full p-2 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-200'
                  } outline-none`}
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
                <label className="text-sm font-medium mb-1 block">Data Inicial</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className={`w-full p-2 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-200'
                  } outline-none`}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Data Final</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className={`w-full p-2 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-200'
                  } outline-none`}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
