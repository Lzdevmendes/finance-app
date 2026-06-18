import { Dispatch, SetStateAction } from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface Stats {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  incomeCount: number;
  expenseCount: number;
  transactionCount: number;
  averageTransaction: number;
  largestIncome: number;
  largestExpense: number;
}

interface BalanceCardProps {
  stats: Stats;
  selectedMonth: number;
  setSelectedMonth: Dispatch<SetStateAction<number>>;
  selectedYear: number;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  monthNames: string[];
  availableYears: number[];
}

export function BalanceCard({ stats, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, monthNames, availableYears }: BalanceCardProps) {
  return (
      <div
        className="bg-gradient-to-br theme-gradient p-6 rounded-[2rem] text-white shadow-xl space-y-4"
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm opacity-90">Saldo do Mês</span>
            <h3 className="text-3xl font-bold mt-1">
              R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="flex gap-2 mr-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-2 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {monthNames.map((month, index) => (
                <option key={index + 1} value={index + 1} className="text-gray-900">
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-2 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {availableYears.map((year) => (
                <option key={year} value={year} className="text-gray-900">
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpCircle size={18} />
              <span className="text-xs opacity-90">Receitas</span>
            </div>
            <span className="font-bold text-lg">
              R$ {stats.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <div className="text-xs opacity-75 mt-1">
              {stats.incomeCount} transações
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownCircle size={18} />
              <span className="text-xs opacity-90">Despesas</span>
            </div>
            <span className="font-bold text-lg">
              R$ {stats.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <div className="text-xs opacity-75 mt-1">
              {stats.expenseCount} transações
            </div>
          </div>
        </div>

        {/* Estatísticas Premium */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl text-center">
            <div className="text-xs opacity-80 mb-1">Total</div>
            <div className="font-bold text-sm">
              {stats.transactionCount}
            </div>
            <div className="text-xs opacity-60">Transações</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl text-center">
            <div className="text-xs opacity-80 mb-1">Média</div>
            <div className="font-bold text-sm">
              R$ {stats.averageTransaction.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
            <div className="text-xs opacity-60">por transação</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl text-center">
            <div className="text-xs opacity-80 mb-1">Maior</div>
            <div className="font-bold text-sm">
              R$ {Math.max(stats.largestIncome, stats.largestExpense).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
            <div className="text-xs opacity-60">valor</div>
          </div>
        </div>
      </div>
  );
}
