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

const fieldClass = 'w-full p-3.5 rounded-[14px] border outline-none transition-all';
const fieldStyle = { background: 'var(--surface2)', borderColor: 'var(--line)', color: 'var(--text)' };
const labelClass = 'text-[13px] font-medium mb-2 block';
const labelStyle = { color: 'var(--muted)' };

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
            className="relative z-10 w-full max-w-sm flex flex-col rounded-[24px] border shadow-2xl"
            style={{ maxHeight: '80vh', background: 'var(--surface)', borderColor: 'var(--line)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-[19px] font-bold">Editar transação</h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar"
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Conteúdo scrollável */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="p-6 space-y-4">
                <div>
                  <label className={labelClass} style={labelStyle}>Descrição</label>
                  <input
                    type="text"
                    value={transaction.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    className={`${fieldClass} focus:ring-2`}
                    style={fieldStyle}
                  />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Valor</label>
                  <CurrencyInput
                    value={transaction.value}
                    onValueChange={(value) => onChange({ value: value || '0' })}
                    prefix="R$ "
                    className={`${fieldClass} font-bold text-2xl tnum focus:ring-2`}
                    style={fieldStyle}
                    placeholder="R$ 0,00"
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                  />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Categoria</label>
                  <select
                    value={transaction.category}
                    onChange={(e) => onChange({ category: e.target.value as CategoryType })}
                    className={fieldClass}
                    style={fieldStyle}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Conta</label>
                  <select
                    value={transaction.account}
                    onChange={(e) => onChange({ account: e.target.value as AccountType })}
                    className={fieldClass}
                    style={fieldStyle}
                  >
                    <option value="checking">Conta Corrente</option>
                    <option value="savings">Conta Poupança</option>
                    <option value="credit_card">Cartão de Crédito</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Data</label>
                  <input
                    type="date"
                    value={typeof transaction.date === 'string' ? transaction.date.split('T')[0] : transaction.date}
                    onChange={(e) => onChange({ date: e.target.value })}
                    className={fieldClass}
                    style={fieldStyle}
                  />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Tags</label>
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
                  className="w-full py-3.5 rounded-[16px] font-bold mt-2 active:scale-95 transition-all disabled:opacity-50"
                  style={{ background: 'var(--accent)', color: 'var(--accent-on)' }}
                >
                  {loading ? 'Salvando...' : 'Salvar alterações'}
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
