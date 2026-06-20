// services/recurrences.service.ts
// Recorrências (contas fixas / assinaturas) do usuário. paidMonths guarda as
// chaves "YYYY-M" já pagas. A UI nunca fala com o db direto.
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { RecurringFrequency } from '../types';

export interface RecurrenceDoc {
  id: string;
  userId: string;
  name: string;
  value: number;
  frequency: RecurringFrequency;
  dueDay: number;
  paidMonths: string[];
}

const recurrencesRef = (uid: string) => collection(db, 'users', uid, 'recurrences');

export function subscribeRecurrences(
  uid: string,
  onData: (items: RecurrenceDoc[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    recurrencesRef(uid),
    (snapshot) => {
      onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as RecurrenceDoc[]);
    },
    onError,
  );
}

export function createRecurrence(
  uid: string,
  data: Omit<RecurrenceDoc, 'id' | 'userId' | 'paidMonths'>,
) {
  return addDoc(recurrencesRef(uid), { ...data, userId: uid, paidMonths: [] });
}

export function updateRecurrence(uid: string, id: string, updates: Partial<RecurrenceDoc>) {
  return updateDoc(doc(db, 'users', uid, 'recurrences', id), updates);
}

export function deleteRecurrence(uid: string, id: string) {
  return deleteDoc(doc(db, 'users', uid, 'recurrences', id));
}
