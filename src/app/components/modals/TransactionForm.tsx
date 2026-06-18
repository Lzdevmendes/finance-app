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
        <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        onSubmit={handleSubmit}
        className="p-6 space-y-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="grid grid-cols-2 gap-3 p-1 bg-gray-100 dark:bg-gray-700 rounded-2xl"
        >
          <button
            type="button"
            onClick={() => setType(TransactionType.INCOME)}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              type === 'income'
                ? 'bg-white dark:bg-gray-600 text-emerald-600 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            <ArrowUpCircle size={18} />
            Receita
          </button>
          <button
            type="button"
            onClick={() => setType(TransactionType.EXPENSE)}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              type === 'expense'
                ? 'bg-white dark:bg-gray-600 text-rose-600 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            <ArrowDownCircle size={18} />
            Despesa
          </button>
        </motion.div>
        <div>
          <label className="block text-sm font-medium mb-2 opacity-70">
            Descrição
          </label>
          <div className="relative">
            <input
              type="text"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder={type === 'income' ? 'Ex: Salário, Freelance, Dividendos...' : 'Ex: Almoço, Transporte, Compras...'}
              className={`w-full p-4 rounded-2xl border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 focus:border-gray-600'
                  : 'bg-gray-50 border-gray-200 focus:border-gray-300'
              } focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`}
              required
            />
            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute top-full left-0 right-0 mt-2 ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } border rounded-2xl shadow-xl z-10 max-h-40 overflow-y-auto`}
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectSuggestion(suggestion)}
                      className={`w-full p-3 text-left hover:${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      } transition-colors first:rounded-t-2xl last:rounded-b-2xl`}
                    >
                      <div className="flex items-center gap-2">
                        <History size={16} className="opacity-50" />
                        <span className="font-medium">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 opacity-70">
            Valor
          </label>
          <CurrencyInput
            value={value}
            onValueChange={(value) => setValue(value || '')}
            prefix="R$ "
            decimalsLimit={2}
            decimalSeparator=","
            groupSeparator="."
            placeholder="R$ 0,00"
            className={`w-full p-4 rounded-2xl border ${
              darkMode
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-50 border-gray-100'
            } focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-2xl`}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 opacity-70">
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            className={`w-full p-4 rounded-2xl border ${
              darkMode
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-50 border-gray-100'
            } outline-none`}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 opacity-70">
            Data
          </label>
          <input
            type="date"
            value={date}
            max={todayString()}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full p-4 rounded-2xl border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-100 text-gray-900'
            } outline-none`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 opacity-70">
            Conta
          </label>
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value as AccountType)}
            className={`w-full p-4 rounded-2xl border ${
              darkMode
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-50 border-gray-100'
            } outline-none`}
          >
            <option value={AccountType.CHECKING}>Conta Corrente</option>
            <option value={AccountType.SAVINGS}>Conta Poupança</option>
            <option value={AccountType.CREDIT_CARD}>Cartão de Crédito</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 opacity-70">
            Tags
          </label>
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            placeholder="Adicione tags (Enter ou vírgula)"
            darkMode={darkMode}
          />
        </div>
        <button
          type="submit"
          className="w-full py-4 theme-primary text-white rounded-2xl font-bold shadow-lg mt-6 active:scale-95 transition-all"
        >
          Confirmar Lançamento
        </button>
      </motion.form>
    </>
  );
}
