// screens/settings/useSettingsActions.ts
// Side-effects de perfil/login da tela de configurações, isolados da UI.
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { LoginData } from './components/LoginModal';

export function useSettingsActions() {
  const { user, updateUserProfile, updateUserEmail, updateUserPassword, reauthenticate } = useAuth();
  const [loading, setLoading] = useState(false);

  const updateAvatar = async (avatarSrc: string, onSuccess: () => void) => {
    setLoading(true);
    try {
      const result = await updateUserProfile({ photoURL: avatarSrc });
      if (result.error) {
        alert('Erro ao atualizar avatar: ' + result.error.message);
      } else {
        alert('Avatar atualizado com sucesso!');
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Erro ao atualizar avatar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const updateLogin = async (loginData: LoginData, onSuccess: () => void) => {
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
      const reauthResult = await reauthenticate(loginData.currentPassword);
      if (reauthResult.error) throw reauthResult.error;

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
        onSuccess();
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

  return { loading, updateAvatar, updateLogin };
}
