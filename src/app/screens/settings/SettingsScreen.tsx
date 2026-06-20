import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Shield, ChevronRight, Moon, Sun, Download, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFinance } from '../../contexts/FinanceContext';
import { themes } from '../../constants/ui';
import { exportToJSON, exportToCSV } from '../../utils/exportData';
import { ScreenHeader } from '../../components/ScreenHeader';
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

// Hex dos 4 accents (espelham src/styles/theme.css) p/ os swatches do seletor.
const ACCENT_SWATCHES: Record<keyof typeof themes, string> = {
  emerald: '#3fa679',
  blue: '#4f86e8',
  purple: '#9b7be0',
  rose: '#e0728c',
};

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

  const avatarFallback = `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}&background=3fa679&color=fff&size=80`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-[22px] pb-28 pt-2 space-y-4"
    >
      <ScreenHeader title="Ajustes" back="more" />

      {/* Perfil */}
      <Section label="Perfil">
        <div className="flex items-center gap-4 mb-2">
          <img
            src={user?.photoURL || avatarFallback}
            alt="Perfil"
            className="w-14 h-14 rounded-full object-cover"
            style={{ border: '2px solid var(--line)' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = avatarFallback;
            }}
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[15px] truncate">{user?.displayName || 'Usuário'}</h4>
            <p className="text-[12.5px] truncate" style={{ color: 'var(--faint)' }}>
              {user?.email}
            </p>
          </div>
          <button
            onClick={() => setShowAvatarModal(true)}
            aria-label="Trocar avatar"
            className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-none"
            style={{ background: 'var(--accent)', color: 'var(--accent-on)' }}
          >
            <Pencil size={15} strokeWidth={2.2} />
          </button>
        </div>
        <Row icon={Shield} label="Alterar email e senha" onClick={() => setShowLoginModal(true)} />
      </Section>

      {/* Aparência */}
      <Section label="Aparência">
        <p className="text-[13px] font-medium mb-3" style={{ color: 'var(--muted)' }}>
          Cor de destaque
        </p>
        <div className="flex gap-3 mb-2">
          {(Object.keys(themes) as Array<keyof typeof themes>).map((t) => (
            <button
              key={t}
              onClick={() => updatePreferences({ theme: t })}
              aria-label={t}
              className="w-11 h-11 rounded-full transition-all active:scale-90"
              style={{
                background: ACCENT_SWATCHES[t],
                boxShadow: theme === t ? '0 0 0 3px var(--surface), 0 0 0 5px var(--accent)' : 'none',
              }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={19} /> : <Sun size={19} />}
            <span className="font-medium text-[14px]">Modo escuro</span>
          </div>
          <button
            onClick={() => updatePreferences({ darkMode: !darkMode })}
            aria-label="Alternar modo escuro"
            className="w-14 h-8 rounded-full relative transition-colors"
            style={{ background: darkMode ? 'var(--accent)' : 'var(--surface2)' }}
          >
            <motion.div
              animate={{ x: darkMode ? 24 : 0 }}
              className="w-6 h-6 rounded-full absolute top-1 left-1"
              style={{ background: '#fff' }}
            />
          </button>
        </div>
      </Section>

      {/* Dados */}
      <Section label="Dados">
        <Row icon={Download} label="Exportar JSON" onClick={() => exportToJSON(user, preferences, transactions, goals)} />
        <Row icon={Download} label="Exportar CSV" onClick={() => exportToCSV(transactions)} />
      </Section>

      {/* Sair */}
      <Section>
        <button
          onClick={() => {
            if (confirm('Deseja realmente sair?')) {
              signOut();
            }
          }}
          className="w-full flex items-center gap-3 py-1.5"
          style={{ color: 'var(--expense)' }}
        >
          <div
            className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-none"
            style={{ background: 'rgba(207,91,63,.12)' }}
          >
            <LogOut size={17} strokeWidth={2} />
          </div>
          <span className="font-medium text-[14px]">Sair da conta</span>
        </button>
      </Section>

      <div className="text-center text-[11.5px] space-y-0.5 pt-2" style={{ color: 'var(--faint)' }}>
        <p className="font-semibold">Finanças Pro v1.0.0</p>
        <p>Feito com ❤️</p>
      </div>

      <AvatarModal
        show={showAvatarModal}
        onClose={() => { setShowAvatarModal(false); setSelectedAvatar(null); }}
        avatarOptions={avatarOptions}
        selectedAvatar={selectedAvatar}
        setSelectedAvatar={setSelectedAvatar}
        onSave={handleAvatarSelect}
        loading={loading}
      />

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        loginData={loginData}
        setLoginData={setLoginData}
        onSubmit={handleLoginUpdate}
        loading={loading}
      />
    </motion.div>
  );
}

function Section({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[18px] border p-4" style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}>
      {label && (
        <p className="text-[11.5px] font-semibold tracking-wide mb-3" style={{ color: 'var(--faint)' }}>
          {label.toUpperCase()}
        </p>
      )}
      {children}
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Shield;
  label: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 py-2.5">
      <div
        className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-none"
        style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
      >
        <Icon size={17} strokeWidth={2} />
      </div>
      <span className="flex-1 text-left font-medium text-[14px]">{label}</span>
      <ChevronRight size={18} strokeWidth={2} style={{ color: 'var(--faint)' }} />
    </button>
  );
}
