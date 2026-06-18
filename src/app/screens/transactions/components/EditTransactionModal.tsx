import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';
import { TagInput } from '../../../components/TagInput';
import { categories } from '../../../constants/ui';
import { Transaction, CategoryType, AccountType } from '../../../types';

// Durante a edição o valor pode transitar como string (input monetário) antes
// de ser normalizado para número no save — por isso o value é number | string.
export type EditingTransaction = Omit<Transaction, 'value'> & { value: number | string };

interface EditTransactionModalProps {
  show: boolean;
  transaction: EditingTransaction | null;
  onChange: (patch: Partial<EditingTransaction>) => void;
  onClose: () => void;
  onSave: () => void;
  loading: boolean;
  darkMode: boolean;
}

export function EditTransactionModal({
  show,
  transaction,
  onChange,
  onClose,
  onSave,
  loading,
  darkMode,
}: EditTransactionModalProps) {
  return createPortal(
    <AnimatePresence>
      {show && transaction && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{
            paddingTop: 'env(safe-area-inset-top, 0px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { if (!loading) onClose(); }}
          />
          {/* Modal centralizado - bordas arredondadas em todos os lados */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className={`relative z-10 w-full max-w-sm flex flex-col ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-3xl shadow-2xl`}
            style={{ maxHeight: '80vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex-shrink-0 px-6 pt-5 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Editar Transação</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Conteúdo scrollável */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block opacity-70">Descrição</label>
                  <input
                    type="text"
                    value={transaction.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    className={`w-full p-4 rounded-2xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block opacity-70">Valor</label>
                  <CurrencyInput
                    value={transaction.value}
                    onValueChange={(value) => onChange({ value: value || '0' })}
                    prefix="R$ "
                    className={`w-full p-4 rounded-2xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-2xl`}
                    placeholder="R$ 0,00"
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block opacity-70">Categoria</label>
                  <select
                    value={transaction.category}
                    onChange={(e) => onChange({ category: e.target.value as CategoryType })}
                    className={`w-full p-4 rounded-2xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } outline-none`}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block opacity-70">Conta</label>
                  <select
                    value={transaction.account}
                    onChange={(e) => onChange({ account: e.target.value as AccountType })}
                    className={`w-full p-4 rounded-2xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } outline-none`}
                  >
                    <option value="checking">Conta Corrente</option>
                    <option value="savings">Conta Poupança</option>
                    <option value="credit_card">Cartão de Crédito</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block opacity-70">Data</label>
                  <input
                    type="date"
                    value={typeof transaction.date === 'string' ? transaction.date.split('T')[0] : transaction.date}
                    onChange={(e) => onChange({ date: e.target.value })}
                    className={`w-full p-4 rounded-2xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } outline-none`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block opacity-70">Tags</label>
                  <TagInput
                    tags={transaction.tags || []}
                    onTagsChange={(tags) => onChange({ tags })}
                    placeholder="Adicionar tags..."
                    darkMode={darkMode}
                  />
                </div>
                <button
                  type="button"
                  onClick={onSave}
                  disabled={loading}
                  className="w-full py-4 theme-primary text-white rounded-2xl font-bold shadow-lg mt-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
