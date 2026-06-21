import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';

interface AccountBalanceSheetProps {
  open: boolean;
  label: string;
  initial: number;
  onClose: () => void;
  onSave: (value: number) => void;
}

/** Edita o saldo inicial de uma conta (somado às transações para formar o saldo). */
export function AccountBalanceSheet({ open, label, initial, onClose, onSave }: AccountBalanceSheetProps) {
  const [value, setValue] = useState(String(initial || ''));

  useEffect(() => {
    if (open) setValue(initial ? String(initial) : '');
  }, [open, initial]);

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
              <h3 className="text-[18px] font-bold">Saldo inicial · {label}</h3>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="w-9 h-9 rounded-full flex items-center justify-center flex-none"
                style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-[12.5px] mb-3" style={{ color: 'var(--muted)' }}>
              O saldo da conta = saldo inicial + suas transações nela.
            </p>
            <CurrencyInput
              value={value}
              onValueChange={(v) => setValue(v || '')}
              prefix="R$ "
              decimalsLimit={2}
              decimalSeparator=","
              groupSeparator="."
              placeholder="R$ 0,00"
              className="w-full p-3.5 rounded-[14px] border outline-none focus:ring-2 font-bold text-2xl tnum mb-4"
              style={{ background: 'var(--surface2)', borderColor: 'var(--line)', color: 'var(--text)' }}
              autoFocus
            />
            <button
              onClick={() => onSave(parseFloat(String(value).replace(',', '.')) || 0)}
              className="w-full py-3 rounded-[14px] font-semibold"
              style={{ background: 'var(--accent)', color: 'var(--accent-on)' }}
            >
              Salvar
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
