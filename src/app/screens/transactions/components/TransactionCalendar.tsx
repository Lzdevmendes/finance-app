import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Transaction, TransactionType } from '../../../types';
import { TransactionItem } from './TransactionItem';

interface TransactionCalendarProps {
  transactions: Transaction[];
  darkMode: boolean;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export function TransactionCalendar({ transactions, darkMode, onEdit, onDelete }: TransactionCalendarProps) {
  const today = new Date();
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedKey, setSelectedKey] = useState<string>(() => dayKey(today));

  // Resumo por dia do mês visível: tem receita / tem despesa.
  const byDay = useMemo(() => {
    const map: Record<string, { income: boolean; expense: boolean; list: Transaction[] }> = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = dayKey(d);
      const entry = (map[key] ??= { income: false, expense: false, list: [] });
      entry.list.push(t);
      if (t.type === TransactionType.INCOME) entry.income = true;
      else entry.expense = true;
    });
    return map;
  }, [transactions]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const move = (delta: number) => {
    setCursor(new Date(year, month + delta, 1));
  };

  const selectedList = byDay[selectedKey]?.list ?? [];

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-[18px] border" style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}>
        {/* Cabeçalho do mês */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => move(-1)}
            aria-label="Mês anterior"
            className="w-8 h-8 rounded-[10px] flex items-center justify-center"
            style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-bold text-[15px]">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={() => move(1)}
            aria-label="Próximo mês"
            className="w-8 h-8 rounded-[10px] flex items-center justify-center"
            style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 mb-1.5">
          {WEEKDAYS.map((w, i) => (
            <div key={i} className="text-center text-[11px] font-semibold" style={{ color: 'var(--faint)' }}>
              {w}
            </div>
          ))}
        </div>

        {/* Grade */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const d = new Date(year, month, day);
            const key = dayKey(d);
            const info = byDay[key];
            const isSelected = key === selectedKey;
            const isToday = key === dayKey(today);
            return (
              <button
                key={i}
                onClick={() => setSelectedKey(key)}
                className="aspect-square flex flex-col items-center justify-center rounded-[11px] relative"
                style={
                  isSelected
                    ? { background: 'var(--accent)', color: 'var(--accent-on)' }
                    : { color: isToday ? 'var(--accent)' : 'var(--text)' }
                }
              >
                <span className={`text-[13.5px] ${isToday && !isSelected ? 'font-extrabold' : 'font-medium'}`}>
                  {day}
                </span>
                {info && (
                  <span className="flex gap-0.5 mt-0.5 h-1.5">
                    {info.income && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: isSelected ? 'var(--accent-on)' : 'var(--income)' }}
                      />
                    )}
                    {info.expense && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: isSelected ? 'var(--accent-on)' : 'var(--expense)' }}
                      />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transações do dia selecionado */}
      <motion.div
        key={selectedKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        {selectedList.length > 0 ? (
          selectedList.map((t) => (
            <TransactionItem key={t.id} transaction={t} darkMode={darkMode} onEdit={onEdit} onDelete={onDelete} />
          ))
        ) : (
          <div className="text-center py-8 text-[13px]" style={{ color: 'var(--faint)' }}>
            Nenhuma transação neste dia
          </div>
        )}
      </motion.div>
    </div>
  );
}
