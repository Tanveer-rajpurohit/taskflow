import { useCallback } from 'react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useToastStore } from '../store/useToastStore';
import type { LoginCredentials, RegisterData, IUser } from '../types';

export const useAuth = () => {
  const { setUser, logout: clearStore, setLoading, isAuthenticated, user, isLoading } =
    useAuthStore();
  const router = useRouter();
  const { showToast } = useToastStore();

  const login = async (credentials: LoginCredentials): Promise<string | null> => {
    try {
      const data = await authService.login(credentials);
      if (data.success) {
        Cookies.set('token', data.token, { secure: true, sameSite: 'strict', expires: 7 });
        setUser(data.user);
        router.push('/dashboard');
        return null; // no error
      }
      return data.message ?? 'Login failed';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      if (msg.startsWith("RATE_LIMIT:")) {
        const cleanMsg = msg.replace("RATE_LIMIT:", "");
        showToast(cleanMsg, 'error');
        return cleanMsg;
      }
      return msg;
    }
  };

  const register = async (userData: RegisterData): Promise<string | null> => {
    try {
      const data = await authService.register(userData);
      if (data.success) {
        Cookies.set('token', data.token, { secure: true, sameSite: 'strict', expires: 7 });
        setUser(data.user);
        router.push('/dashboard');
        return null; // no error
      }
      return data.message ?? 'Registration failed';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      if (msg.startsWith("RATE_LIMIT:")) {
        const cleanMsg = msg.replace("RATE_LIMIT:", "");
        showToast(cleanMsg, 'error');
        return cleanMsg;
      }
      return msg;
    }
  };

  const fetchProfile = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      if (!Cookies.get('token')) {
        clearStore();
        return;
      }
      const data = await authService.getProfile();
      if (data.success && data.user) {
        const user: IUser = {
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
        };
        setUser(user);
      } else {
        clearStore();
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.startsWith("RATE_LIMIT:")) {
        showToast(err.message.replace("RATE_LIMIT:", ""), 'error');
        return;
      }
      clearStore();
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, clearStore]);

  const logout = (): void => {
    clearStore();
    router.push('/login');
  };

  return { login, register, fetchProfile, logout, user, isAuthenticated, isLoading };
};
