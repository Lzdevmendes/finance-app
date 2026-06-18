import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/auth.service';
import type { User } from '../services/auth.service';

interface AuthResult {
  error: Error | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, name?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: { displayName?: string; photoURL?: string }) => Promise<AuthResult>;
  updateUserEmail: (newEmail: string) => Promise<AuthResult>;
  updateUserPassword: (newPassword: string) => Promise<AuthResult>;
  reauthenticate: (currentPassword: string) => Promise<AuthResult>;
  uploadProfileImage: (file: File) => Promise<AuthResult & { url?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string): Promise<AuthResult> => {
    try {
      await authService.signUp(email, password, name);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      await authService.signIn(email, password);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await authService.signOut();
  };

  const updateUserProfile = async (updates: {
    displayName?: string;
    photoURL?: string;
  }): Promise<AuthResult> => {
    try {
      if (user) {
        const updated = await authService.updateUserProfile(user, updates);
        setUser(updated);
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updateUserEmail = async (newEmail: string): Promise<AuthResult> => {
    try {
      if (user) {
        await authService.updateUserEmail(user, newEmail);
        setUser({ ...user, email: newEmail } as User);
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updateUserPassword = async (newPassword: string): Promise<AuthResult> => {
    try {
      if (user) {
        await authService.updateUserPassword(user, newPassword);
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const reauthenticate = async (currentPassword: string): Promise<AuthResult> => {
    try {
      if (user) {
        await authService.reauthenticate(user, currentPassword);
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const uploadProfileImage = async (file: File): Promise<AuthResult & { url?: string }> => {
    try {
      if (!user) throw new Error('User not authenticated');
      const url = await authService.uploadProfileImage(user, file);
      setUser({ ...user, photoURL: url } as User);
      return { error: null, url };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUserProfile,
        updateUserEmail,
        updateUserPassword,
        reauthenticate,
        uploadProfileImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
