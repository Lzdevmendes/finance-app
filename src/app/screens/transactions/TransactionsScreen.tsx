import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Edit, Trash2, X } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';
import { useFinance } from '../../contexts/FinanceContext';
import { CategoryIcon } from '../../components/CategoryIcon';
import { TagInput } from '../../components/TagInput';
import { themes, categories } from '../../constants/ui';
import { TransactionType, CategoryType, AccountType, Transaction } from '../../types';

export function TransactionsScreen() {
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
