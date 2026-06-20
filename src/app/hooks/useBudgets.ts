import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logError } from '../utils/logger';
import { subscribeBudgets, saveBudget, deleteBudget } from '../services/budgets.service';

type Budgets = Record<string, number>;

/**
 * Orçamentos no Firestore. Migra uma única vez os dados antigos do localStorage
 * (gravados pela versão UI-first) e depois usa só o Firestore.
 */
export function useBudgets() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [budgets, setBudgets] = useState<Budgets>({});

  useEffect(() => {
    if (!uid) return;
    migrateLegacy(uid);
    return subscribeBudgets(uid, setBudgets, (err) => logError('subscribeBudgets', err));
  }, [uid]);

  return {
    budgets,
    setBudget: (category: string, limit: number) => {
      if (uid) saveBudget(uid, category, limit).catch((e) => logError('saveBudget', e));
    },
    removeBudget: (category: string) => {
      if (uid) deleteBudget(uid, category).catch((e) => logError('deleteBudget', e));
    },
  };
}

function migrateLegacy(uid: string) {
  const flag = `finance-app:migrated:budgets:${uid}`;
  if (localStorage.getItem(flag)) return;
  try {
    const raw = localStorage.getItem(`finance-app:budgets:${uid}`);
    const local = raw ? (JSON.parse(raw) as Budgets) : {};
    Object.entries(local).forEach(([cat, limit]) => {
      if (typeof limit === 'number' && limit > 0) saveBudget(uid, cat, limit).catch(() => {});
    });
  } catch (err) {
    logError('migrateLegacy budgets', err);
  }
  localStorage.setItem(flag, '1');
}
