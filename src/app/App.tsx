import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FinanceProvider } from './contexts/FinanceContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthScreen } from './screens/auth/AuthScreen';

// Área autenticada carregada sob demanda (mantém recharts/dashboard fora do
// bundle inicial — quem está no login não baixa o app inteiro).
const MainApp = lazy(() => import('./screens/MainApp').then((m) => ({ default: m.MainApp })));

function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Carregando...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  if (loading) {
    return <LoadingScreen />;
  }
  if (!user) {
    return <AuthScreen />;
  }
  return (
    <FinanceProvider>
      <ThemeProvider>
        <Suspense fallback={<LoadingScreen />}>
          <MainApp />
        </Suspense>
      </ThemeProvider>
    </FinanceProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
