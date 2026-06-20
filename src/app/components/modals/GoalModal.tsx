import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';
import { useFinance } from '../../contexts/FinanceContext';
import { themes } from '../../constants/ui';
import { Goal } from '../../types';
import { logError } from '../../utils/logger';

const fieldClass = 'w-full p-3.5 rounded-[14px] border outline-none transition-all';
const fieldStyle = { background: 'var(--surface2)', borderColor: 'var(--line)', color: 'var(--text)' };
const labelClass = 'block text-[13px] font-medium mb-2';
const labelStyle = { color: 'var(--muted)' };

export function GoalModal({
  show,
  onClose,
  theme,
  editGoal,
}: {
  show: boolean;
  onClose: () => void;
  theme: keyof typeof themes;
  editGoal?: Goal | null;
}) {
  const { addGoal, updateGoal } = useFinance();
  const [name, setName] = useState(editGoal?.name || '');
  const [targetAmount, setTargetAmount] = useState(
    editGoal?.targetAmount?.toString() || ''
  );
  const [currentAmount, setCurrentAmount] = useState(
    editGoal?.currentAmount?.toString() || ''
  );
  // Update form values when editGoal changes
  useEffect(() => {
    if (editGoal) {
      setName(editGoal.name || '');
      setTargetAmount(editGoal.targetAmount?.toString() || '');
      setCurrentAmount(editGoal.currentAmount?.toString() || '');
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('');
    }
  }, [editGoal]);

  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setError(null);
  };

  const validateGoalForm = () => {
    if (!name.trim()) {
      setError('Nome da meta é obrigatório');
      return false;
    }
    const target = parseFloat(String(targetAmount).replace(',', '.')) || 0;
    if (target <= 0) {
      setError('Valor da meta deve ser maior que zero');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateGoalForm()) return;

    const targetNum = parseFloat(String(targetAmount).replace(',', '.')) || 0;
    const currentNum = parseFloat(String(currentAmount).replace(',', '.')) || 0;

    // Fire-and-forget: fecha o modal imediatamente, Firebase sincroniza via onSnapshot
    if (editGoal) {
      updateGoal(editGoal.id, { name, targetAmount: targetNum, currentAmount: currentNum })
        .catch((err: unknown) => logError('Error updating goal:', err));
    } else {
      addGoal({ name, targetAmount: targetNum, currentAmount: currentNum, icon: 'target', color: theme })
        .catch((err: unknown) => logError('Error adding goal:', err));
    }

    resetForm();
    onClose();
  };

  if (!show) return null;
  return createPortal(
    <AnimatePresence>
      {show && (
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
            onClick={onClose}
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
                <h3 className="text-[19px] font-bold">
                  {editGoal ? 'Editar meta' : 'Nova meta'}
                </h3>
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
              {error && (
                <div
                  className="mx-6 mt-4 p-3 rounded-[12px] border"
                  style={{ background: 'rgba(207,91,63,.1)', borderColor: 'rgba(207,91,63,.3)' }}
                >
                  <p className="text-[13px] font-medium" style={{ color: 'var(--expense)' }}>{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className={labelClass} style={labelStyle}>Nome da meta</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(null); }}
                    placeholder="Ex: Viagem para Paris"
                    className={`${fieldClass} focus:ring-2`}
                    style={fieldStyle}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Valor da meta</label>
                  <CurrencyInput
                    value={targetAmount}
                    onValueChange={(value) => { setTargetAmount(value || ''); setError(null); }}
                    prefix="R$ "
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                    placeholder="R$ 0,00"
                    className={`${fieldClass} font-bold text-xl tnum focus:ring-2`}
                    style={fieldStyle}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Valor atual (já economizado)</label>
                  <CurrencyInput
                    value={currentAmount}
                    onValueChange={(value) => setCurrentAmount(value || '')}
                    prefix="R$ "
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                    placeholder="R$ 0,00"
                    className={`${fieldClass} font-bold text-xl tnum focus:ring-2`}
                    style={fieldStyle}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-[16px] font-bold mt-2 active:scale-95 transition-all"
                  style={{ background: 'var(--accent)', color: 'var(--accent-on)' }}
                >
                  {editGoal ? 'Atualizar meta' : 'Criar meta'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
