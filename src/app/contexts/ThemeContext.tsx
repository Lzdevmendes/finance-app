import React, { createContext, useContext, useEffect } from 'react';
import { useFinance } from './FinanceContext';
import { ThemeName } from '../types';

interface ThemeColors {
  primary: string;
  primaryHover: string;
  light: string;
  gradient: string;
}

// Cores CSS aplicadas via custom properties (--theme-*). Antes viviam dentro
// do FinanceContext; isoladas aqui para separar dado (Firestore) de tema (DOM).
const THEME_CSS_VARS: Record<ThemeName, ThemeColors> = {
  emerald: {
    primary: '#10b981',
    primaryHover: '#059669',
    light: '#ecfdf5',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  blue: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    light: '#eff6ff',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  },
  purple: {
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    light: '#faf5ff',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  },
  rose: {
    primary: '#f43f5e',
    primaryHover: '#e11d48',
    light: '#fff1f2',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
  },
};

interface ThemeContextType {
  theme: ThemeName;
  darkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { preferences } = useFinance();

  useEffect(() => {
    const root = document.documentElement;

    if (preferences.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    const colors = THEME_CSS_VARS[preferences.theme];
    if (colors) {
      root.style.setProperty('--theme-primary', colors.primary);
      root.style.setProperty('--theme-primary-hover', colors.primaryHover);
      root.style.setProperty('--theme-light', colors.light);
      root.style.setProperty('--theme-gradient', colors.gradient);
    }

    // Persistido para aplicação imediata do tema no reload da página
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
