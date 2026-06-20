import type { User } from 'firebase/auth';

/** Nome de exibição com fallback. */
export function getUserName(user: User | null): string {
  return user?.displayName?.trim() || 'Usuário';
}

/** Primeiro nome (para saudações no dashboard). */
export function getFirstName(user: User | null): string {
  return getUserName(user).split(/\s+/)[0];
}

/** Iniciais (até 2 letras) para avatares. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((w) => w[0]).join('');
  return (initials || 'U').toUpperCase();
}
