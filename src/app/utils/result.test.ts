import { describe, it, expect } from 'vitest';
import { ok, err } from './result';

describe('Result', () => {
  it('ok() encapsula um valor de sucesso', () => {
    const r = ok(42);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(42);
  });

  it('err() normaliza qualquer valor para Error', () => {
    const r = err('boom');
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).toBeInstanceOf(Error);
      expect(r.error.message).toBe('boom');
    }
  });

  it('err() preserva um Error existente', () => {
    const original = new Error('falha');
    const r = err(original);
    if (!r.ok) expect(r.error).toBe(original);
  });
});
