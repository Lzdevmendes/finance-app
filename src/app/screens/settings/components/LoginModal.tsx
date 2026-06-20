import { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

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
}

const fieldClass = 'w-full p-3 rounded-[14px] border outline-none focus:ring-2';
const fieldStyle = { background: 'var(--surface2)', borderColor: 'var(--line)', color: 'var(--text)' };
const labelClass = 'block text-[13px] font-medium mb-2';
const labelStyle = { color: 'var(--muted)' };

export function LoginModal({
  show,
  onClose,
  loginData,
  setLoginData,
  onSubmit,
  loading,
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative rounded-[24px] border p-6 w-full max-w-md mx-auto shadow-2xl"
            style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold">Alterar login</h3>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass} style={labelStyle}>Senha atual</label>
                <input
                  type="password"
                  value={loginData.currentPassword}
                  onChange={(e) => setLoginData({ ...loginData, currentPassword: e.target.value })}
                  className={fieldClass}
                  style={fieldStyle}
                  placeholder="Digite sua senha atual"
                  required
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Novo email</label>
                <input
                  type="email"
                  value={loginData.newEmail}
                  onChange={(e) => setLoginData({ ...loginData, newEmail: e.target.value })}
                  className={fieldClass}
                  style={fieldStyle}
                  placeholder="novo@email.com"
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Nova senha</label>
                <input
                  type="password"
                  value={loginData.newPassword}
                  onChange={(e) => setLoginData({ ...loginData, newPassword: e.target.value })}
                  className={fieldClass}
                  style={fieldStyle}
                  placeholder="Digite a nova senha"
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Confirmar nova senha</label>
                <input
                  type="password"
                  value={loginData.confirmPassword}
                  onChange={(e) => setLoginData({ ...loginData, confirmPassword: e.target.value })}
                  className={fieldClass}
                  style={fieldStyle}
                  placeholder="Confirme a nova senha"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-[14px] font-medium border"
                  style={{ borderColor: 'var(--line)', color: 'var(--text)' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={onSubmit}
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-[14px] font-medium disabled:opacity-50"
                  style={{ background: 'var(--accent)', color: 'var(--accent-on)' }}
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
