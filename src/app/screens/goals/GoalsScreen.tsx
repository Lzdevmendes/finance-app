import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Edit, Trash2, X } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';
import { useFinance } from '../../contexts/FinanceContext';
import { GoalModal } from '../../components/modals/GoalModal';
import { themes } from '../../constants/ui';
import { Goal } from '../../types';

export function GoalsScreen() {
  const { goals, transactions, deleteGoal, updateGoal, preferences } = useFinance();
  const { theme, darkMode } = preferences;
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
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Metas</h3>
        <button
          onClick={() => setShowGoalModal(true)}
          className="theme-primary text-white px-4 py-2 rounded-xl font-semibold shadow-lg active:scale-95 transition-all"
        >
          Nova Meta
        </button>
      </div>
      <div className="grid gap-4">
        {goals.map((goal, index) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          const monthsToGoal =
            monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : 0;
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } p-5 rounded-3xl border will-change-transform ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              } shadow-sm`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`${themes[theme].light} ${themes[theme].text} p-3 rounded-2xl`}
                  >
                    <Target size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg">{goal.name}</p>
                    <p className="text-sm opacity-50">
                      Meta: R${' '}
                      {goal.targetAmount.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-emerald-500">
                    {progress.toFixed(0)}%
                  </span>
                  <button
                    onClick={() => handleAddProgress(goal)}
                    className="p-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200 text-emerald-500"
                    title="Adicionar progresso"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(goal)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 will-change-transform"
                  >
                    <Edit size={18} className="text-gray-600 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Deseja excluir esta meta?')) {
                        deleteGoal(goal.id);
                      }
                    }}
                    className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/20 rounded-lg transition-all duration-200 will-change-transform text-rose-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`${themes[theme].primary} h-full`}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">
                  Economizado: R${' '}
                  {goal.currentAmount.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </span>
                {remaining > 0 && monthsToGoal > 0 && (
                  <span className="opacity-70">
                    Faltam ~{monthsToGoal}{' '}
                    {monthsToGoal === 1 ? 'mês' : 'meses'}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
        {goals.length === 0 && (
          <div className="text-center py-12 opacity-50">
            <Target className="w-16 h-16 mx-auto mb-4" />
            <p>Nenhuma meta criada</p>
            <p className="text-sm">Clique em "Nova Meta" para começar</p>
          </div>
        )}
      </div>
      <GoalModal
        show={showGoalModal}
        onClose={handleCloseModal}
        darkMode={darkMode}
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
              className={`absolute bottom-0 left-0 right-0 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } p-6 rounded-t-[2rem] shadow-2xl z-[1001]`}
              style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">Adicionar Progresso</h3>
                  <p className="text-sm opacity-70">{progressGoal.name}</p>
                </div>
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className={`${themes[theme].light} ${themes[theme].text} p-3 rounded-2xl w-fit mx-auto mb-6`}>
                <Target size={24} />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Valor a adicionar (R$)</label>
                  <CurrencyInput
                    value={progressAmount}
                    onValueChange={(value) => setProgressAmount(value || '')}
                    className={`w-full p-3 rounded-xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } outline-none focus:ring-2 focus:ring-emerald-500`}
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
                    className={`flex-1 py-3 rounded-xl font-semibold border ${
                      darkMode ? 'border-gray-600' : 'border-gray-200'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveProgress}
                    disabled={!progressAmount || parseFloat(progressAmount) <= 0}
                    className={`${themes[theme].primary} flex-1 py-3 rounded-xl font-semibold text-white shadow-lg disabled:opacity-50`}
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
