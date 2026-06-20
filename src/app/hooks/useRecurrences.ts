import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logError } from '../utils/logger';
import {
  subscribeRecurrences,
  createRecurrence,
  updateRecurrence,
  deleteRecurrence,
  type RecurrenceDoc,
} from '../services/recurrences.service';
import type { Recurrence } from '../screens/recurrences/types';

/** Recorrências no Firestore, com migração única do localStorage (lista + pagos). */
export function useRecurrences() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [items, setItems] = useState<RecurrenceDoc[]>([]);

  useEffect(() => {
    if (!uid) return;
    migrateLegacy(uid);
    return subscribeRecurrences(uid, setItems, (err) => logError('subscribeRecurrences', err));
  }, [uid]);

  return {
    items,
    save: (data: Omit<Recurrence, 'id'>, id?: string) => {
      if (!uid) return;
      if (id) updateRecurrence(uid, id, data).catch((e) => logError('updateRecurrence', e));
      else createRecurrence(uid, data).catch((e) => logError('createRecurrence', e));
    },
    remove: (id: string) => {
      if (uid) deleteRecurrence(uid, id).catch((e) => logError('deleteRecurrence', e));
    },
    togglePaid: (id: string, monthKey: string) => {
      if (!uid) return;
      const current = items.find((r) => r.id === id);
      if (!current) return;
      const paidMonths = current.paidMonths ?? [];
      const next = paidMonths.includes(monthKey)
        ? paidMonths.filter((k) => k !== monthKey)
        : [...paidMonths, monthKey];
      updateRecurrence(uid, id, { paidMonths: next }).catch((e) => logError('togglePaid', e));
    },
  };
}

function migrateLegacy(uid: string) {
  const flag = `finance-app:migrated:recurrences:${uid}`;
  if (localStorage.getItem(flag)) return;
  try {
    const rawItems = localStorage.getItem(`finance-app:recurrences:${uid}`);
    const rawPaid = localStorage.getItem(`finance-app:recurrences-paid:${uid}`);
    const local = rawItems ? (JSON.parse(rawItems) as Recurrence[]) : [];
    const paid = rawPaid ? (JSON.parse(rawPaid) as string[]) : [];
    local.forEach((r) => {
      // chaves de pagamento eram "id:YYYY-M"; converte para o sufixo do mês.
      const paidMonths = paid.filter((k) => k.startsWith(`${r.id}:`)).map((k) => k.split(':')[1]);
      createRecurrence(uid, {
        name: r.name,
        value: r.value,
        frequency: r.frequency,
        dueDay: r.dueDay,
      })
        .then((ref) => (paidMonths.length ? updateRecurrence(uid, ref.id, { paidMonths }) : undefined))
        .catch(() => {});
    });
  } catch (err) {
    logError('migrateLegacy recurrences', err);
  }
  localStorage.setItem(flag, '1');
}
