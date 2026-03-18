import { create } from 'zustand';
import Cookies from 'js-cookie';
import type { IUser } from '../types';

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: IUser) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!Cookies.get('token'),
  isLoading: true,

  setUser: (user: IUser) =>
    set({ user, isAuthenticated: true, isLoading: false }),

  setLoading: (isLoading: boolean) => set({ isLoading }),

  logout: () => {
    Cookies.remove('token');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
