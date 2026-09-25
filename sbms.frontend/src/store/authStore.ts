import { create } from 'zustand';
import { parseJwtToken } from '@/lib/utils';

interface AuthState {
  token: string | null;
  userId: string | null;
  role: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string) => void;
  logout: () => void;
}

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return { token: null, userId: null, role: null, isAuthenticated: false };
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return { token: null, userId: null, role: null, isAuthenticated: false };
  }

  const parsed = parseJwtToken(token);
  return {
    token,
    userId: parsed?.userId || localStorage.getItem('userId') || null,
    role: parsed?.role || localStorage.getItem('role') || null,
    isAuthenticated: true,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),

  setAuth: (token: string) => {
    const parsed = parseJwtToken(token);
    const userId = parsed?.userId || '';
    const role = parsed?.role || '';

    localStorage.setItem('token', token);
    if (userId) localStorage.setItem('userId', userId);
    if (role) localStorage.setItem('role', role);

    set({
      token,
      userId,
      role,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    set({
      token: null,
      userId: null,
      role: null,
      isAuthenticated: false,
    });
  },
}));
