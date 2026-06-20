// services/accounts.service.ts
// Saldo inicial por conta (doc id = tipo da conta). Demais dados de Account
// (limite/vencimento) ficam para uma evolução futura; aqui só o saldo inicial.
import { collection, doc, setDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { AccountType } from '../types';

export interface AccountInitialDoc {
  type: AccountType;
  initialBalance: number;
  userId: string;
}

type Initials = Partial<Record<AccountType, number>>;

const accountsRef = (uid: string) => collection(db, 'users', uid, 'accounts');

export function subscribeAccountInitials(
  uid: string,
  onData: (initials: Initials) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    accountsRef(uid),
    (snapshot) => {
      const map: Initials = {};
      snapshot.docs.forEach((d) => {
        const data = d.data() as AccountInitialDoc;
        map[data.type] = data.initialBalance;
      });
      onData(map);
    },
    onError,
  );
}

export function saveAccountInitial(uid: string, type: AccountType, initialBalance: number) {
  return setDoc(doc(db, 'users', uid, 'accounts', type), { type, initialBalance, userId: uid });
}
