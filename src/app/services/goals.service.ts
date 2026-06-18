// services/goals.service.ts
// Camada de acesso a dados de metas. A UI nunca fala com o Firestore direto.
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
import { Goal } from '../types';

const goalsRef = (uid: string) => collection(db, 'users', uid, 'goals');

export function subscribeGoals(
  uid: string,
  onData: (goals: Goal[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    goalsRef(uid),
    (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Goal[];
      onData(data);
    },
    onError,
  );
}

export function createGoal(uid: string, goal: Omit<Goal, 'id' | 'userId' | 'createdAt'>) {
  return addDoc(goalsRef(uid), {
    ...goal,
    userId: uid,
    createdAt: new Date().toISOString(),
  });
}

export function updateGoal(uid: string, id: string, updates: Partial<Goal>) {
  return updateDoc(doc(db, 'users', uid, 'goals', id), updates);
}

export function deleteGoal(uid: string, id: string) {
  return deleteDoc(doc(db, 'users', uid, 'goals', id));
}
