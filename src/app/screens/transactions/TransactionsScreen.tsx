import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { themes } from '../../constants/ui';
import { Transaction } from '../../types';
import { logError } from '../../utils/logger';
import { TransactionFilters } from './components/TransactionFilters';
import { TransactionItem } from './components/TransactionItem';
import { EditTransactionModal, type EditingTransaction } from './components/EditTransactionModal';

export function TransactionsScreen() {
  const { transactions, deleteTransaction, updateTransaction, preferences } = useFinance();
  const { theme, darkMode } = preferences;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAccount, setFilterAccount] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<EditingTransaction | null>(null);
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
    const groups: Record<string, Transaction[]> = {};
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

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const patchEditing = (patch: Partial<EditingTransaction>) =>
    setEditingTransaction((prev) => (prev ? { ...prev, ...patch } : prev));

  const handleSaveEdit = async () => {
    if (!editingTransaction) return;
    setEditLoading(true);
    try {
      const rawDate = typeof editingTransaction.date === 'string'
        ? editingTransaction.date.split('T')[0]
        : editingTransaction.date;
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
      logError('Error updating transaction:', error);
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
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">🔍</div>
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

      <TransactionFilters
        show={showFilters}
        darkMode={darkMode}
        theme={theme}
        filterType={filterType}
        setFilterType={setFilterType}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterAccount={filterAccount}
        setFilterAccount={setFilterAccount}
        dateRange={dateRange}
        setDateRange={setDateRange}
        accounts={accounts}
        onClear={clearFilters}
      />

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
              <TransactionItem
                key={t.id}
                transaction={t}
                darkMode={darkMode}
                onEdit={handleEditTransaction}
                onDelete={deleteTransaction}
              />
            ))}
          </div>
        ))}
        {Object.keys(groupedTransactions).length === 0 && (
          <div className="text-center py-12 opacity-50">
            <p>Nenhuma transação encontrada</p>
          </div>
        )}
      </div>

      <EditTransactionModal
        show={showEditModal}
        transaction={editingTransaction}
        onChange={patchEditing}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        loading={editLoading}
        darkMode={darkMode}
      />
    </motion.div>
  );
}
