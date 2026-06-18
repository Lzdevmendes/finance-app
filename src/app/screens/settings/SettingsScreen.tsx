import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Shield, ChevronRight, Moon, Sun, Download, LogOut, X, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFinance } from '../../contexts/FinanceContext';
import { themes } from '../../constants/ui';

export function SettingsScreen() {
  const { user, signOut, updateUserProfile, updateUserEmail, updateUserPassword, reauthenticate } = useAuth();
  const { transactions, preferences, updatePreferences, goals } = useFinance();
  const { theme, darkMode } = preferences;

  // Avatar options
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

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Set current avatar as selected when modal opens
  useEffect(() => {
    if (showAvatarModal && user?.photoURL) {
      // Check if current photoURL matches any of our predefined avatars
      const currentAvatar = avatarOptions.find(avatar => avatar.src === user.photoURL);
      if (currentAvatar) {
        setSelectedAvatar(currentAvatar.src);
      }
    }
  }, [showAvatarModal, user?.photoURL]);
  const [loginData, setLoginData] = useState({
    currentPassword: '',
    newEmail: user?.email || '',
    newPassword: '',
    confirmPassword: '',
  });
  const exportData = () => {
    const data = {
      user: {
        id: user?.uid,
        email: user?.email,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
        createdAt: user?.metadata?.creationTime,
        lastLogin: user?.metadata?.lastSignInTime,
      },
      preferences,
      transactions: transactions.map(t => ({
        id: t.id,
        date: t.date,
        description: t.description,
        type: t.type,
        value: t.value,
        category: t.category,
        account: t.account,
        tags: t.tags,
        createdAt: t.createdAt,
      })),
      goals: goals.map(g => ({
        id: g.id,
        title: g.name,
        target: g.targetAmount,
        current: g.currentAmount,
        deadline: g.deadline,
        icon: g.icon,
        color: g.color,
        createdAt: g.createdAt,
      })),
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financas-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = [
      'Data',
      'Descrição',
      'Tipo',
      'Valor',
      'Categoria',
      'Conta',
      'Tags',
      'Mês/Ano'
    ];

    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString('pt-BR'),
      t.description,
      t.type === 'income' ? 'Receita' : 'Despesa',
      t.value.toFixed(2).replace('.', ','),
      t.category,
      t.account,
      t.tags.join('; '),
      new Date(t.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    ]);

    // Adicionar linha em branco
    rows.push(['', '', '', '', '', '', '', '']);

    // Adicionar resumo mensal
    const monthlySummary = transactions.reduce((acc, t) => {
      const monthYear = new Date(t.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      if (!acc[monthYear]) {
        acc[monthYear] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        acc[monthYear].income += t.value;
      } else {
        acc[monthYear].expense += t.value;
      }
      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    rows.push(['RESUMO MENSAL', '', '', '', '', '', '', '']);
    rows.push(['Mês/Ano', 'Receitas', 'Despesas', 'Saldo', '', '', '', '']);

    Object.entries(monthlySummary).forEach(([month, data]) => {
      const balance = data.income - data.expense;
      rows.push([
        month,
        data.income.toFixed(2).replace('.', ','),
        data.expense.toFixed(2).replace('.', ','),
        balance.toFixed(2).replace('.', ','),
        '', '', '', ''
      ]);
    });

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAvatarSelect = async (avatarSrc: string) => {
    setLoading(true);
    try {
      // Update user profile with selected avatar
      const result = await updateUserProfile({ photoURL: avatarSrc });
      if (result.error) {
        alert('Erro ao atualizar avatar: ' + result.error.message);
      } else {
        alert('Avatar atualizado com sucesso!');
        setSelectedAvatar(null); // Reset selected avatar
        setShowAvatarModal(false); // Close modal
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Erro ao atualizar avatar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginUpdate = async () => {
    if (loginData.newPassword !== loginData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (!loginData.currentPassword) {
      alert('Por favor, digite sua senha atual para confirmar as alterações.');
      return;
    }

    setLoading(true);
    try {
      let emailUpdated = false;
      let passwordUpdated = false;

      // Re-authenticate user before making changes
      if (loginData.currentPassword) {
        const reauthResult = await reauthenticate(loginData.currentPassword);
        if (reauthResult.error) throw reauthResult.error;
      }

      if (loginData.newEmail !== user?.email) {
        const result = await updateUserEmail(loginData.newEmail);
        if (result.error) {
          alert('Erro ao atualizar email: ' + result.error.message);
          return;
        }
        emailUpdated = true;
      }

      if (loginData.newPassword) {
        const result = await updateUserPassword(loginData.newPassword);
        if (result.error) {
          alert('Erro ao atualizar senha: ' + result.error.message);
          return;
        }
        passwordUpdated = true;
      }

      if (emailUpdated || passwordUpdated) {
        alert('Informações de login atualizadas com sucesso!');
        setShowLoginModal(false);
        setLoginData({
          currentPassword: '',
          newEmail: user?.email || '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        alert('Nenhuma alteração foi feita.');
      }
    } catch (error: any) {
      console.error('Login update error:', error);
      if (error.code === 'auth/wrong-password') {
        alert('Senha atual incorreta. Por favor, verifique e tente novamente.');
      } else if (error.code === 'auth/requires-recent-login') {
        alert('Por segurança, faça login novamente antes de alterar suas informações.');
      } else {
        alert('Erro ao atualizar informações: ' + (error.message || 'Erro desconhecido'));
      }
    } finally {
      setLoading(false);
    }
  };
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
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}&background=${theme === 'emerald' ? '10b981' : theme === 'blue' ? '3b82f6' : theme === 'purple' ? '8b5cf6' : 'f97316'}&color=fff&size=80`}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  onError={(e) => {
                    // Fallback to avatar if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}&background=${theme === 'emerald' ? '10b981' : theme === 'blue' ? '3b82f6' : theme === 'purple' ? '8b5cf6' : 'f97316'}&color=fff&size=80`;
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
              onClick={exportData}
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
              onClick={exportCSV}
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

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <div className="fixed inset-0 z-[1000]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => { setShowAvatarModal(false); setSelectedAvatar(null); }}
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
                  onClick={() => { setShowAvatarModal(false); setSelectedAvatar(null); }}
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
                  onClick={() => {
                    setShowAvatarModal(false);
                    setSelectedAvatar(null);
                  }}
                  className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => selectedAvatar && handleAvatarSelect(selectedAvatar)}
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

      {/* Login Edit Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLoginModal(false)}
          >
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md" />
            {/* Additional subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative ${
                darkMode ? 'bg-gray-800/95' : 'bg-white/95'
              } backdrop-blur-xl rounded-3xl p-6 w-full max-w-md mx-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Alterar Login</h3>
                <button
                  onClick={() => setShowLoginModal(false)}
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
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleLoginUpdate}
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
    </motion.div>
  );
}
