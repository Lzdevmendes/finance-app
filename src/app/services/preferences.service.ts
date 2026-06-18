// services/preferences.service.ts
// Camada de acesso a dados de preferências do usuário.
import { doc, onSnapshot, setDoc, type Unsubscribe } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserPreferences } from '../types';

const preferencesRef = (uid: string) => doc(db, 'users', uid, 'preferences', 'settings');

export function subscribePreferences(
  uid: string,
  onData: (preferences: UserPreferences) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    preferencesRef(uid),
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as UserPreferences);
      }
    },
    onError,
  );
}

export function savePreferences(uid: string, preferences: UserPreferences) {
  return setDoc(preferencesRef(uid), preferences);
}
