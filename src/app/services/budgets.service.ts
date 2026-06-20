// services/budgets.service.ts
// Camada de acesso a dados dos orçamentos (limite por categoria).
// Doc id = valor da categoria. A UI nunca fala com o db direto.
import { collection, doc, setDoc, deleteDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface BudgetDoc {
  category: string;
  limit: number;
  userId: string;
}

const budgetsRef = (uid: string) => collection(db, 'users', uid, 'budgets');

export function subscribeBudgets(
  uid: string,
  onData: (budgets: Record<string, number>) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    budgetsRef(uid),
    (snapshot) => {
      const map: Record<string, number> = {};
      snapshot.docs.forEach((d) => {
        const data = d.data() as BudgetDoc;
        map[d.id] = data.limit;
      });
      onData(map);
    },
    onError,
  );
}

export function saveBudget(uid: string, category: string, limit: number) {
  return setDoc(doc(db, 'users', uid, 'budgets', category), { category, limit, userId: uid });
}

export function deleteBudget(uid: string, category: string) {
  return deleteDoc(doc(db, 'users', uid, 'budgets', category));
}
