import { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the entire app.
 * Delegates authentication state and lifecycle to useAuthStore (Zustand).
 */
export function AuthProvider({ children }) {
  const store = useAuthStore();

  useEffect(() => {
    store.initAuth();
  }, []);

  const isAuthenticated = Boolean(store.user);
  const role = store.user?.role ?? null;

  const value = {
    user: store.user,
    loading: store.loading,
    isAuthenticated,
    role,
    login: store.login,
    loginWithToken: store.loginWithToken,
    logout: store.logout,
    updateUser: store.updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to consume auth context */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
