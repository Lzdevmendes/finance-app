import type { RecurringFrequency } from '../../types';

/** Conta fixa / assinatura cadastrada pelo usuário (UI-first em localStorage; Firestore no R14). */
export interface Recurrence {
  id: string;
  name: string;
  value: number;
  frequency: RecurringFrequency;
  dueDay: number; // dia do vencimento (1–31)
}
