import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/auth.service';
import type { User } from '../services/auth.service';
import { Result, ok, err } from '../utils/result';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<Result>;
  signUp: (email: string, password: string, name?: string) => Promise<Result>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: { displayName?: string; photoURL?: string }) => Promise<Result>;
  updateUserEmail: (newEmail: string) => Promise<Result>;
  updateUserPassword: (newPassword: string) => Promise<Result>;
  reauthenticate: (currentPassword: string) => Promise<Result>;
  uploadProfileImage: (file: File) => Promise<Result<string>>;
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

  const signUp = async (email: string, password: string, name?: string): Promise<Result> => {
    try {
      await authService.signUp(email, password, name);
      return ok(undefined);
    } catch (error) {
      return err(error);
    }
  };

  const signIn = async (email: string, password: string): Promise<Result> => {
    try {
      await authService.signIn(email, password);
      return ok(undefined);
    } catch (error) {
      return err(error);
    }
  };

  const signOut = async () => {
    await authService.signOut();
  };

  const updateUserProfile = async (updates: {
    displayName?: string;
    photoURL?: string;
  }): Promise<Result> => {
    try {
      if (user) {
        const updated = await authService.updateUserProfile(user, updates);
        setUser(updated);
      }
      return ok(undefined);
    } catch (error) {
      return err(error);
    }
  };

  const updateUserEmail = async (newEmail: string): Promise<Result> => {
    try {
      if (user) {
        await authService.updateUserEmail(user, newEmail);
        setUser({ ...user, email: newEmail } as User);
      }
      return ok(undefined);
    } catch (error) {
      return err(error);
    }
  };

  const updateUserPassword = async (newPassword: string): Promise<Result> => {
    try {
      if (user) {
        await authService.updateUserPassword(user, newPassword);
      }
      return ok(undefined);
    } catch (error) {
      return err(error);
    }
  };

  const reauthenticate = async (currentPassword: string): Promise<Result> => {
    try {
      if (user) {
        await authService.reauthenticate(user, currentPassword);
      }
      return ok(undefined);
    } catch (error) {
      return err(error);
    }
  };

  const uploadProfileImage = async (file: File): Promise<Result<string>> => {
    try {
      if (!user) throw new Error('User not authenticated');
      const url = await authService.uploadProfileImage(user, file);
      setUser({ ...user, photoURL: url } as User);
      return ok(url);
    } catch (error) {
      return err(error);
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
