import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Calendar, Target, Settings, Plus } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { TransactionModal } from '../components/modals/TransactionModal';
import { themes } from '../constants/ui';

// Cada tela carregada sob demanda (a do dashboard puxa o chunk do recharts).
const Dashboard = lazy(() => import('./dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const TransactionsScreen = lazy(() => import('./transactions/TransactionsScreen').then((m) => ({ default: m.TransactionsScreen })));
const GoalsScreen = lazy(() => import('./goals/GoalsScreen').then((m) => ({ default: m.GoalsScreen })));
const SettingsScreen = lazy(() => import('./settings/SettingsScreen').then((m) => ({ default: m.SettingsScreen })));

function ScreenFallback() {
  return (
    <div className="flex justify-center py-20 opacity-60">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent" />
    </div>
  );
}

export function MainApp() {
  const { preferences } = useFinance();
  const { theme, darkMode } = preferences;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const tabs = [
    { id: 'dashboard', label: 'Início', icon: Wallet },
    { id: 'transactions', label: 'Extrato', icon: Calendar },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];
  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      } transition-colors duration-300`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-10 ${
          darkMode ? 'bg-gray-800/80' : 'bg-white/80'
        } backdrop-blur-sm p-5 flex justify-between items-center border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-100'
        } rounded-b-3xl shadow-sm`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${themes[theme].primary} text-white shadow-lg`}
          >
            <Wallet size={20} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Finanças Pro</h2>
            <p className="text-xs opacity-60">
              {tabs.find((t) => t.id === activeTab)?.label}
            </p>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="fixed top-20 left-0 right-0 overflow-y-auto scrollbar-hide p-4 max-w-md mx-auto" style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
        <Suspense fallback={<ScreenFallback />}>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <Dashboard key="dashboard" />}
            {activeTab === 'transactions' && <TransactionsScreen key="transactions" />}
            {activeTab === 'goals' && <GoalsScreen key="goals" />}
            {activeTab === 'settings' && <SettingsScreen key="settings" />}
          </AnimatePresence>
        </Suspense>
      </main>
      {/* Floating Action Button - Only show on dashboard */}
      {activeTab === 'dashboard' && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddModal(true)}
          className="fixed right-6 w-16 h-16 rounded-full theme-primary text-white shadow-2xl flex items-center justify-center z-40 will-change-transform"
          style={{ bottom: 'calc(5.5rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <Plus size={28} />
        </motion.button>
      )}
      {/* Bottom Navigation */}
      <nav
        className={`fixed bottom-0 left-0 right-0 ${
          darkMode ? 'bg-gray-800/80' : 'bg-white/80'
        } backdrop-blur-sm border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-100'
        } px-6 pt-3 flex justify-between items-center z-50 rounded-t-[2.5rem] shadow-lg`}
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all will-change-transform ${
              activeTab === tab.id
                ? `${themes[theme].text} ${themes[theme].light} ${themes[theme].darkLight}`
                : 'text-gray-400'
            }`}
          >
            <tab.icon size={22} />
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </nav>
      {/* Transaction Modal */}
      <TransactionModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        darkMode={darkMode}
      />
    </div>
  );
}
