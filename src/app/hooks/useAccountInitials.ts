import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logError } from '../utils/logger';
import { subscribeAccountInitials, saveAccountInitial } from '../services/accounts.service';
import type { AccountType } from '../types';

type Initials = Partial<Record<AccountType, number>>;

/** Saldos iniciais por conta no Firestore, com migração única do localStorage. */
export function useAccountInitials() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [initials, setInitials] = useState<Initials>({});

  useEffect(() => {
    if (!uid) return;
    migrateLegacy(uid);
    return subscribeAccountInitials(uid, setInitials, (err) => logError('subscribeAccountInitials', err));
  }, [uid]);

  return {
    initials,
    setInitial: (type: AccountType, value: number) => {
      if (uid) saveAccountInitial(uid, type, value).catch((e) => logError('saveAccountInitial', e));
    },
  };
}

function migrateLegacy(uid: string) {
  const flag = `finance-app:migrated:account-initials:${uid}`;
  if (localStorage.getItem(flag)) return;
  try {
    const raw = localStorage.getItem(`finance-app:account-initials:${uid}`);
    const local = raw ? (JSON.parse(raw) as Initials) : {};
    (Object.entries(local) as [AccountType, number][]).forEach(([type, value]) => {
      if (typeof value === 'number') saveAccountInitial(uid, type, value).catch(() => {});
    });
  } catch (err) {
    logError('migrateLegacy account-initials', err);
  }
  localStorage.setItem(flag, '1');
}
