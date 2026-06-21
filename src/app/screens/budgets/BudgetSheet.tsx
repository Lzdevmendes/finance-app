import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';
import { categories } from '../../constants/ui';
import { formatMoney } from '../../utils/format';

interface BudgetSheetProps {
  open: boolean;
  /** Categoria em edição; null = adicionar nova. */
  category: string | null;
  /** Categorias que ainda não têm orçamento (para o seletor ao adicionar). */
  available: { value: string; label: string; icon: string }[];
  suggested?: number;
  initialLimit?: number;
  onClose: () => void;
  onSave: (category: string, limit: number) => void;
  onRemove?: (category: string) => void;
}

export function BudgetSheet({
  open,
  category,
  available,
  suggested,
  initialLimit,
  onClose,
  onSave,
  onRemove,
}: BudgetSheetProps) {
  const isEditing = category !== null;
  const [selected, setSelected] = useState(category ?? available[0]?.value ?? '');
  const [limit, setLimit] = useState(initialLimit ? String(initialLimit) : '');

  useEffect(() => {
    if (open) {
      setSelected(category ?? available[0]?.value ?? '');
      setLimit(initialLimit ? String(initialLimit) : '');
    }
  }, [open, category, initialLimit, available]);

  const catLabel = (v: string) => categories.find((c) => c.value === v)?.label ?? v;

  const handleSave = () => {
    const num = parseFloat(String(limit).replace(',', '.')) || 0;
    if (!selected || num <= 0) return;
    onSave(selected, num);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md p-6 rounded-t-[28px] shadow-2xl z-[1001] border-t"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--line)',
              paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 rounded-full mx-auto mb-4" style={{ background: 'var(--line)' }} />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold">
                {isEditing ? `Orçamento · ${catLabel(selected)}` : 'Novo orçamento'}
              </h3>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="w-9 h-9 rounded-full flex items-center justify-center flex-none"
                style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {!isEditing && (
                <div>
                  <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--muted)' }}>
                    Categoria
                  </label>
                  <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="w-full p-3.5 rounded-[14px] border outline-none"
                    style={{ background: 'var(--surface2)', borderColor: 'var(--line)', color: 'var(--text)' }}
                  >
                    {available.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--muted)' }}>
                  Limite mensal
                </label>
                <CurrencyInput
                  value={limit}
                  onValueChange={(v) => setLimit(v || '')}
                  prefix="R$ "
                  decimalsLimit={2}
                  decimalSeparator=","
                  groupSeparator="."
                  placeholder="R$ 0,00"
                  className="w-full p-3.5 rounded-[14px] border outline-none focus:ring-2 font-bold text-2xl tnum"
                  style={{ background: 'var(--surface2)', borderColor: 'var(--line)', color: 'var(--text)' }}
                  autoFocus
                />
                {suggested != null && suggested > 0 && (
                  <button
                    type="button"
                    onClick={() => setLimit(String(Math.round(suggested)))}
                    className="text-[12.5px] mt-2 font-medium"
                    style={{ color: 'var(--accent)' }}
                  >
                    Sugerido pela média: {formatMoney(suggested)} · usar
                  </button>
                )}
              </div>

              <div className="flex gap-3 pt-1">
                {isEditing && onRemove && (
                  <button
                    onClick={() => onRemove(selected)}
                    aria-label="Remover orçamento"
                    className="w-12 flex-none rounded-[14px] border flex items-center justify-center"
                    style={{ borderColor: 'var(--line)', color: 'var(--expense)' }}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-[14px] font-semibold"
                  style={{ background: 'var(--accent)', color: 'var(--accent-on)' }}
                >
                  Salvar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
