import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Shield, ChevronRight, Moon, Sun, Download, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFinance } from '../../contexts/FinanceContext';
import { themes } from '../../constants/ui';
import { exportToJSON, exportToCSV } from '../../utils/exportData';
import { useSettingsActions } from './useSettingsActions';
import { AvatarModal } from './components/AvatarModal';
import { LoginModal, type LoginData } from './components/LoginModal';

const avatarOptions = [
  { id: 'avatar1', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', name: 'Felix' },
  { id: 'avatar2', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', name: 'Aneka' },
  { id: 'avatar3', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Baby', name: 'Baby' },
  { id: 'avatar4', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie', name: 'Charlie' },
  { id: 'avatar5', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dusty', name: 'Dusty' },
  { id: 'avatar6', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fluffy', name: 'Fluffy' },
  { id: 'avatar7', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Garfield', name: 'Garfield' },
  { id: 'avatar8', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max', name: 'Max' },
  { id: 'avatar9', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo', name: 'Milo' },
  { id: 'avatar10', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar', name: 'Oscar' },
  { id: 'avatar11', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Simba', name: 'Simba' },
  { id: 'avatar12', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tiger', name: 'Tiger' },
];

export function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { transactions, preferences, updatePreferences, goals } = useFinance();
  const { theme, darkMode } = preferences;
  const { loading, updateAvatar, updateLogin } = useSettingsActions();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [loginData, setLoginData] = useState<LoginData>({
    currentPassword: '',
    newEmail: user?.email || '',
    newPassword: '',
    confirmPassword: '',
  });

  // Set current avatar as selected when modal opens
  useEffect(() => {
    if (showAvatarModal && user?.photoURL) {
      const currentAvatar = avatarOptions.find((avatar) => avatar.src === user.photoURL);
      if (currentAvatar) {
        setSelectedAvatar(currentAvatar.src);
      }
    }
  }, [showAvatarModal, user?.photoURL]);

  const handleAvatarSelect = (avatarSrc: string) =>
    updateAvatar(avatarSrc, () => {
      setSelectedAvatar(null);
      setShowAvatarModal(false);
    });

  const handleLoginUpdate = () =>
    updateLogin(loginData, () => {
      setShowLoginModal(false);
      setLoginData({
        currentPassword: '',
        newEmail: user?.email || '',
        newPassword: '',
        confirmPassword: '',
      });
    });

  const avatarFallback = `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}&background=${theme === 'emerald' ? '10b981' : theme === 'blue' ? '3b82f6' : theme === 'purple' ? '8b5cf6' : 'f97316'}&color=fff&size=80`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-bold">Configurações</h3>

      {/* Profile Section */}
      <div
        className={`${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-3xl overflow-hidden shadow-sm border ${
          darkMode ? 'border-gray-700' : 'border-gray-100'
        }`}
      >
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <p className="text-sm font-semibold opacity-50 mb-4">PERFIL</p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user?.photoURL || avatarFallback}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = avatarFallback;
                  }}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{user?.displayName || 'Usuário'}</h4>
                <p className="text-sm opacity-60">{user?.email}</p>
              </div>
              <button
                onClick={() => setShowAvatarModal(true)}
                className={`p-2 rounded-lg ${themes[theme].primary} text-white`}
              >
                <Edit size={16} />
              </button>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Shield size={18} className="text-gray-600 dark:text-gray-300" />
                </div>
                <span className="font-medium text-sm">Alterar Email e Senha</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <p className="text-sm font-semibold opacity-50 mb-4">APARÊNCIA</p>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Tema de Cor</p>
              <div className="flex gap-3">
                {(Object.keys(themes) as Array<keyof typeof themes>).map((t) => (
                  <button
                    key={t}
                    onClick={() => updatePreferences({ theme: t })}
                    className={`w-12 h-12 rounded-full ${themes[t].primary} border-4 ${
                      theme === t
                        ? 'border-white ring-2 ring-gray-300 dark:ring-gray-600'
                        : 'border-transparent'
                    } transition-all active:scale-90`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                <span className="font-medium">Modo Escuro</span>
              </div>
              <button
                onClick={() => updatePreferences({ darkMode: !darkMode })}
                className={`w-14 h-8 rounded-full transition-colors ${
                  darkMode ? themes[theme].primary : 'bg-gray-200'
                } relative`}
              >
                <motion.div
                  animate={{ x: darkMode ? 24 : 0 }}
                  className="w-6 h-6 bg-white rounded-full absolute top-1 left-1"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <p className="text-sm font-semibold opacity-50 mb-4">DADOS</p>
          <div className="space-y-2">
            <button
              onClick={() => exportToJSON(user, preferences, transactions, goals)}
              className="w-full flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Download size={18} className="text-gray-600 dark:text-gray-300" />
                </div>
                <span className="font-medium text-sm">Exportar JSON</span>
              </div>
            </button>
            <button
              onClick={() => exportToCSV(transactions)}
              className="w-full flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Download size={18} className="text-gray-600 dark:text-gray-300" />
                </div>
                <span className="font-medium text-sm">Exportar CSV</span>
              </div>
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="p-5">
          <button
            onClick={() => {
              if (confirm('Deseja realmente sair?')) {
                signOut();
              }
            }}
            className="w-full flex items-center justify-between py-3 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl px-3 transition-colors text-rose-600"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <LogOut size={18} />
              </div>
              <span className="font-medium text-sm">Sair da Conta</span>
            </div>
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="text-center opacity-30 text-xs space-y-1">
        <p>ID: {user?.uid?.slice(0, 8)}...</p>
        <p>Email: {user?.email}</p>
        <p className="font-semibold">Finanças Pro v1.0.0</p>
        <p>Desenvolvido com ❤️</p>
      </div>

      <AvatarModal
        show={showAvatarModal}
        onClose={() => { setShowAvatarModal(false); setSelectedAvatar(null); }}
        avatarOptions={avatarOptions}
        selectedAvatar={selectedAvatar}
        setSelectedAvatar={setSelectedAvatar}
        onSave={handleAvatarSelect}
        loading={loading}
        darkMode={darkMode}
        theme={theme}
      />

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        loginData={loginData}
        setLoginData={setLoginData}
        onSubmit={handleLoginUpdate}
        loading={loading}
        darkMode={darkMode}
        theme={theme}
      />
    </motion.div>
  );
}
