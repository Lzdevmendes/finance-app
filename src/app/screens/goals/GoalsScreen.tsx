import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Pencil, Trash2, X } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';
import { useFinance } from '../../contexts/FinanceContext';
import { GoalModal } from '../../components/modals/GoalModal';
import { ScreenHeader } from '../../components/ScreenHeader';
import { formatMoney } from '../../utils/format';
import { Goal } from '../../types';

export function GoalsScreen() {
  const { goals, transactions, deleteGoal, updateGoal, preferences } = useFinance();
  const { theme } = preferences;
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressGoal, setProgressGoal] = useState<Goal | null>(null);
  const [progressAmount, setProgressAmount] = useState('');
  // Calculate monthly savings average
  const monthlySavings = useMemo(() => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
    const recentTransactions = transactions.filter(
      (t) => new Date(t.date) >= threeMonthsAgo
    );
    const income = recentTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.value, 0);
    const expenses = recentTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.value, 0);
    return (income - expenses) / 3;
  }, [transactions]);
  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setShowGoalModal(true);
  };
  const handleAddProgress = (goal: Goal) => {
    setProgressGoal(goal);
    setProgressAmount('');
    setShowProgressModal(true);
  };
  const handleSaveProgress = async () => {
    if (!progressGoal || !progressAmount) return;

    const newAmount = progressGoal.currentAmount + parseFloat(progressAmount);
    await updateGoal(progressGoal.id, {
      currentAmount: newAmount,
    });

    setShowProgressModal(false);
    setProgressGoal(null);
    setProgressAmount('');
  };
  const handleCloseModal = () => {
    setEditingGoal(null);
    setShowGoalModal(false);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-[22px] pb-28 pt-2 space-y-4"
    >
      <ScreenHeader
        title="Metas"
        back="more"
        action={
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setShowGoalModal(true)}
            className="px-3.5 py-2 rounded-[13px] text-[13.5px] font-semibold flex-none"
            style={{ background: 'var(--accent)', color: 'var(--accent-on)' }}
          >
            Nova meta
          </motion.button>
        }
      />

      <div className="grid gap-3">
        {goals.map((goal, index) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          const monthsToGoal =
            monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : 0;
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              className="p-5 rounded-[20px] border will-change-transform"
              style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-[46px] h-[46px] flex-none rounded-[14px] flex items-center justify-center"
                    style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                  >
                    <Target size={22} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[16px] truncate">{goal.name}</p>
                    <p className="text-[12.5px]" style={{ color: 'var(--faint)' }}>
                      Meta: {formatMoney(goal.targetAmount)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 flex-none">
                  <span className="font-bold text-[13px] tnum mr-1" style={{ color: 'var(--accent)' }}>
                    {progress.toFixed(0)}%
                  </span>
                  <button
                    onClick={() => handleAddProgress(goal)}
                    className="p-1.5 rounded-[9px]"
                    style={{ color: 'var(--accent)' }}
                    title="Adicionar progresso"
                  >
                    <Plus size={16} strokeWidth={2.4} />
                  </button>
                  <button
                    onClick={() => handleEdit(goal)}
                    className="p-1.5 rounded-[9px]"
                    style={{ color: 'var(--faint)' }}
                    aria-label="Editar"
                  >
                    <Pencil size={16} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Deseja excluir esta meta?')) {
                        deleteGoal(goal.id);
                      }
                    }}
                    className="p-1.5 rounded-[9px]"
                    style={{ color: 'var(--faint)' }}
                    aria-label="Excluir"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </div>
              </div>
              <div
                className="w-full rounded-full h-2.5 overflow-hidden mb-3"
                style={{ background: 'var(--surface2)' }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
              </div>
              <div className="flex justify-between text-[12.5px]" style={{ color: 'var(--muted)' }}>
                <span className="tnum">Economizado: {formatMoney(goal.currentAmount)}</span>
                {remaining > 0 && monthsToGoal > 0 && (
                  <span>
                    Faltam ~{monthsToGoal} {monthsToGoal === 1 ? 'mês' : 'meses'}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
        {goals.length === 0 && (
          <div className="text-center py-14" style={{ color: 'var(--faint)' }}>
            <div
              className="w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
            >
              <Target size={28} />
            </div>
            <p className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>
              Nenhuma meta criada
            </p>
            <p className="text-[13px] mt-1">Toque em "Nova meta" para começar</p>
          </div>
        )}
      </div>
      <GoalModal
        show={showGoalModal}
        onClose={handleCloseModal}
        theme={theme}
        editGoal={editingGoal}
      />

      {/* Progress Modal */}
      <AnimatePresence>
        {showProgressModal && progressGoal && (
          <div className="fixed inset-0 z-[1000]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setShowProgressModal(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 p-6 rounded-t-[28px] shadow-2xl z-[1001] border-t"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--line)',
                paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-12 h-1.5 rounded-full mx-auto mb-4"
                style={{ background: 'var(--line)' }}
              />
              <div className="flex items-center justify-between mb-6">
                <div className="min-w-0">
                  <h3 className="text-[18px] font-bold">Adicionar progresso</h3>
                  <p className="text-[13px] truncate" style={{ color: 'var(--muted)' }}>
                    {progressGoal.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowProgressModal(false)}
                  aria-label="Fechar"
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-none"
                  style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
                >
                  <X size={18} />
                </button>
              </div>
              <div
                className="w-fit mx-auto mb-6 p-3 rounded-[16px]"
                style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
              >
                <Target size={24} />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--muted)' }}>
                    Valor a adicionar (R$)
                  </label>
                  <CurrencyInput
                    value={progressAmount}
                    onValueChange={(value) => setProgressAmount(value || '')}
                    className="w-full p-3.5 rounded-[14px] border outline-none focus:ring-2 tnum"
                    style={{ background: 'var(--surface2)', borderColor: 'var(--line)', color: 'var(--text)' }}
                    placeholder="0,00"
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowProgressModal(false)}
                    className="flex-1 py-3 rounded-[14px] font-semibold border"
                    style={{ borderColor: 'var(--line)', color: 'var(--text)' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveProgress}
                    disabled={!progressAmount || parseFloat(progressAmount) <= 0}
                    className="flex-1 py-3 rounded-[14px] font-semibold disabled:opacity-50"
                    style={{ background: 'var(--accent)', color: 'var(--accent-on)' }}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
