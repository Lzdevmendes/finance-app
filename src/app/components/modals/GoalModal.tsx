import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';
import { useFinance } from '../../contexts/FinanceContext';
import { themes } from '../../constants/ui';
import { Goal } from '../../types';
import { logError } from '../../utils/logger';

export function GoalModal({
  show,
  onClose,
  darkMode,
  theme,
  editGoal,
}: {
  show: boolean;
  onClose: () => void;
  darkMode: boolean;
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
            className={`relative z-10 w-full max-w-sm flex flex-col ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-3xl shadow-2xl`}
            style={{ maxHeight: '80vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex-shrink-0 px-6 pt-5 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">
                  {editGoal ? 'Editar Meta' : 'Nova Meta'}
                </h3>
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
              {error && (
                <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Nome da Meta
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(null); }}
                    placeholder="Ex: Viagem para Paris"
                    className={`w-full p-4 rounded-2xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'
                    } focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Valor da Meta
                  </label>
                  <CurrencyInput
                    value={targetAmount}
                    onValueChange={(value) => { setTargetAmount(value || ''); setError(null); }}
                    prefix="R$ "
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                    placeholder="R$ 0,00"
                    className={`w-full p-4 rounded-2xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'
                    } focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-xl`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Valor Atual (já economizado)
                  </label>
                  <CurrencyInput
                    value={currentAmount}
                    onValueChange={(value) => setCurrentAmount(value || '')}
                    prefix="R$ "
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                    placeholder="R$ 0,00"
                    className={`w-full p-4 rounded-2xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'
                    } focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-xl`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 theme-primary text-white rounded-2xl font-bold shadow-lg mt-2 active:scale-95 transition-all"
                >
                  {editGoal ? 'Atualizar Meta' : 'Criar Meta'}
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
