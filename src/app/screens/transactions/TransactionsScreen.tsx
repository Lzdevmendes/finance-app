import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Transaction } from '../../types';
import { logError } from '../../utils/logger';
import { TransactionFilters } from './components/TransactionFilters';
import { TransactionItem } from './components/TransactionItem';
import { EditTransactionModal, type EditingTransaction } from './components/EditTransactionModal';

export function TransactionsScreen() {
  const { transactions, deleteTransaction, updateTransaction, preferences } = useFinance();
  const { darkMode } = preferences;
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

  const quickFilters: { value: typeof filterType; label: string; active: string }[] = [
    { value: 'all', label: 'Todas', active: 'var(--accent)' },
    { value: 'income', label: 'Receitas', active: 'var(--income)' },
    { value: 'expense', label: 'Despesas', active: 'var(--expense)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-[22px] pb-28 pt-2 space-y-4"
    >
      <ScreenHeader
        title="Transações"
        action={
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Filtros"
            className="w-10 h-10 flex-none rounded-[13px] border flex items-center justify-center"
            style={{
              background: showFilters ? 'var(--accent-dim)' : 'var(--surface2)',
              borderColor: 'var(--line)',
              color: showFilters ? 'var(--accent)' : 'var(--text)',
            }}
          >
            <SlidersHorizontal size={19} strokeWidth={2} />
          </motion.button>
        }
      />

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--faint)' }}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar transações..."
          className="w-full pl-11 pr-4 py-3 rounded-[14px] border outline-none text-[14px] focus:ring-2"
          style={{ background: 'var(--surface)', borderColor: 'var(--line)', color: 'var(--text)' }}
        />
      </div>

      <TransactionFilters
        show={showFilters}
        darkMode={darkMode}
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
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {quickFilters.map((f) => {
          const isActive = filterType === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilterType(f.value)}
              className="px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap border"
              style={
                isActive
                  ? { background: f.active, color: 'var(--accent-on)', borderColor: 'transparent' }
                  : { background: 'var(--surface)', color: 'var(--muted)', borderColor: 'var(--line)' }
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Grouped Transactions */}
      <div className="space-y-5">
        {Object.entries(groupedTransactions).map(([date, txs]) => (
          <div key={date} className="space-y-2">
            <h4 className="text-[12.5px] font-semibold px-1" style={{ color: 'var(--faint)' }}>
              {date}
            </h4>
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
          <div className="text-center py-12" style={{ color: 'var(--faint)' }}>
            <p className="text-[14px]">Nenhuma transação encontrada</p>
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
