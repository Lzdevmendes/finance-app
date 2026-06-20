import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../contexts/NavigationContext';
import { useFinance } from '../contexts/FinanceContext';
import { TransactionModal } from '../components/modals/TransactionModal';
import { BottomNav } from '../components/BottomNav';
import { MoreScreen } from './more/MoreScreen';
import { OnboardingScreen } from './onboarding/OnboardingScreen';

// Onboarding aparece p/ usuário sem transações; ao concluir/pular grava um flag
// local (sem novo schema no Firestore) p/ não repetir nem piscar no reload.
const ONBOARDED_KEY = 'finance-app-onboarded';

// Cada tela pesada carregada sob demanda (a do dashboard puxa o chunk do recharts).
const Dashboard = lazy(() => import('./dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const TransactionsScreen = lazy(() =>
  import('./transactions/TransactionsScreen').then((m) => ({ default: m.TransactionsScreen })),
);
const GoalsScreen = lazy(() => import('./goals/GoalsScreen').then((m) => ({ default: m.GoalsScreen })));
const SettingsScreen = lazy(() => import('./settings/SettingsScreen').then((m) => ({ default: m.SettingsScreen })));
const BudgetsScreen = lazy(() => import('./budgets/BudgetsScreen').then((m) => ({ default: m.BudgetsScreen })));
const ReportsScreen = lazy(() => import('./reports/ReportsScreen').then((m) => ({ default: m.ReportsScreen })));
const AccountsScreen = lazy(() => import('./accounts/AccountsScreen').then((m) => ({ default: m.AccountsScreen })));
const RecurrencesScreen = lazy(() => import('./recurrences/RecurrencesScreen').then((m) => ({ default: m.RecurrencesScreen })));

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
  const { preferences, transactions, loading } = useFinance();
  const { screen } = useNavigation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [onboardDismissed, setOnboardDismissed] = useState(
    () => localStorage.getItem(ONBOARDED_KEY) === '1',
  );

  const showOnboarding = !loading && !onboardDismissed && transactions.length === 0;

  const dismissOnboarding = () => {
    localStorage.setItem(ONBOARDED_KEY, '1');
    setOnboardDismissed(true);
  };

  if (showOnboarding) {
    return <OnboardingScreen onDone={dismissOnboarding} />;
  }

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
              {screen === 'budgets' && <BudgetsScreen />}
              {screen === 'more' && <MoreScreen />}
              {screen === 'goals' && <GoalsScreen />}
              {screen === 'reports' && <ReportsScreen />}
              {screen === 'accounts' && <AccountsScreen />}
              {screen === 'recurrences' && <RecurrencesScreen />}
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
