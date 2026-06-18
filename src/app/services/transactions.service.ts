// services/transactions.service.ts
// Camada de acesso a dados de transações. Único lugar autorizado a falar
// com o Firestore para a coleção de transações — a UI nunca chama o db direto.
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Transaction } from '../types';

const transactionsRef = (uid: string) => collection(db, 'users', uid, 'transactions');

export function subscribeTransactions(
  uid: string,
  onData: (transactions: Transaction[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(transactionsRef(uid), orderBy('date', 'desc')),
    (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Transaction[];
      onData(data);
    },
    onError,
  );
}

export function createTransaction(
  uid: string,
  transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>,
) {
  return addDoc(transactionsRef(uid), {
    ...transaction,
    userId: uid,
    createdAt: new Date().toISOString(),
  });
}

export function updateTransaction(uid: string, id: string, updates: Partial<Transaction>) {
  return updateDoc(doc(db, 'users', uid, 'transactions', id), updates);
}

export function deleteTransaction(uid: string, id: string) {
  return deleteDoc(doc(db, 'users', uid, 'transactions', id));
}
