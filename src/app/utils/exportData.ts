// utils/exportData.ts - Exportação de dados financeiros (JSON e CSV).
import type { User } from '../services/auth.service';
import { Transaction, Goal, UserPreferences } from '../types';

function downloadBlob(blob: Blob, filename?: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  if (filename) a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(
  user: User | null,
  preferences: UserPreferences,
  transactions: Transaction[],
  goals: Goal[],
) {
  const data = {
    user: {
      id: user?.uid,
      email: user?.email,
      displayName: user?.displayName,
      photoURL: user?.photoURL,
      createdAt: user?.metadata?.creationTime,
      lastLogin: user?.metadata?.lastSignInTime,
    },
    preferences,
    transactions: transactions.map((t) => ({
      id: t.id,
      date: t.date,
      description: t.description,
      type: t.type,
      value: t.value,
      category: t.category,
      account: t.account,
      tags: t.tags,
      createdAt: t.createdAt,
    })),
    goals: goals.map((g) => ({
      id: g.id,
      title: g.name,
      target: g.targetAmount,
      current: g.currentAmount,
      deadline: g.deadline,
      icon: g.icon,
      color: g.color,
      createdAt: g.createdAt,
    })),
    exportDate: new Date().toISOString(),
    version: '1.0.0',
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, `financas-pro-backup-${new Date().toISOString().split('T')[0]}.json`);
}

export function exportToCSV(transactions: Transaction[]) {
  const headers = ['Data', 'Descrição', 'Tipo', 'Valor', 'Categoria', 'Conta', 'Tags', 'Mês/Ano'];

  const rows = transactions.map((t) => [
    new Date(t.date).toLocaleDateString('pt-BR'),
    t.description,
    t.type === 'income' ? 'Receita' : 'Despesa',
    t.value.toFixed(2).replace('.', ','),
    t.category,
    t.account,
    t.tags.join('; '),
    new Date(t.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
  ]);

  // Adicionar linha em branco
  rows.push(['', '', '', '', '', '', '', '']);

  // Adicionar resumo mensal
  const monthlySummary = transactions.reduce((acc, t) => {
    const monthYear = new Date(t.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) {
      acc[monthYear] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      acc[monthYear].income += t.value;
    } else {
      acc[monthYear].expense += t.value;
    }
    return acc;
  }, {} as Record<string, { income: number; expense: number }>);

  rows.push(['RESUMO MENSAL', '', '', '', '', '', '', '']);
  rows.push(['Mês/Ano', 'Receitas', 'Despesas', 'Saldo', '', '', '', '']);

  Object.entries(monthlySummary).forEach(([month, data]) => {
    const balance = data.income - data.expense;
    rows.push([
      month,
      data.income.toFixed(2).replace('.', ','),
      data.expense.toFixed(2).replace('.', ','),
      balance.toFixed(2).replace('.', ','),
      '', '', '', '',
    ]);
  });

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob);
}
