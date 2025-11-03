import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import api from '../api/client.js';

export const AuthContext = createContext({
  user: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refresh: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err.response?.data?.message || null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = () => {
      setUser(null);
    };
    document.addEventListener('auth:unauthorized', handler);

    return () => {
      document.removeEventListener('auth:unauthorized', handler);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      register,
      logout,
      refresh,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, error, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
