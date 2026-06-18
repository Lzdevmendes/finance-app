import { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { themes } from '../../../constants/ui';

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
  darkMode: boolean;
  theme: keyof typeof themes;
}

export function AvatarModal({
  show,
  onClose,
  avatarOptions,
  selectedAvatar,
  setSelectedAvatar,
  onSave,
  loading,
  darkMode,
  theme,
}: AvatarModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[1000]">
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
            className={`absolute bottom-0 left-0 right-0 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } p-6 rounded-t-[2rem] shadow-2xl overflow-y-auto z-[1001]`}
            style={{ maxHeight: 'calc(90vh - env(safe-area-inset-top, 0px))', paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Escolher Avatar</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.src)}
                  className={`relative p-3 rounded-xl border-2 transition-all ${
                    selectedAvatar === avatar.src
                      ? `${themes[theme].primary} border-transparent`
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <img
                    src={avatar.src}
                    alt={avatar.name}
                    className="w-16 h-16 rounded-full object-cover mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${avatar.name}&background=${theme === 'emerald' ? '10b981' : theme === 'blue' ? '3b82f6' : theme === 'purple' ? '8b5cf6' : 'f97316'}&color=fff&size=64`;
                    }}
                  />
                  <p className="text-xs text-center mt-2 opacity-75">{avatar.name}</p>
                  {selectedAvatar === avatar.src && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle size={14} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => selectedAvatar && onSave(selectedAvatar)}
                disabled={!selectedAvatar || loading}
                className={`flex-1 py-3 px-4 ${themes[theme].primary} text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Avatar'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
