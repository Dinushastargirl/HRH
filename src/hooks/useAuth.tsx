import React, { useState, useEffect, createContext, useContext } from 'react';
import { UserProfile, UserRole } from '../types';
import { MOCK_EMPLOYEES_DATA } from '../constants';

interface AuthContextType {
  user: UserProfile | null;
  uid: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('hr_pulse_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUid(parsedUser.uid);
      }
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      localStorage.removeItem('hr_pulse_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simple mock auth logic
    const adminUsers = [
      { email: 'super@hrpulse.com', password: '1234', role: 'super' as UserRole, name: 'Super Admin' },
      { email: 'owner@hrpulse.com', password: '4321', role: 'owner' as UserRole, name: 'Owner User' },
      { email: 'hr@hrpulse.com', password: '4321', role: 'hr' as UserRole, name: 'HR Manager' },
    ];

    let foundUser: UserProfile | null = null;

    const admin = adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (admin) {
      foundUser = {
        uid: `mock-${admin.role}-id`,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        branch: 'Office',
        joinDate: '2024-01-01',
        basic: 50000,
        epf: 5000,
        etf: 1500,
        allowances: 5000,
        deductions: 2000,
        net: 49500,
        performanceScore: 85,
        leaveQuotas: { annual: 20, sick: 10, casual: 5, short: 2 },
        usedLeaves: { annual: 2, sick: 1, casual: 0, short: 0 },
      };
    } else {
      // Check mock employees
      const employee = MOCK_EMPLOYEES_DATA.find(e => {
        const empEmail = e.name.toLowerCase().replace(/\s+/g, '.') + '@hrpulse.com';
        return empEmail === email.toLowerCase() && password === '1234';
      });

      if (employee) {
        foundUser = {
          uid: `emp-${employee.name.replace(/\s+/g, '-')}`,
          name: employee.name,
          email: employee.name.toLowerCase().replace(/\s+/g, '.') + '@hrpulse.com',
          role: 'employee',
          branch: employee.branch,
          joinDate: employee.joinDate,
          basic: employee.basic,
          epf: employee.epf,
          etf: employee.etf,
          allowances: employee.allowances,
          deductions: employee.deductions,
          net: employee.net,
          performanceScore: 80,
          leaveQuotas: { annual: 20, sick: 10, casual: 5, short: 2 },
          usedLeaves: { annual: 0, sick: 0, casual: 0, short: 0 },
        };
      }
    }

    if (foundUser) {
      localStorage.setItem('hr_pulse_user', JSON.stringify(foundUser));
      setUser(foundUser);
      setUid(foundUser.uid);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('hr_pulse_user');
    setUser(null);
    setUid(null);
  };

  return (
    <AuthContext.Provider value={{ user, uid, loading, login, logout }}>
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
