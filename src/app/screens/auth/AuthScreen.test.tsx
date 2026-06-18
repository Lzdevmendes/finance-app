import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthScreen } from './AuthScreen';

const signIn = vi.fn();
const signUp = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ signIn, signUp }),
}));

describe('AuthScreen (auth mockado)', () => {
  beforeEach(() => {
    signIn.mockReset();
    signUp.mockReset();
  });

  it('faz login chamando signIn com email e senha', async () => {
    signIn.mockResolvedValue({ ok: true, value: undefined });
    const { container } = render(<AuthScreen />);

    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), {
      target: { value: 'a@b.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'secret123' },
    });
    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => expect(signIn).toHaveBeenCalledWith('a@b.com', 'secret123'));
    expect(signUp).not.toHaveBeenCalled();
  });

  it('mostra mensagem de erro quando o login falha', async () => {
    signIn.mockResolvedValue({ ok: false, error: new Error('Credenciais inválidas') });
    const { container } = render(<AuthScreen />);

    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), {
      target: { value: 'a@b.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'wrong' },
    });
    fireEvent.submit(container.querySelector('form')!);

    expect(await screen.findByText('Credenciais inválidas')).toBeTruthy();
  });
});
