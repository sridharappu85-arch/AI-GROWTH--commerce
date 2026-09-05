import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiRequest } from '../utils/api';

interface UserContextType {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  switchUser: (userId: string) => Promise<void>;
  switchRole: (role: 'CUSTOMER' | 'ADMIN') => Promise<void>;
  login: (credentials: { email?: string; userId?: string }) => Promise<{ success: boolean; message?: string }>;
  register: (payload: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadUsersAndMe = async () => {
    try {
      setLoading(true);
      const allUsers = await apiRequest<User[]>('/auth/users');
      setUsers(allUsers);

      const savedUserId = localStorage.getItem('nex_active_user_id');
      let targetUser = allUsers.find(u => u.id === savedUserId);

      if (!targetUser && allUsers.length > 0) {
        targetUser = allUsers.find(u => u.role === 'CUSTOMER') || allUsers[0];
        localStorage.setItem('nex_active_user_id', targetUser.id);
      }

      setCurrentUser(targetUser || null);
    } catch (error) {
      console.error('Failed to load users context:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsersAndMe();
  }, []);

  const switchUser = async (userId: string) => {
    const selected = users.find(u => u.id === userId);
    if (selected) {
      localStorage.setItem('nex_active_user_id', selected.id);
      setCurrentUser(selected);
      // Reload page state or refresh relevant data
      window.location.reload();
    }
  };

  const switchRole = async (role: 'CUSTOMER' | 'ADMIN') => {
    const candidate = users.find(u => u.role === role);
    if (candidate) {
      await switchUser(candidate.id);
    }
  };

  const login = async (credentials: { email?: string; userId?: string }) => {
    try {
      const res = await apiRequest<{ success: boolean; message: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      if (res.user) {
        localStorage.setItem('nex_active_user_id', res.user.id);
        setCurrentUser(res.user);
        return { success: true, message: res.message };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (payload: any) => {
    try {
      const res = await apiRequest<{ success: boolean; message: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.user) {
        localStorage.setItem('nex_active_user_id', res.user.id);
        setCurrentUser(res.user);
        // Refresh users list
        const allUsers = await apiRequest<User[]>('/auth/users');
        setUsers(allUsers);
        return { success: true, message: res.message };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('nex_active_user_id');
    const guestUser = users.find(u => u.role === 'CUSTOMER') || users[0];
    if (guestUser) {
      localStorage.setItem('nex_active_user_id', guestUser.id);
      setCurrentUser(guestUser);
    } else {
      setCurrentUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const me = await apiRequest<User>('/auth/me');
      setCurrentUser(me);
    } catch (e) {
      console.error('Refresh user error:', e);
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        users,
        loading,
        switchUser,
        switchRole,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
