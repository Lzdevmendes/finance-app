import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTransactionStats } from './useTransactionStats';
import { Transaction, TransactionType, CategoryType, AccountType } from '../types';

const tx = (over: Partial<Transaction>): Transaction => ({
  id: Math.random().toString(),
  userId: 'u1',
  description: 'x',
  value: 0,
  type: TransactionType.EXPENSE,
  category: CategoryType.FOOD,
  tags: [],
  account: AccountType.CHECKING,
  date: '2026-06-10T12:00:00.000Z',
  createdAt: '2026-06-10T12:00:00.000Z',
  ...over,
});

// Conjunto: junho/2026 tem 1 receita (1000) e 2 despesas (200 + 300); maio é ignorado.
const transactions: Transaction[] = [
  tx({ type: TransactionType.INCOME, value: 1000, category: CategoryType.SALARY, date: '2026-06-10T12:00:00.000Z' }),
  tx({ type: TransactionType.EXPENSE, value: 200, category: CategoryType.FOOD, date: '2026-06-12T12:00:00.000Z' }),
  tx({ type: TransactionType.EXPENSE, value: 300, category: CategoryType.FOOD, date: '2026-06-15T12:00:00.000Z' }),
  tx({ type: TransactionType.INCOME, value: 500, date: '2026-05-01T12:00:00.000Z' }),
];

vi.mock('../contexts/FinanceContext', () => ({
  useFinance: () => ({ transactions }),
}));

describe('useTransactionStats (lógica financeira)', () => {
  it('soma receitas, despesas e saldo do mês selecionado', () => {
    const { result } = renderHook(() => useTransactionStats(6, 2026));
    const { stats } = result.current;
    expect(stats.totalIncome).toBe(1000);
    expect(stats.totalExpenses).toBe(500);
    expect(stats.balance).toBe(500);
    expect(stats.transactionCount).toBe(3);
    expect(stats.incomeCount).toBe(1);
    expect(stats.expenseCount).toBe(2);
    expect(stats.largestIncome).toBe(1000);
    expect(stats.largestExpense).toBe(300);
  });

  it('agrupa despesas por categoria com percentual', () => {
    const { result } = renderHook(() => useTransactionStats(6, 2026));
    const food = result.current.categoryData.find((c) => c.category === CategoryType.FOOD);
    expect(food?.value).toBe(500);
    expect(food?.percentage).toBeCloseTo(100);
  });

  it('ignora transações de outros meses', () => {
    const { result } = renderHook(() => useTransactionStats(5, 2026));
    // maio só tem a receita de 500
    expect(result.current.stats.totalIncome).toBe(500);
    expect(result.current.stats.totalExpenses).toBe(0);
  });
});
