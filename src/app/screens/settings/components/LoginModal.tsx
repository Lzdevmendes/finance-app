import { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { themes } from '../../../constants/ui';

export interface LoginData {
  currentPassword: string;
  newEmail: string;
  newPassword: string;
  confirmPassword: string;
}

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  loginData: LoginData;
  setLoginData: Dispatch<SetStateAction<LoginData>>;
  onSubmit: () => void;
  loading: boolean;
  darkMode: boolean;
  theme: keyof typeof themes;
}

export function LoginModal({
  show,
  onClose,
  loginData,
  setLoginData,
  onSubmit,
  loading,
  darkMode,
  theme,
}: LoginModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md" />
          {/* Additional subtle overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative ${
              darkMode ? 'bg-gray-800/95' : 'bg-white/95'
            } backdrop-blur-xl rounded-3xl p-6 w-full max-w-md mx-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Alterar Login</h3>
              <button
                onClick={onClose}
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
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={onSubmit}
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
  );
}
