import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';
import type { RecurringFrequency } from '../../types';
import type { Recurrence } from './types';

interface RecurrenceSheetProps {
  open: boolean;
  editing: Recurrence | null;
  onClose: () => void;
  onSave: (data: Omit<Recurrence, 'id'>, id?: string) => void;
  onRemove?: (id: string) => void;
}

const FREQUENCIES: { value: RecurringFrequency; label: string }[] = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'yearly', label: 'Anual' },
];

const fieldStyle = { background: 'var(--surface2)', borderColor: 'var(--line)', color: 'var(--text)' };

export function RecurrenceSheet({ open, editing, onClose, onSave, onRemove }: RecurrenceSheetProps) {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [frequency, setFrequency] = useState<RecurringFrequency>('monthly');
  const [dueDay, setDueDay] = useState('1');

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '');
      setValue(editing ? String(editing.value) : '');
      setFrequency(editing?.frequency ?? 'monthly');
      setDueDay(editing ? String(editing.dueDay) : '1');
    }
  }, [open, editing]);

  const handleSave = () => {
    const num = parseFloat(String(value).replace(',', '.')) || 0;
    const day = Math.min(31, Math.max(1, parseInt(dueDay, 10) || 1));
    if (!name.trim() || num <= 0) return;
    onSave({ name: name.trim(), value: num, frequency, dueDay: day }, editing?.id);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000]">
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
            className="absolute bottom-0 left-0 right-0 p-6 rounded-t-[28px] shadow-2xl z-[1001] border-t"
            style={{ background: 'var(--surface)', borderColor: 'var(--line)', paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 rounded-full mx-auto mb-4" style={{ background: 'var(--line)' }} />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold">{editing ? 'Editar recorrência' : 'Nova recorrência'}</h3>
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
              <div>
                <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--muted)' }}>Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Netflix, Aluguel, Academia..."
                  className="w-full p-3.5 rounded-[14px] border outline-none focus:ring-2"
                  style={fieldStyle}
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--muted)' }}>Valor</label>
                <CurrencyInput
                  value={value}
                  onValueChange={(v) => setValue(v || '')}
                  prefix="R$ "
                  decimalsLimit={2}
                  decimalSeparator=","
                  groupSeparator="."
                  placeholder="R$ 0,00"
                  className="w-full p-3.5 rounded-[14px] border outline-none focus:ring-2 font-bold text-xl tnum"
                  style={fieldStyle}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--muted)' }}>Frequência</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as RecurringFrequency)}
                    className="w-full p-3.5 rounded-[14px] border outline-none"
                    style={fieldStyle}
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--muted)' }}>Dia</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    className="w-full p-3.5 rounded-[14px] border outline-none tnum"
                    style={fieldStyle}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                {editing && onRemove && (
                  <button
                    onClick={() => onRemove(editing.id)}
                    aria-label="Remover"
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
