import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpCircle, ArrowDownCircle, History } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';
import { useFinance } from '../../contexts/FinanceContext';
import { TagInput } from '../TagInput';
import { categories } from '../../constants/ui';
import { TransactionType, CategoryType, AccountType } from '../../types';
import { logError } from '../../utils/logger';

const todayString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const fieldClass = 'w-full p-3.5 rounded-[14px] border outline-none transition-all focus:ring-2';
const fieldStyle = { background: 'var(--surface2)', borderColor: 'var(--line)', color: 'var(--text)' };
const labelClass = 'block text-[13px] font-medium mb-2';
const labelStyle = { color: 'var(--muted)' };

export function TransactionForm({ darkMode, onClose }: { darkMode: boolean; onClose: () => void }) {
  const { addTransaction, transactions } = useFinance();
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState<CategoryType>(CategoryType.OTHER);
  const [account, setAccount] = useState<AccountType>(AccountType.CHECKING);
  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState(todayString);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    setError(null);

    if (value.length > 2) {
      // Generate suggestions based on existing transactions
      const existingDescriptions = transactions
        .filter(t => t.type === type && t.description.toLowerCase().includes(value.toLowerCase()))
        .map(t => t.description)
        .filter((desc, index, arr) => arr.indexOf(desc) === index) // Remove duplicates
        .slice(0, 5); // Limit to 5 suggestions

      setSuggestions(existingDescriptions);
      setShowSuggestions(existingDescriptions.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setDescription(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const validateForm = () => {
    if (!description.trim()) {
      setError('Descrição é obrigatória');
      return false;
    }

    if (!value.trim() || parseFloat(value) <= 0) {
      setError('Valor deve ser maior que zero');
      return false;
    }

    if (!date) {
      setError('Data é obrigatória');
      return false;
    }

    if (date > todayString()) {
      setError('Data não pode ser no futuro');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setType(TransactionType.EXPENSE);
    setDescription('');
    setValue('');
    setCategory(CategoryType.OTHER);
    setAccount(AccountType.CHECKING);
    setTags([]);
    setDate(todayString());
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    const numericValue = parseFloat(String(value).replace(',', '.')) || 0;
    if (numericValue <= 0) {
      setError('Valor deve ser maior que zero');
      return;
    }

    // Fire-and-forget: fecha o modal imediatamente, Firebase sincroniza via onSnapshot
    addTransaction({
      description: description.trim(),
      value: numericValue,
      type,
      category,
      account,
      tags,
      date: new Date(date + 'T12:00:00').toISOString(),
    }).catch((err: unknown) => logError('Error saving transaction:', err));

    resetForm();
    onClose();
  };

  return (
    <>
      {error && (
        <div
          className="mx-6 mt-4 p-3 rounded-[12px] border"
          style={{ background: 'rgba(207,91,63,.1)', borderColor: 'rgba(207,91,63,.3)' }}
        >
          <p className="text-[13px] font-medium" style={{ color: 'var(--expense)' }}>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div
          className="grid grid-cols-2 gap-2 p-1 rounded-[16px]"
          style={{ background: 'var(--surface2)' }}
        >
          {[
            { t: TransactionType.INCOME, label: 'Receita', icon: ArrowUpCircle, color: 'var(--income)' },
            { t: TransactionType.EXPENSE, label: 'Despesa', icon: ArrowDownCircle, color: 'var(--expense)' },
          ].map((opt) => {
            const Icon = opt.icon;
            const active = type === opt.t;
            return (
              <button
                key={opt.t}
                type="button"
                onClick={() => setType(opt.t)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-[12px] font-bold text-[14px] transition-all"
                style={
                  active
                    ? { background: 'var(--surface)', color: opt.color, boxShadow: '0 2px 8px -2px rgba(0,0,0,.15)' }
                    : { color: 'var(--faint)' }
                }
              >
                <Icon size={18} />
                {opt.label}
              </button>
            );
          })}
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Descrição</label>
          <div className="relative">
            <input
              type="text"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder={type === 'income' ? 'Ex: Salário, Freelance, Dividendos...' : 'Ex: Almoço, Transporte, Compras...'}
              className={fieldClass}
              style={fieldStyle}
              required
            />
            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 border rounded-[14px] shadow-xl z-10 max-h-40 overflow-y-auto"
                  style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full p-3 text-left transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <History size={16} style={{ color: 'var(--faint)' }} />
                        <span className="font-medium text-[14px]">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Valor</label>
          <CurrencyInput
            value={value}
            onValueChange={(value) => setValue(value || '')}
            prefix="R$ "
            decimalsLimit={2}
            decimalSeparator=","
            groupSeparator="."
            placeholder="R$ 0,00"
            className={`${fieldClass} font-bold text-2xl tnum`}
            style={fieldStyle}
            required
          />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            className={fieldClass}
            style={fieldStyle}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Data</label>
          <input
            type="date"
            value={date}
            max={todayString()}
            onChange={(e) => setDate(e.target.value)}
            className={fieldClass}
            style={fieldStyle}
          />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Conta</label>
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value as AccountType)}
            className={fieldClass}
            style={fieldStyle}
          >
            <option value={AccountType.CHECKING}>Conta Corrente</option>
            <option value={AccountType.SAVINGS}>Conta Poupança</option>
            <option value={AccountType.CREDIT_CARD}>Cartão de Crédito</option>
          </select>
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Tags</label>
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            placeholder="Adicione tags (Enter ou vírgula)"
            darkMode={darkMode}
          />
        </div>
        <button
          type="submit"
          className="w-full py-3.5 rounded-[16px] font-bold mt-4 active:scale-95 transition-all"
          style={{ background: 'var(--accent)', color: 'var(--accent-on)' }}
        >
          Confirmar lançamento
        </button>
      </form>
    </>
  );
}
