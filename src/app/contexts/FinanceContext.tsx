import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Transaction, Goal, UserPreferences } from '../types';
import * as transactionsService from '../services/transactions.service';
import * as goalsService from '../services/goals.service';
import * as preferencesService from '../services/preferences.service';
import { logError } from '../utils/logger';

const DEFAULT_PREFERENCES: UserPreferences = { theme: 'emerald', darkMode: false, currency: 'BRL' };

interface FinanceContextType {
  transactions: Transaction[];
  goals: Goal[];
  preferences: UserPreferences;
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setGoals([]);
      setPreferences(DEFAULT_PREFERENCES);
      setLoading(false);
      return;
    }

    const unsubTrans = transactionsService.subscribeTransactions(
      user.uid,
      setTransactions,
      (err) => logError('Erro transações:', err),
    );
    const unsubGoals = goalsService.subscribeGoals(
      user.uid,
      setGoals,
      (err) => logError('Erro metas:', err),
    );
    const unsubPrefs = preferencesService.subscribePreferences(
      user.uid,
      setPreferences,
      (err) => logError('Erro preferências:', err),
    );

    setLoading(false);

    return () => {
      unsubTrans();
      unsubGoals();
      unsubPrefs();
    };
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    await transactionsService.createTransaction(user.uid, transaction);
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!user) return;
    await transactionsService.updateTransaction(user.uid, id, updates);
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    await transactionsService.deleteTransaction(user.uid, id);
  };

  const addGoal = async (goal: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    await goalsService.createGoal(user.uid, goal);
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (!user) return;
    await goalsService.updateGoal(user.uid, id, updates);
  };

  const deleteGoal = async (id: string) => {
    if (!user) return;
    await goalsService.deleteGoal(user.uid, id);
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return;
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated); // otimista — ThemeProvider reage à mudança
    await preferencesService.savePreferences(user.uid, updated);
  };

  const refreshData = async () => {
    // Dados são atualizados automaticamente via onSnapshot
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        goals,
        preferences,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
        updatePreferences,
        refreshData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
