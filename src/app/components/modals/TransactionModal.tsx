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
            <TransactionForm darkMode={darkMode} onClose={onClose} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
