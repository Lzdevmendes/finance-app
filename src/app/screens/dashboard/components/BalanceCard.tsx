import { Dispatch, SetStateAction } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatMoney, formatAmount0 } from '../../../utils/format';

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

const selectClass =
  'bg-white/15 border border-white/25 rounded-xl px-2.5 py-1.5 text-[13px] font-semibold ' +
  'focus:outline-none focus:ring-2 focus:ring-white/40';

export function BalanceCard({
  stats,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  monthNames,
  availableYears,
}: BalanceCardProps) {
  return (
    <div
      className="p-[22px] rounded-[24px] space-y-4"
      style={{
        background: 'var(--theme-gradient)',
        color: 'var(--accent-on)',
        boxShadow: '0 18px 40px -16px var(--accent)',
      }}
    >
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <span className="text-[13px] opacity-85">Saldo do mês</span>
          <h3 className="text-[30px] font-extrabold mt-1 tnum leading-none">
            {formatMoney(stats.balance)}
          </h3>
        </div>
        <div className="flex gap-2 flex-none">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className={selectClass}
            style={{ color: 'var(--accent-on)' }}
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
            className={selectClass}
            style={{ color: 'var(--accent-on)' }}
          >
            {availableYears.map((year) => (
              <option key={year} value={year} className="text-gray-900">
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/15 p-3.5 rounded-[16px]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <ArrowUpRight size={16} strokeWidth={2.4} />
            <span className="text-[12px] opacity-85">Receitas</span>
          </div>
          <span className="font-bold text-[17px] tnum">{formatMoney(stats.totalIncome)}</span>
          <div className="text-[11.5px] opacity-70 mt-0.5">{stats.incomeCount} transações</div>
        </div>
        <div className="bg-white/15 p-3.5 rounded-[16px]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <ArrowDownRight size={16} strokeWidth={2.4} />
            <span className="text-[12px] opacity-85">Despesas</span>
          </div>
          <span className="font-bold text-[17px] tnum">{formatMoney(stats.totalExpenses)}</span>
          <div className="text-[11.5px] opacity-70 mt-0.5">{stats.expenseCount} transações</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <Mini label="Transações" value={String(stats.transactionCount)} caption="no total" />
        <Mini label="Média" value={formatMoney(stats.averageTransaction)} caption="por lançamento" />
        <Mini
          label="Maior"
          value={`R$ ${formatAmount0(Math.max(stats.largestIncome, stats.largestExpense))}`}
          caption="valor"
        />
      </div>
    </div>
  );
}

function Mini({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <div className="bg-white/10 p-2.5 rounded-[13px] text-center">
      <div className="text-[11px] opacity-75 mb-0.5">{label}</div>
      <div className="font-bold text-[13px] tnum truncate">{value}</div>
      <div className="text-[10.5px] opacity-60">{caption}</div>
    </div>
  );
}
