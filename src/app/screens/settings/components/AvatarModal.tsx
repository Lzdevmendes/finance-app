import { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2 } from 'lucide-react';

interface AvatarOption {
  id: string;
  src: string;
  name: string;
}

interface AvatarModalProps {
  show: boolean;
  onClose: () => void;
  avatarOptions: AvatarOption[];
  selectedAvatar: string | null;
  setSelectedAvatar: Dispatch<SetStateAction<string | null>>;
  onSave: (src: string) => void;
  loading: boolean;
}

export function AvatarModal({
  show,
  onClose,
  avatarOptions,
  selectedAvatar,
  setSelectedAvatar,
  onSave,
  loading,
}: AvatarModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center">
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
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md p-6 rounded-t-[28px] shadow-2xl overflow-y-auto z-[1001] border-t"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--line)',
              maxHeight: 'calc(90vh - env(safe-area-inset-top, 0px))',
              paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 rounded-full mx-auto mb-4" style={{ background: 'var(--line)' }} />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold">Escolher avatar</h3>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {avatarOptions.map((avatar) => {
                const isSelected = selectedAvatar === avatar.src;
                return (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.src)}
                    className="relative p-3 rounded-[14px] border-2 transition-all"
                    style={{
                      borderColor: isSelected ? 'var(--accent)' : 'var(--line)',
                      background: isSelected ? 'var(--accent-dim)' : 'transparent',
                    }}
                  >
                    <img
                      src={avatar.src}
                      alt={avatar.name}
                      className="w-14 h-14 rounded-full object-cover mx-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${avatar.name}&background=3fa679&color=fff&size=64`;
                      }}
                    />
                    <p className="text-[11px] text-center mt-2" style={{ color: 'var(--muted)' }}>
                      {avatar.name}
                    </p>
                    {isSelected && (
                      <div
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--accent)', color: 'var(--accent-on)' }}
                      >
                        <CheckCircle size={14} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-[14px] font-medium border"
                style={{ borderColor: 'var(--line)', color: 'var(--text)' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => selectedAvatar && onSave(selectedAvatar)}
                disabled={!selectedAvatar || loading}
                className="flex-1 py-3 px-4 rounded-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: 'var(--accent)', color: 'var(--accent-on)' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar avatar'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
