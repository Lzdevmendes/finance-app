import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../contexts/NavigationContext';
import { useFinance } from '../contexts/FinanceContext';
import { TransactionModal } from '../components/modals/TransactionModal';
import { BottomNav } from '../components/BottomNav';
import { MoreScreen } from './more/MoreScreen';
import { ComingSoon } from '../components/ComingSoon';

// Cada tela pesada carregada sob demanda (a do dashboard puxa o chunk do recharts).
const Dashboard = lazy(() => import('./dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const TransactionsScreen = lazy(() =>
  import('./transactions/TransactionsScreen').then((m) => ({ default: m.TransactionsScreen })),
);
const GoalsScreen = lazy(() => import('./goals/GoalsScreen').then((m) => ({ default: m.GoalsScreen })));
const SettingsScreen = lazy(() => import('./settings/SettingsScreen').then((m) => ({ default: m.SettingsScreen })));

function ScreenFallback() {
  return (
    <div className="flex justify-center py-24">
      <div
        className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent"
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
      />
    </div>
  );
}

export function MainApp() {
  const { preferences } = useFinance();
  const { screen } = useNavigation();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <main className="max-w-md mx-auto">
        <Suspense fallback={<ScreenFallback />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {screen === 'dashboard' && <Dashboard />}
              {screen === 'transactions' && <TransactionsScreen />}
              {screen === 'budgets' && (
                <ComingSoon
                  title="Orçamentos"
                  emoji="🎯"
                  description="Defina limites por categoria e acompanhe seus gastos em tempo real."
                />
              )}
              {screen === 'more' && <MoreScreen />}
              {screen === 'goals' && <GoalsScreen />}
              {screen === 'reports' && (
                <ComingSoon
                  title="Relatórios"
                  emoji="📊"
                  description="Score de saúde financeira, fluxo de caixa e seus maiores gastos."
                  back="more"
                />
              )}
              {screen === 'accounts' && (
                <ComingSoon
                  title="Contas & Cartões"
                  emoji="💳"
                  description="Saldos das contas e o controle da fatura do seu cartão."
                  back="more"
                />
              )}
              {screen === 'recurrences' && (
                <ComingSoon
                  title="Recorrências"
                  emoji="🔁"
                  description="Suas contas fixas e assinaturas, com status de pagamento."
                  back="more"
                />
              )}
              {screen === 'settings' && <SettingsScreen />}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      <BottomNav onFabPress={() => setShowAddModal(true)} />

      <TransactionModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        darkMode={preferences.darkMode}
      />
    </div>
  );
}
