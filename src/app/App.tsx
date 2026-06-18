import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  Target,
  Settings,
  LogOut,
  Trash2,
  Filter,
  Sun,
  Moon,
  Download,
  Edit,
  Calendar,
  X,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle,
  History,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  Shield,
  Users,
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FinanceProvider, useFinance } from './contexts/FinanceContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CategoryIcon } from './components/CategoryIcon';
import { TagInput } from './components/TagInput';
import { Dashboard } from './screens/Dashboard';
import CurrencyInput from 'react-currency-input-field';
import { TransactionType, CategoryType, AccountType, Transaction } from './types';
// Enhanced Theme configuration with gradients and better colors
const themes = {
  emerald: {
    primary: 'bg-emerald-600',
    primaryHover: 'bg-emerald-700',
    text: 'text-emerald-600',
    border: 'border-emerald-600',
    light: 'bg-emerald-50',
    darkLight: 'dark:bg-emerald-900/20',
    gradient: 'from-emerald-500 to-emerald-600',
    bgGradient: 'from-emerald-50 to-green-50',
    accent: 'bg-emerald-100',
    shadow: 'shadow-emerald-100',
    focusRing: 'focus:ring-emerald-500',
  },
  blue: {
    primary: 'bg-blue-600',
    primaryHover: 'bg-blue-700',
    text: 'text-blue-600',
    border: 'border-blue-600',
    light: 'bg-blue-50',
    darkLight: 'dark:bg-blue-900/20',
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-indigo-50',
    accent: 'bg-blue-100',
    shadow: 'shadow-blue-100',
    focusRing: 'focus:ring-blue-500',
  },
  purple: {
    primary: 'bg-purple-600',
    primaryHover: 'bg-purple-700',
    text: 'text-purple-600',
    border: 'border-purple-600',
    light: 'bg-purple-50',
    darkLight: 'dark:bg-purple-900/20',
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-50 to-violet-50',
    accent: 'bg-purple-100',
    shadow: 'shadow-purple-100',
    focusRing: 'focus:ring-purple-500',
  },
  rose: {
    primary: 'bg-rose-600',
    primaryHover: 'bg-rose-700',
    text: 'text-rose-600',
    border: 'border-rose-600',
    light: 'bg-rose-50',
    darkLight: 'dark:bg-rose-900/20',
    gradient: 'from-rose-500 to-rose-600',
    bgGradient: 'from-rose-50 to-pink-50',
    accent: 'bg-rose-100',
    shadow: 'shadow-rose-100',
    focusRing: 'focus:ring-rose-500',
  },
};
const categories = [
  { value: CategoryType.FOOD, label: 'Alimentação', icon: '🍽️' },
  { value: CategoryType.LEISURE, label: 'Lazer', icon: '🎉' },
  { value: CategoryType.TRANSPORT, label: 'Transporte', icon: '🚗' },
  { value: CategoryType.HOME, label: 'Casa', icon: '🏠' },
  { value: CategoryType.HEALTH, label: 'Saúde', icon: '🏥' },
  { value: CategoryType.PERSONAL, label: 'Pessoal', icon: '👤' },
  { value: CategoryType.EDUCATION, label: 'Educação', icon: '📚' },
  { value: CategoryType.SHOPPING, label: 'Compras', icon: '🛒' },
  { value: CategoryType.TRAVEL, label: 'Viagem', icon: '✈️' },
  { value: CategoryType.TECHNOLOGY, label: 'Tecnologia', icon: '💻' },
  { value: CategoryType.INVESTMENTS, label: 'Investimentos', icon: '📈' },
  { value: CategoryType.SALARY, label: 'Salário', icon: '💰' },
  { value: CategoryType.FREELANCE, label: 'Freelance', icon: '💼' },
  { value: CategoryType.BONUS, label: 'Bônus', icon: '🎁' },
  { value: CategoryType.DIVIDENDS, label: 'Dividendos', icon: '📊' },
  { value: CategoryType.RENT, label: 'Aluguel', icon: '🏢' },
  { value: CategoryType.SERVICES, label: 'Serviços', icon: '🔧' },
  { value: CategoryType.INSURANCE, label: 'Seguros', icon: '🛡️' },
  { value: CategoryType.TAXES, label: 'Impostos', icon: '📋' },
  { value: CategoryType.DONATIONS, label: 'Doações', icon: '❤️' },
  { value: CategoryType.OTHER, label: 'Outros', icon: '📝' },
];
function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password, name);
    if (error) {
      setError(error.message || 'Ocorreu um erro. Tente novamente.');
    } else if (!isLogin) {
      setSuccess('Conta criada com sucesso! Faça o login.');
      setIsLogin(true);
    }
    setLoading(false);
  };
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-rose-200/30 rounded-full blur-3xl"
        />
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl mb-6 shadow-2xl shadow-emerald-200"
          >
            <Wallet className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2"
          >
            Finanças Pro
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-gray-600 text-lg"
          >
            Controle suas finanças com estilo
          </motion.p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/10 p-8 border border-white/20"
        >
          <div className="flex gap-2 p-1 bg-gray-100/80 rounded-2xl mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 will-change-transform ${
                isLogin
                  ? 'bg-white text-emerald-600 shadow-lg shadow-emerald-100'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Entrar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 will-change-transform ${
                !isLogin
                  ? 'bg-white text-emerald-600 shadow-lg shadow-emerald-100'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Criar Conta
            </motion.button>
          </div>
          <motion.form
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900"
                    placeholder="Seu nome completo"
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  <p className="text-rose-700 text-sm">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <p className="text-emerald-700 text-sm">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                </>
              )}
            </motion.button>
          </motion.form>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="text-center mt-6 text-sm text-gray-500"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Seguro
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Rápido
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Gratuito
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
function TransactionModal({
  show,
  onClose,
  darkMode,
}: {
  show: boolean;
  onClose: () => void;
  darkMode: boolean;
}) {
  const { addTransaction, transactions } = useFinance();
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState<CategoryType>(CategoryType.OTHER);
  const [account, setAccount] = useState<AccountType>(AccountType.CHECKING);
  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
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

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (date > todayString) {
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
    const now = new Date();
    setDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
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
    }).catch((err: any) => console.error('Error saving transaction:', err));

    resetForm();
    onClose();
  };
  if (!show) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          onClick={onClose}
        />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{
            type: 'spring',
            damping: 28,
            stiffness: 300,
          }}
          className={`absolute bottom-0 left-0 right-0 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-t-[2rem] shadow-2xl z-[1001]`}
          style={{ maxHeight: 'calc(92vh - env(safe-area-inset-top, 0px))' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header fixo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className={`sticky top-0 z-10 p-6 pb-4 border-b border-gray-100 dark:border-gray-700 rounded-t-[3rem] ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-center justify-between">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-xl font-bold"
              >
                Novo Lançamento
              </motion.h3>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.3 }}
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>
          </motion.div>

          {/* Conteúdo com scroll */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(92vh - env(safe-area-inset-top, 0px) - 120px)', paddingBottom: 'env(safe-area-inset-bottom, 1rem)' }}>
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
                max={(() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`; })()}
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
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
function GoalModal({
  show,
  onClose,
  darkMode,
  theme,
  editGoal,
}: {
  show: boolean;
  onClose: () => void;
  darkMode: boolean;
  theme: keyof typeof themes;
  editGoal?: any;
}) {
  const { addGoal, updateGoal } = useFinance();
  const [name, setName] = useState(editGoal?.name || '');
  const [targetAmount, setTargetAmount] = useState(
    editGoal?.targetAmount?.toString() || ''
  );
  const [currentAmount, setCurrentAmount] = useState(
    editGoal?.currentAmount?.toString() || ''
  );
  // Update form values when editGoal changes
  useEffect(() => {
    if (editGoal) {
      setName(editGoal.name || '');
      setTargetAmount(editGoal.targetAmount?.toString() || '');
      setCurrentAmount(editGoal.currentAmount?.toString() || '');
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('');
    }
  }, [editGoal]);

  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setError(null);
  };

  const validateGoalForm = () => {
    if (!name.trim()) {
      setError('Nome da meta é obrigatório');
      return false;
    }
    const target = parseFloat(String(targetAmount).replace(',', '.')) || 0;
    if (target <= 0) {
      setError('Valor da meta deve ser maior que zero');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateGoalForm()) return;

    const targetNum = parseFloat(String(targetAmount).replace(',', '.')) || 0;
    const currentNum = parseFloat(String(currentAmount).replace(',', '.')) || 0;

    // Fire-and-forget: fecha o modal imediatamente, Firebase sincroniza via onSnapshot
    if (editGoal) {
      updateGoal(editGoal.id, { name, targetAmount: targetNum, currentAmount: currentNum })
        .catch((err: any) => console.error('Error updating goal:', err));
    } else {
      addGoal({ name, targetAmount: targetNum, currentAmount: currentNum, icon: 'target', color: theme })
        .catch((err: any) => console.error('Error adding goal:', err));
    }

    resetForm();
    onClose();
  };

  if (!show) return null;
  return createPortal(
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{
            paddingTop: 'env(safe-area-inset-top, 0px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Modal centralizado - bordas arredondadas em todos os lados */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className={`relative z-10 w-full max-w-sm flex flex-col ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-3xl shadow-2xl`}
            style={{ maxHeight: '80vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex-shrink-0 px-6 pt-5 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">
                  {editGoal ? 'Editar Meta' : 'Nova Meta'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Conteúdo scrollável */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {error && (
                <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Nome da Meta
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(null); }}
                    placeholder="Ex: Viagem para Paris"
                    className={`w-full p-4 rounded-2xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'
                    } focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Valor da Meta
                  </label>
                  <CurrencyInput
                    value={targetAmount}
                    onValueChange={(value) => { setTargetAmount(value || ''); setError(null); }}
                    prefix="R$ "
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                    placeholder="R$ 0,00"
                    className={`w-full p-4 rounded-2xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'
                    } focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-xl`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Valor Atual (já economizado)
                  </label>
                  <CurrencyInput
                    value={currentAmount}
                    onValueChange={(value) => setCurrentAmount(value || '')}
                    prefix="R$ "
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                    placeholder="R$ 0,00"
                    className={`w-full p-4 rounded-2xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'
                    } focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-xl`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 theme-primary text-white rounded-2xl font-bold shadow-lg mt-2 active:scale-95 transition-all"
                >
                  {editGoal ? 'Atualizar Meta' : 'Criar Meta'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
function TransactionsScreen() {
  const { transactions, deleteTransaction, updateTransaction, preferences } = useFinance();
  const { theme, darkMode } = preferences;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAccount, setFilterAccount] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const accounts = useMemo(() => {
    const uniqueAccounts = [...new Set(transactions.map(t => t.account))];
    return uniqueAccounts.filter(account => account && account.trim() !== '');
  }, [transactions]);
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = searchTerm === '' ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        t.account.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      const matchesAccount = filterAccount === 'all' || t.account === filterAccount;
      const transactionDate = new Date(t.date);
      const matchesDateRange =
        (!dateRange.start || transactionDate >= new Date(dateRange.start)) &&
        (!dateRange.end || transactionDate <= new Date(dateRange.end));
      return matchesSearch && matchesType && matchesCategory && matchesAccount && matchesDateRange;
    });
  }, [transactions, searchTerm, filterType, filterCategory, filterAccount, dateRange]);
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, typeof transactions> = {};
    filteredTransactions.forEach((t) => {
      const date = new Date(t.date);
      const key = date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(t);
    });
    return groups;
  }, [filteredTransactions]);
  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };
  const handleSaveEdit = async () => {
    if (!editingTransaction) return;
    setEditLoading(true);
    try {
      const rawDate = editingTransaction.date?.split('T')[0] || editingTransaction.date;
      const isoDate = rawDate ? new Date(rawDate + 'T12:00:00').toISOString() : editingTransaction.date;
      const numericValue = parseFloat(String(editingTransaction.value).replace(',', '.')) || 0;
      await updateTransaction(editingTransaction.id, {
        description: editingTransaction.description,
        value: numericValue,
        category: editingTransaction.category,
        tags: editingTransaction.tags || [],
        account: editingTransaction.account,
        date: isoDate,
      });
      setShowEditModal(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
    } finally {
      setEditLoading(false);
    }
  };
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterCategory('all');
    setFilterAccount('all');
    setDateRange({ start: '', end: '' });
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Extrato</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          } shadow-sm`}
        >
          <Filter size={20} className={showFilters ? 'text-emerald-500' : ''} />
        </button>
      </div>
      {/* Search */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          🔍
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar transações..."
          className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-100 text-gray-900'
          } focus:ring-2 focus:ring-emerald-500 outline-none`}
        />
      </div>
      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={`p-4 rounded-2xl border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            } space-y-4`}>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Filtros Avançados</h4>
                <button
                  onClick={clearFilters}
                  className="text-sm text-emerald-500 hover:text-emerald-600"
                >
                  Limpar
                </button>
              </div>
              {/* Type Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo</label>
                <div className="flex gap-2">
                  {[
                    { value: 'all', label: 'Todas' },
                    { value: TransactionType.INCOME, label: 'Receitas' },
                    { value: TransactionType.EXPENSE, label: 'Despesas' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFilterType(type.value as any)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        filterType === type.value
                          ? `${themes[theme].primary} text-white`
                          : darkMode
                          ? 'bg-gray-700 border border-gray-600'
                          : 'bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Categoria</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`w-full p-2 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-200'
                  } outline-none`}
                >
                  <option value="all">Todas as categorias</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Account Filter */}
              {accounts.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Conta</label>
                  <select
                    value={filterAccount}
                    onChange={(e) => setFilterAccount(e.target.value)}
                    className={`w-full p-2 rounded-xl border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-200'
                    } outline-none`}
                  >
                    <option value="all">Todas as contas</option>
                    {accounts.map((account) => (
                      <option key={account} value={account}>
                        {account}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Date Range */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium mb-1 block">Data Inicial</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className={`w-full p-2 rounded-xl border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-200'
                    } outline-none`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Data Final</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className={`w-full p-2 rounded-xl border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-200'
                    } outline-none`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Quick Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
            filterType === 'all'
              ? `${themes[theme].primary} text-white`
              : darkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-100'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilterType('income')}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
            filterType === 'income'
              ? 'bg-emerald-600 text-white'
              : darkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-100'
          }`}
        >
          Receitas
        </button>
        <button
          onClick={() => setFilterType('expense')}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
            filterType === 'expense'
              ? 'bg-rose-600 text-white'
              : darkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-100'
          }`}
        >
          Despesas
        </button>
      </div>
      {/* Grouped Transactions */}
      <div className="space-y-6">
        {Object.entries(groupedTransactions).map(([date, txs]) => (
          <div key={date} className="space-y-2">
            <h4 className="text-sm font-semibold opacity-50 px-1">{date}</h4>
            {txs.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } p-4 rounded-2xl flex items-center justify-between shadow-sm border ${
                  darkMode ? 'border-gray-700' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`p-3 rounded-xl ${
                      t.type === 'income'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-rose-100 text-rose-600'
                    }`}
                  >
                    <CategoryIcon category={t.category} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{t.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {t.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            darkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span
                      className={`font-bold block ${
                        t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'} R$
                      {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs opacity-50">{t.account}</span>
                  </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditTransaction(t)}
                    className="text-gray-400 hover:text-blue-500 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 will-change-transform"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Deseja excluir esta transação?')) {
                        deleteTransaction(t.id);
                      }
                    }}
                    className="text-gray-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-200 will-change-transform"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
        {Object.keys(groupedTransactions).length === 0 && (
          <div className="text-center py-12 opacity-50">
            <p>Nenhuma transação encontrada</p>
          </div>
        )}
      </div>
      {/* Edit Transaction Modal — portal para sair do contexto de transform */}
      {createPortal(
        <AnimatePresence>
          {showEditModal && editingTransaction && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
            style={{
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => { if (!editLoading) setShowEditModal(false); }}
            />
            {/* Modal centralizado - bordas arredondadas em todos os lados */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className={`relative z-10 w-full max-w-sm flex flex-col ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-3xl shadow-2xl`}
              style={{ maxHeight: '80vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`flex-shrink-0 px-6 pt-5 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Editar Transação</h3>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Conteúdo scrollável */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block opacity-70">Descrição</label>
                    <input
                      type="text"
                      value={editingTransaction.description}
                      onChange={(e) => setEditingTransaction((prev: Transaction) => ({ ...prev, description: e.target.value }))}
                      className={`w-full p-4 rounded-2xl border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      } outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block opacity-70">Valor</label>
                    <CurrencyInput
                      value={editingTransaction.value}
                      onValueChange={(value) => setEditingTransaction((prev: Transaction) => ({ ...prev, value: value || '0' }))}
                      prefix="R$ "
                      className={`w-full p-4 rounded-2xl border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      } outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-2xl`}
                      placeholder="R$ 0,00"
                      decimalsLimit={2}
                      decimalSeparator=","
                      groupSeparator="."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block opacity-70">Categoria</label>
                    <select
                      value={editingTransaction.category}
                      onChange={(e) => setEditingTransaction((prev: Transaction) => ({ ...prev, category: e.target.value as CategoryType }))}
                      className={`w-full p-4 rounded-2xl border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      } outline-none`}
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block opacity-70">Conta</label>
                    <select
                      value={editingTransaction.account}
                      onChange={(e) => setEditingTransaction((prev: Transaction) => ({ ...prev, account: e.target.value as AccountType }))}
                      className={`w-full p-4 rounded-2xl border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      } outline-none`}
                    >
                      <option value="checking">Conta Corrente</option>
                      <option value="savings">Conta Poupança</option>
                      <option value="credit_card">Cartão de Crédito</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block opacity-70">Data</label>
                    <input
                      type="date"
                      value={editingTransaction.date?.split('T')[0] || editingTransaction.date}
                      onChange={(e) => setEditingTransaction((prev: Transaction) => ({ ...prev, date: e.target.value }))}
                      className={`w-full p-4 rounded-2xl border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      } outline-none`}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block opacity-70">Tags</label>
                    <TagInput
                      tags={editingTransaction.tags || []}
                      onTagsChange={(tags) => setEditingTransaction((prev: Transaction) => ({ ...prev, tags }))}
                      placeholder="Adicionar tags..."
                      darkMode={darkMode}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={editLoading}
                    className="w-full py-4 theme-primary text-white rounded-2xl font-bold shadow-lg mt-2 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {editLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
function GoalsScreen() {
  const { goals, transactions, deleteGoal, updateGoal, preferences } = useFinance();
  const { theme, darkMode } = preferences;
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressGoal, setProgressGoal] = useState<any>(null);
  const [progressAmount, setProgressAmount] = useState('');
  // Calculate monthly savings average
  const monthlySavings = useMemo(() => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
    const recentTransactions = transactions.filter(
      (t) => new Date(t.date) >= threeMonthsAgo
    );
    const income = recentTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.value, 0);
    const expenses = recentTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.value, 0);
    return (income - expenses) / 3;
  }, [transactions]);
  const handleEdit = (goal: any) => {
    setEditingGoal(goal);
    setShowGoalModal(true);
  };
  const handleAddProgress = (goal: any) => {
    setProgressGoal(goal);
    setProgressAmount('');
    setShowProgressModal(true);
  };
  const handleSaveProgress = async () => {
    if (!progressGoal || !progressAmount) return;

    const newAmount = progressGoal.currentAmount + parseFloat(progressAmount);
    await updateGoal(progressGoal.id, {
      currentAmount: newAmount,
    });

    setShowProgressModal(false);
    setProgressGoal(null);
    setProgressAmount('');
  };
  const handleCloseModal = () => {
    setEditingGoal(null);
    setShowGoalModal(false);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Metas</h3>
        <button
          onClick={() => setShowGoalModal(true)}
          className="theme-primary text-white px-4 py-2 rounded-xl font-semibold shadow-lg active:scale-95 transition-all"
        >
          Nova Meta
        </button>
      </div>
      <div className="grid gap-4">
        {goals.map((goal, index) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          const monthsToGoal =
            monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : 0;
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } p-5 rounded-3xl border will-change-transform ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              } shadow-sm`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`${themes[theme].light} ${themes[theme].text} p-3 rounded-2xl`}
                  >
                    <Target size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg">{goal.name}</p>
                    <p className="text-sm opacity-50">
                      Meta: R${' '}
                      {goal.targetAmount.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-emerald-500">
                    {progress.toFixed(0)}%
                  </span>
                  <button
                    onClick={() => handleAddProgress(goal)}
                    className="p-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200 text-emerald-500"
                    title="Adicionar progresso"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(goal)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 will-change-transform"
                  >
                    <Edit size={18} className="text-gray-600 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Deseja excluir esta meta?')) {
                        deleteGoal(goal.id);
                      }
                    }}
                    className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/20 rounded-lg transition-all duration-200 will-change-transform text-rose-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`${themes[theme].primary} h-full`}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">
                  Economizado: R${' '}
                  {goal.currentAmount.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </span>
                {remaining > 0 && monthsToGoal > 0 && (
                  <span className="opacity-70">
                    Faltam ~{monthsToGoal}{' '}
                    {monthsToGoal === 1 ? 'mês' : 'meses'}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
        {goals.length === 0 && (
          <div className="text-center py-12 opacity-50">
            <Target className="w-16 h-16 mx-auto mb-4" />
            <p>Nenhuma meta criada</p>
            <p className="text-sm">Clique em "Nova Meta" para começar</p>
          </div>
        )}
      </div>
      <GoalModal
        show={showGoalModal}
        onClose={handleCloseModal}
        darkMode={darkMode}
        theme={theme}
        editGoal={editingGoal}
      />

      {/* Progress Modal */}
      <AnimatePresence>
        {showProgressModal && progressGoal && (
          <div className="fixed inset-0 z-[1000]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setShowProgressModal(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className={`absolute bottom-0 left-0 right-0 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } p-6 rounded-t-[2rem] shadow-2xl z-[1001]`}
              style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">Adicionar Progresso</h3>
                  <p className="text-sm opacity-70">{progressGoal.name}</p>
                </div>
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className={`${themes[theme].light} ${themes[theme].text} p-3 rounded-2xl w-fit mx-auto mb-6`}>
                <Target size={24} />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Valor a adicionar (R$)</label>
                  <CurrencyInput
                    value={progressAmount}
                    onValueChange={(value) => setProgressAmount(value || '')}
                    className={`w-full p-3 rounded-xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } outline-none focus:ring-2 focus:ring-emerald-500`}
                    placeholder="0,00"
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowProgressModal(false)}
                    className={`flex-1 py-3 rounded-xl font-semibold border ${
                      darkMode ? 'border-gray-600' : 'border-gray-200'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveProgress}
                    disabled={!progressAmount || parseFloat(progressAmount) <= 0}
                    className={`${themes[theme].primary} flex-1 py-3 rounded-xl font-semibold text-white shadow-lg disabled:opacity-50`}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
function SettingsScreen() {
  const { user, signOut, updateUserProfile, updateUserEmail, updateUserPassword, reauthenticate } = useAuth();
  const { transactions, preferences, updatePreferences, goals } = useFinance();
  const { theme, darkMode } = preferences;

  // Avatar options
  const avatarOptions = [
    { id: 'avatar1', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', name: 'Felix' },
    { id: 'avatar2', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', name: 'Aneka' },
    { id: 'avatar3', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Baby', name: 'Baby' },
    { id: 'avatar4', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie', name: 'Charlie' },
    { id: 'avatar5', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dusty', name: 'Dusty' },
    { id: 'avatar6', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fluffy', name: 'Fluffy' },
    { id: 'avatar7', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Garfield', name: 'Garfield' },
    { id: 'avatar8', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max', name: 'Max' },
    { id: 'avatar9', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo', name: 'Milo' },
    { id: 'avatar10', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar', name: 'Oscar' },
    { id: 'avatar11', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Simba', name: 'Simba' },
    { id: 'avatar12', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tiger', name: 'Tiger' },
  ];

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Set current avatar as selected when modal opens
  useEffect(() => {
    if (showAvatarModal && user?.photoURL) {
      // Check if current photoURL matches any of our predefined avatars
      const currentAvatar = avatarOptions.find(avatar => avatar.src === user.photoURL);
      if (currentAvatar) {
        setSelectedAvatar(currentAvatar.src);
      }
    }
  }, [showAvatarModal, user?.photoURL]);
  const [loginData, setLoginData] = useState({
    currentPassword: '',
    newEmail: user?.email || '',
    newPassword: '',
    confirmPassword: '',
  });
  const exportData = () => {
    const data = {
      user: {
        id: user?.uid,
        email: user?.email,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
        createdAt: user?.metadata?.creationTime,
        lastLogin: user?.metadata?.lastSignInTime,
      },
      preferences,
      transactions: transactions.map(t => ({
        id: t.id,
        date: t.date,
        description: t.description,
        type: t.type,
        value: t.value,
        category: t.category,
        account: t.account,
        tags: t.tags,
        createdAt: t.createdAt,
      })),
      goals: goals.map(g => ({
        id: g.id,
        title: g.name,
        target: g.targetAmount,
        current: g.currentAmount,
        deadline: g.deadline,
        icon: g.icon,
        color: g.color,
        createdAt: g.createdAt,
      })),
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financas-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = [
      'Data',
      'Descrição',
      'Tipo',
      'Valor',
      'Categoria',
      'Conta',
      'Tags',
      'Mês/Ano'
    ];

    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString('pt-BR'),
      t.description,
      t.type === 'income' ? 'Receita' : 'Despesa',
      t.value.toFixed(2).replace('.', ','),
      t.category,
      t.account,
      t.tags.join('; '),
      new Date(t.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    ]);

    // Adicionar linha em branco
    rows.push(['', '', '', '', '', '', '', '']);

    // Adicionar resumo mensal
    const monthlySummary = transactions.reduce((acc, t) => {
      const monthYear = new Date(t.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      if (!acc[monthYear]) {
        acc[monthYear] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        acc[monthYear].income += t.value;
      } else {
        acc[monthYear].expense += t.value;
      }
      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    rows.push(['RESUMO MENSAL', '', '', '', '', '', '', '']);
    rows.push(['Mês/Ano', 'Receitas', 'Despesas', 'Saldo', '', '', '', '']);

    Object.entries(monthlySummary).forEach(([month, data]) => {
      const balance = data.income - data.expense;
      rows.push([
        month,
        data.income.toFixed(2).replace('.', ','),
        data.expense.toFixed(2).replace('.', ','),
        balance.toFixed(2).replace('.', ','),
        '', '', '', ''
      ]);
    });

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAvatarSelect = async (avatarSrc: string) => {
    setLoading(true);
    try {
      // Update user profile with selected avatar
      const result = await updateUserProfile({ photoURL: avatarSrc });
      if (result.error) {
        alert('Erro ao atualizar avatar: ' + result.error.message);
      } else {
        alert('Avatar atualizado com sucesso!');
        setSelectedAvatar(null); // Reset selected avatar
        setShowAvatarModal(false); // Close modal
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Erro ao atualizar avatar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginUpdate = async () => {
    if (loginData.newPassword !== loginData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (!loginData.currentPassword) {
      alert('Por favor, digite sua senha atual para confirmar as alterações.');
      return;
    }

    setLoading(true);
    try {
      let emailUpdated = false;
      let passwordUpdated = false;

      // Re-authenticate user before making changes
      if (loginData.currentPassword) {
        const reauthResult = await reauthenticate(loginData.currentPassword);
        if (reauthResult.error) throw reauthResult.error;
      }

      if (loginData.newEmail !== user?.email) {
        const result = await updateUserEmail(loginData.newEmail);
        if (result.error) {
          alert('Erro ao atualizar email: ' + result.error.message);
          return;
        }
        emailUpdated = true;
      }

      if (loginData.newPassword) {
        const result = await updateUserPassword(loginData.newPassword);
        if (result.error) {
          alert('Erro ao atualizar senha: ' + result.error.message);
          return;
        }
        passwordUpdated = true;
      }

      if (emailUpdated || passwordUpdated) {
        alert('Informações de login atualizadas com sucesso!');
        setShowLoginModal(false);
        setLoginData({
          currentPassword: '',
          newEmail: user?.email || '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        alert('Nenhuma alteração foi feita.');
      }
    } catch (error: any) {
      console.error('Login update error:', error);
      if (error.code === 'auth/wrong-password') {
        alert('Senha atual incorreta. Por favor, verifique e tente novamente.');
      } else if (error.code === 'auth/requires-recent-login') {
        alert('Por segurança, faça login novamente antes de alterar suas informações.');
      } else {
        alert('Erro ao atualizar informações: ' + (error.message || 'Erro desconhecido'));
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-bold">Configurações</h3>

      {/* Profile Section */}
      <div
        className={`${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-3xl overflow-hidden shadow-sm border ${
          darkMode ? 'border-gray-700' : 'border-gray-100'
        }`}
      >
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <p className="text-sm font-semibold opacity-50 mb-4">PERFIL</p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}&background=${theme === 'emerald' ? '10b981' : theme === 'blue' ? '3b82f6' : theme === 'purple' ? '8b5cf6' : 'f97316'}&color=fff&size=80`}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  onError={(e) => {
                    // Fallback to avatar if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}&background=${theme === 'emerald' ? '10b981' : theme === 'blue' ? '3b82f6' : theme === 'purple' ? '8b5cf6' : 'f97316'}&color=fff&size=80`;
                  }}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{user?.displayName || 'Usuário'}</h4>
                <p className="text-sm opacity-60">{user?.email}</p>
              </div>
              <button
                onClick={() => setShowAvatarModal(true)}
                className={`p-2 rounded-lg ${themes[theme].primary} text-white`}
              >
                <Edit size={16} />
              </button>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Shield size={18} className="text-gray-600 dark:text-gray-300" />
                </div>
                <span className="font-medium text-sm">Alterar Email e Senha</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <p className="text-sm font-semibold opacity-50 mb-4">APARÊNCIA</p>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Tema de Cor</p>
              <div className="flex gap-3">
                {(Object.keys(themes) as Array<keyof typeof themes>).map((t) => (
                  <button
                    key={t}
                    onClick={() => updatePreferences({ theme: t })}
                    className={`w-12 h-12 rounded-full ${themes[t].primary} border-4 ${
                      theme === t
                        ? 'border-white ring-2 ring-gray-300 dark:ring-gray-600'
                        : 'border-transparent'
                    } transition-all active:scale-90`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                <span className="font-medium">Modo Escuro</span>
              </div>
              <button
                onClick={() => updatePreferences({ darkMode: !darkMode })}
                className={`w-14 h-8 rounded-full transition-colors ${
                  darkMode ? themes[theme].primary : 'bg-gray-200'
                } relative`}
              >
                <motion.div
                  animate={{ x: darkMode ? 24 : 0 }}
                  className="w-6 h-6 bg-white rounded-full absolute top-1 left-1"
                />
              </button>
            </div>
          </div>
        </div>
        {/* Export */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <p className="text-sm font-semibold opacity-50 mb-4">DADOS</p>
          <div className="space-y-2">
            <button
              onClick={exportData}
              className="w-full flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Download size={18} className="text-gray-600 dark:text-gray-300" />
                </div>
                <span className="font-medium text-sm">Exportar JSON</span>
              </div>
            </button>
            <button
              onClick={exportCSV}
              className="w-full flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Download size={18} className="text-gray-600 dark:text-gray-300" />
                </div>
                <span className="font-medium text-sm">Exportar CSV</span>
              </div>
            </button>
          </div>
        </div>
        {/* Logout */}
        <div className="p-5">
          <button
            onClick={() => {
              if (confirm('Deseja realmente sair?')) {
                signOut();
              }
            }}
            className="w-full flex items-center justify-between py-3 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl px-3 transition-colors text-rose-600"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <LogOut size={18} />
              </div>
              <span className="font-medium text-sm">Sair da Conta</span>
            </div>
          </button>
        </div>
      </div>
      {/* User Info */}
      <div className="text-center opacity-30 text-xs space-y-1">
        <p>ID: {user?.uid?.slice(0, 8)}...</p>
        <p>Email: {user?.email}</p>
        <p className="font-semibold">Finanças Pro v1.0.0</p>
        <p>Desenvolvido com ❤️</p>
      </div>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <div className="fixed inset-0 z-[1000]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => { setShowAvatarModal(false); setSelectedAvatar(null); }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className={`absolute bottom-0 left-0 right-0 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } p-6 rounded-t-[2rem] shadow-2xl overflow-y-auto z-[1001]`}
              style={{ maxHeight: 'calc(90vh - env(safe-area-inset-top, 0px))', paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Escolher Avatar</h3>
                <button
                  onClick={() => { setShowAvatarModal(false); setSelectedAvatar(null); }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.src)}
                    className={`relative p-3 rounded-xl border-2 transition-all ${
                      selectedAvatar === avatar.src
                        ? `${themes[theme].primary} border-transparent`
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={avatar.src}
                      alt={avatar.name}
                      className="w-16 h-16 rounded-full object-cover mx-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${avatar.name}&background=${theme === 'emerald' ? '10b981' : theme === 'blue' ? '3b82f6' : theme === 'purple' ? '8b5cf6' : 'f97316'}&color=fff&size=64`;
                      }}
                    />
                    <p className="text-xs text-center mt-2 opacity-75">{avatar.name}</p>
                    {selectedAvatar === avatar.src && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAvatarModal(false);
                    setSelectedAvatar(null);
                  }}
                  className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => selectedAvatar && handleAvatarSelect(selectedAvatar)}
                  disabled={!selectedAvatar || loading}
                  className={`flex-1 py-3 px-4 ${themes[theme].primary} text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Avatar'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Login Edit Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLoginModal(false)}
          >
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md" />
            {/* Additional subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative ${
                darkMode ? 'bg-gray-800/95' : 'bg-white/95'
              } backdrop-blur-xl rounded-3xl p-6 w-full max-w-md mx-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Alterar Login</h3>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Senha Atual</label>
                  <input
                    type="password"
                    value={loginData.currentPassword}
                    onChange={(e) => setLoginData({ ...loginData, currentPassword: e.target.value })}
                    className={`w-full p-3 rounded-xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } focus:outline-none focus:ring-2 ${themes[theme].focusRing}`}
                    placeholder="Digite sua senha atual"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Novo Email</label>
                  <input
                    type="email"
                    value={loginData.newEmail}
                    onChange={(e) => setLoginData({ ...loginData, newEmail: e.target.value })}
                    className={`w-full p-3 rounded-xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } focus:outline-none focus:ring-2 ${themes[theme].focusRing}`}
                    placeholder="novo@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nova Senha</label>
                  <input
                    type="password"
                    value={loginData.newPassword}
                    onChange={(e) => setLoginData({ ...loginData, newPassword: e.target.value })}
                    className={`w-full p-3 rounded-xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } focus:outline-none focus:ring-2 ${themes[theme].focusRing}`}
                    placeholder="Digite a nova senha"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={loginData.confirmPassword}
                    onChange={(e) => setLoginData({ ...loginData, confirmPassword: e.target.value })}
                    className={`w-full p-3 rounded-xl border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } focus:outline-none focus:ring-2 ${themes[theme].focusRing}`}
                    placeholder="Confirme a nova senha"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleLoginUpdate}
                    disabled={loading}
                    className={`flex-1 py-3 px-4 ${themes[theme].primary} text-white rounded-xl font-medium disabled:opacity-50`}
                  >
                    {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Atualizar'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
function MainApp() {
  const { preferences } = useFinance();
  const { theme, darkMode } = preferences;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const tabs = [
    { id: 'dashboard', label: 'Início', icon: Wallet },
    { id: 'transactions', label: 'Extrato', icon: Calendar },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];
  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      } transition-colors duration-300`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-10 ${
          darkMode ? 'bg-gray-800/80' : 'bg-white/80'
        } backdrop-blur-sm p-5 flex justify-between items-center border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-100'
        } rounded-b-3xl shadow-sm`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${themes[theme].primary} text-white shadow-lg`}
          >
            <Wallet size={20} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Finanças Pro</h2>
            <p className="text-xs opacity-60">
              {tabs.find((t) => t.id === activeTab)?.label}
            </p>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="fixed top-20 left-0 right-0 overflow-y-auto scrollbar-hide p-4 max-w-md mx-auto" style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <Dashboard key="dashboard" />}
          {activeTab === 'transactions' && <TransactionsScreen key="transactions" />}
          {activeTab === 'goals' && <GoalsScreen key="goals" />}
          {activeTab === 'settings' && <SettingsScreen key="settings" />}
        </AnimatePresence>
      </main>
      {/* Floating Action Button - Only show on dashboard */}
      {activeTab === 'dashboard' && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddModal(true)}
          className="fixed right-6 w-16 h-16 rounded-full theme-primary text-white shadow-2xl flex items-center justify-center z-40 will-change-transform"
          style={{ bottom: 'calc(5.5rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <Plus size={28} />
        </motion.button>
      )}
      {/* Bottom Navigation */}
      <nav
        className={`fixed bottom-0 left-0 right-0 ${
          darkMode ? 'bg-gray-800/80' : 'bg-white/80'
        } backdrop-blur-sm border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-100'
        } px-6 pt-3 flex justify-between items-center z-50 rounded-t-[2.5rem] shadow-lg`}
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all will-change-transform ${
              activeTab === tab.id
                ? `${themes[theme].text} ${themes[theme].light} ${themes[theme].darkLight}`
                : 'text-gray-400'
            }`}
          >
            <tab.icon size={22} />
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </nav>
      {/* Transaction Modal */}
      <TransactionModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        darkMode={darkMode}
      />
    </div>
  );
}
function AppContent() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }
  if (!user) {
    return <AuthScreen />;
  }
  return (
    <FinanceProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </FinanceProvider>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
