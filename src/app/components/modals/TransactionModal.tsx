import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { TransactionForm } from './TransactionForm';

export function TransactionModal({
  show,
  onClose,
  darkMode,
}: {
  show: boolean;
  onClose: () => void;
  darkMode: boolean;
}) {
  if (!show) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-end justify-center">
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
          className="relative w-full max-w-md rounded-t-[28px] shadow-2xl z-[1001] border-t"
          style={{ maxHeight: 'calc(92vh - env(safe-area-inset-top, 0px))', background: 'var(--surface)', borderColor: 'var(--line)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header fixo */}
          <div
            className="sticky top-0 z-10 p-6 pb-4 border-b rounded-t-[28px]"
            style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
          >
            <div className="w-12 h-1.5 rounded-full mx-auto mb-4 sm:hidden" style={{ background: 'var(--line)' }} />
            <div className="flex items-center justify-between">
              <h3 className="text-[19px] font-bold">Novo lançamento</h3>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Conteúdo com scroll */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(92vh - env(safe-area-inset-top, 0px) - 120px)', paddingBottom: 'env(safe-area-inset-bottom, 1rem)' }}>
            <TransactionForm darkMode={darkMode} onClose={onClose} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
