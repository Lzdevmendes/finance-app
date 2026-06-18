// services/auth.service.ts
// Camada de acesso ao Firebase Auth + Storage de avatar. A UI nunca importa
// firebase/auth direto — passa sempre por aqui (ou pelo AuthContext).
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../config/firebase';

export type { User };

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function signUp(email: string, password: string, name?: string): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(user, { displayName: name });
  }
  return user;
}

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOut() {
  return firebaseSignOut(auth);
}

export async function updateUserProfile(
  user: User,
  updates: { displayName?: string; photoURL?: string },
) {
  await updateProfile(user, updates);
  await auth.currentUser?.reload();
  return auth.currentUser;
}

export function updateUserEmail(user: User, newEmail: string) {
  return updateEmail(user, newEmail);
}

export function updateUserPassword(user: User, newPassword: string) {
  return updatePassword(user, newPassword);
}

export function reauthenticate(user: User, currentPassword: string) {
  const credential = EmailAuthProvider.credential(user.email ?? '', currentPassword);
  return reauthenticateWithCredential(user, credential);
}

export async function uploadProfileImage(user: User, file: File): Promise<string> {
  const storageRef = ref(storage, `profile-images/${user.uid}`);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  await updateProfile(user, { photoURL: url });
  return url;
}
