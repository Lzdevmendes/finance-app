import React, { createContext, useContext, useEffect } from 'react';
import { useFinance } from './FinanceContext';
import { ThemeName } from '../types';

interface ThemeContextType {
  theme: ThemeName;
  darkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// As cores do tema vivem em CSS (src/styles/theme.css): o modo é a classe `.dark`
// e o accent é o atributo `data-accent`. Aqui só aplicamos esses dois seletores
// ao <html> — zero hex em JS — e persistimos as preferências para reload imediato.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { preferences } = useFinance();

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle('dark', preferences.darkMode);
    root.setAttribute('data-accent', preferences.theme);

    localStorage.setItem('finance-app-preferences', JSON.stringify(preferences));
  }, [preferences]);

  return (
    <ThemeContext.Provider value={{ theme: preferences.theme, darkMode: preferences.darkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
