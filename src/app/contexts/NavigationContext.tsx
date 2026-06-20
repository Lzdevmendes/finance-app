import React, { createContext, useContext, useState, useCallback } from 'react';

// Roteamento por estado (sem React Router, decisão do redesign). As telas do hub
// "Mais" (goals/reports/accounts/recurrences/settings) mantêm o item "Mais" ativo.
export type AppScreen =
  | 'dashboard'
  | 'transactions'
  | 'budgets'
  | 'more'
  | 'goals'
  | 'reports'
  | 'accounts'
  | 'recurrences'
  | 'settings';

/** Telas agrupadas sob o hub "Mais" (header com voltar → 'more'). */
export const MORE_HUB_SCREENS: AppScreen[] = [
  'more',
  'goals',
  'reports',
  'accounts',
  'recurrences',
  'settings',
];

interface NavigationContextType {
  screen: AppScreen;
  navigate: (screen: AppScreen) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<AppScreen>('dashboard');
  const navigate = useCallback((next: AppScreen) => setScreen(next), []);

  return (
    <NavigationContext.Provider value={{ screen, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
