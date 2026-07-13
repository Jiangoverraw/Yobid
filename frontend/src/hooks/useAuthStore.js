import { create } from 'zustand';
import { authApi } from '../services/api';

const getInitialUser = () => {
  try {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: getInitialUser(),
  loading: true,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  initAuth: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      set({ loading: false });
      return;
    }
    try {
      const profile = await authApi.getProfile();
      localStorage.setItem('user', JSON.stringify(profile));
      set({ user: profile, loading: false });
    } catch (err) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      set({ user: null, loading: false });
    }
  },

  login: async (email, password, rememberMe = false) => {
    const data = await authApi.login(email, password, rememberMe);
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    set({ user: data.user });
    return data;
  },

  loginWithToken: async (token) => {
    localStorage.setItem('access_token', token);
    const profile = await authApi.getProfile();
    localStorage.setItem('user', JSON.stringify(profile));
    set({ user: profile });
    return profile;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    set({ user: null });
  },

  updateUser: (updated) => {
    localStorage.setItem('user', JSON.stringify(updated));
    set({ user: updated });
  }
}));
