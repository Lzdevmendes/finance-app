// utils/logger.ts
// Logger condicional: só emite em desenvolvimento. Em produção vira no-op,
// evitando vazar dados/ruído no console do usuário final.
const isDev = import.meta.env.DEV;

export function logError(...args: unknown[]) {
  if (isDev) console.error(...args);
}

export function logWarn(...args: unknown[]) {
  if (isDev) console.warn(...args);
}

export function logInfo(...args: unknown[]) {
  if (isDev) console.info(...args);
}
