import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionForm } from './TransactionForm';

const addTransaction = vi.fn().mockResolvedValue(undefined);

vi.mock('../../contexts/FinanceContext', () => ({
  useFinance: () => ({ addTransaction, transactions: [] }),
}));

describe('TransactionForm (validação)', () => {
  beforeEach(() => addTransaction.mockClear());

  it('bloqueia submit sem descrição e não chama addTransaction', () => {
    const onClose = vi.fn();
    const { container } = render(<TransactionForm darkMode={false} onClose={onClose} />);
    fireEvent.submit(container.querySelector('form')!);

    expect(screen.getByText('Descrição é obrigatória')).toBeTruthy();
    expect(addTransaction).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('com descrição mas sem valor, exige valor maior que zero', () => {
    render(<TransactionForm darkMode={false} onClose={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/Almoço, Transporte/i), {
      target: { value: 'Mercado' },
    });
    fireEvent.submit(document.querySelector('form')!);

    expect(screen.getByText('Valor deve ser maior que zero')).toBeTruthy();
    expect(addTransaction).not.toHaveBeenCalled();
  });
});
