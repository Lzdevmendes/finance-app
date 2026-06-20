import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, Check } from 'lucide-react';
import { useRecurrences } from '../../hooks/useRecurrences';
import { ScreenHeader } from '../../components/ScreenHeader';
import { formatMoney } from '../../utils/format';
import type { RecurringFrequency } from '../../types';
import type { Recurrence } from './types';
import { RecurrenceSheet } from './RecurrenceSheet';

const FREQ_LABEL: Record<RecurringFrequency, string> = {
  monthly: 'Mensal',
  weekly: 'Semanal',
  yearly: 'Anual',
};

// Equivalente mensal para o total previsto.
const monthlyEquivalent = (r: { value: number; frequency: RecurringFrequency }) =>
  r.frequency === 'monthly' ? r.value : r.frequency === 'weekly' ? (r.value * 52) / 12 : r.value / 12;

export function RecurrencesScreen() {
  const { items, save: saveRecurrence, remove: removeRecurrence, togglePaid: toggle } = useRecurrences();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Recurrence | null>(null);

  const monthKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}`;
  }, []);
  const isPaid = (r: { paidMonths: string[] }) => (r.paidMonths ?? []).includes(monthKey);

  const totalMonthly = items.reduce((acc, r) => acc + monthlyEquivalent(r), 0);
  const pendingCount = items.filter((r) => !isPaid(r)).length;

  const save = (data: Omit<Recurrence, 'id'>, id?: string) => {
    saveRecurrence(data, id);
    setSheetOpen(false);
    setEditing(null);
  };
  const remove = (id: string) => {
    removeRecurrence(id);
    setSheetOpen(false);
    setEditing(null);
  };

  const openNew = () => {
    setEditing(null);
    setSheetOpen(true);
  };
  const openEdit = (r: Recurrence) => {
    setEditing(r);
    setSheetOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-[22px] pb-28 pt-2 space-y-4"
    >
      <ScreenHeader
        title="Recorrências"
        back="more"
        action={
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={openNew}
            aria-label="Nova recorrência"
            className="w-10 h-10 flex-none rounded-[13px] flex items-center justify-center"
            style={{ background: 'var(--accent)', color: 'var(--accent-on)' }}
          >
            <Plus size={20} strokeWidth={2.4} />
          </motion.button>
        }
      />

      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-[16px] border" style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}>
            <div className="text-[12px] mb-1" style={{ color: 'var(--faint)' }}>Previsto / mês</div>
            <div className="text-[18px] font-bold tnum">{formatMoney(totalMonthly)}</div>
          </div>
          <div className="p-4 rounded-[16px] border" style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}>
            <div className="text-[12px] mb-1" style={{ color: 'var(--faint)' }}>Pendentes do mês</div>
            <div className="text-[18px] font-bold tnum" style={{ color: pendingCount > 0 ? 'var(--warn)' : 'var(--income)' }}>
              {pendingCount}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        {items.map((r) => {
          const done = isPaid(r);
          return (
            <div
              key={r.id}
              className="p-4 rounded-[16px] border flex items-center gap-3"
              style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
            >
              <button onClick={() => openEdit(r)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                <div
                  className="w-[42px] h-[42px] flex-none rounded-[13px] flex items-center justify-center"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                >
                  <RefreshCw size={19} strokeWidth={1.9} />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[14.5px] truncate">{r.name}</div>
                  <div className="text-[12px]" style={{ color: 'var(--faint)' }}>
                    {FREQ_LABEL[r.frequency]} · dia {r.dueDay}
                  </div>
                </div>
              </button>
              <div className="text-right flex-none">
                <div className="font-bold text-[14px] tnum">{formatMoney(r.value)}</div>
              </div>
              <button
                onClick={() => toggle(r.id, monthKey)}
                aria-label={done ? 'Marcar como pendente' : 'Marcar como pago'}
                className="w-9 h-9 flex-none rounded-full flex items-center justify-center border transition-colors"
                style={
                  done
                    ? { background: 'var(--income)', borderColor: 'transparent', color: '#fff' }
                    : { background: 'transparent', borderColor: 'var(--line)', color: 'var(--faint)' }
                }
              >
                <Check size={17} strokeWidth={2.6} />
              </button>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="text-center py-14" style={{ color: 'var(--faint)' }}>
            <div
              className="w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
            >
              <RefreshCw size={28} />
            </div>
            <p className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>
              Nenhuma recorrência ainda
            </p>
            <p className="text-[13px] mt-1">Cadastre contas fixas e assinaturas para acompanhar</p>
          </div>
        )}
      </div>

      <RecurrenceSheet
        open={sheetOpen}
        editing={editing}
        onClose={() => {
          setSheetOpen(false);
          setEditing(null);
        }}
        onSave={save}
        onRemove={remove}
      />
    </motion.div>
  );
}
