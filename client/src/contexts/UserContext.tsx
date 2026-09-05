import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiRequest } from '../utils/api';

interface UserContextType {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  switchUser: (userId: string) => Promise<void>;
  switchRole: (role: 'CUSTOMER' | 'ADMIN') => Promise<void>;
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
