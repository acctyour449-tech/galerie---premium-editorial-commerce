/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode, FormEvent } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: 'buyer' | 'seller') => void;
  register: (name: string, email: string, role: 'buyer' | 'seller') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('galerie_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email: string, role: 'buyer' | 'seller') => {
    const mockUser: User = {
      id: 'mock-id-123',
      name: email.split('@')[0],
      email: email,
      role: role,
      memberSince: 'April 2026',
      tier: 'Standard',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7ia94etatAArkzN1WV_ZSq6jEdB2bHfpUbR4Yj7-76lI16HCdzCN9MTCCWh_WyqDZbxdJh6Ac1U59EjVZjXufcuDx4G8elrdVkyBslap7KeISG_cByEP_Mv13roeEyb0rB8QQd_o4E04PUVP2yFNabnaSqDhjxac82LSmMxqcLlaiDZy4gy8UkmWnnZ1IZlex5KmjH42mXDTW5CxtOB6M-HX46DjgBqfkOhYLHZUpYHH-zHaPTYFzz93P2at2nXDO0YzbDgOnt-w'
    };
    setUser(mockUser);
    localStorage.setItem('galerie_user', JSON.stringify(mockUser));
  };

  const register = (name: string, email: string, role: 'buyer' | 'seller') => {
    const mockUser: User = {
      id: Date.now().toString(),
      name: name,
      email: email,
      role: role,
      memberSince: 'April 2026',
      tier: 'Standard',
    };
    setUser(mockUser);
    localStorage.setItem('galerie_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('galerie_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
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
