import { useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logError } from '../utils/logger';

/**
 * Estado persistido em localStorage, chaveado por uid para isolar dados entre
 * contas no mesmo dispositivo. Solução UI-first: migra para Firestore no R14.
 */
export function useLocalStorage<T>(key: string, initial: T): [T, (next: T | ((prev: T) => T)) => void] {
  const { user } = useAuth();
  const storageKey = `finance-app:${key}:${user?.uid ?? 'anon'}`;

  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch (err) {
      logError('useLocalStorage read', err);
      return initial;
    }
  });

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(storageKey, JSON.stringify(resolved));
        } catch (err) {
          logError('useLocalStorage write', err);
        }
        return resolved;
      });
    },
    [storageKey],
  );

  return [value, update];
}
