import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock users for testing - REMOVE when backend is integrated
const MOCK_USERS = [
  {
    id: 1,
    name: "Test Admin",
    email: "admin@test.com",
    password: "123456",
    role: "admin" as const,
    ward: "All Wards",
    phone: "0700123456",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    id: 2,
    name: "Test Resident",
    email: "resident@test.com",
    password: "123456",
    role: "resident" as const,
    ward: "Lindi",
    phone: "0700654321",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  }
];

// Generate mock token - REMOVE when backend is integrated
const generateMockToken = () => {
  return 'mock_token_' + Math.random().toString(36).substr(2, 9);
};

interface User {
  id: number;
  name: string;
  email: string;
  role: 'resident' | 'admin';
  ward: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('jamiireport_token');
    const storedUser = localStorage.getItem('jamiireport_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // Clear corrupted data from localStorage
        localStorage.removeItem('jamiireport_token');
        localStorage.removeItem('jamiireport_user');
        setToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication - REPLACE with real API call when backend is ready
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const mockToken = generateMockToken();
    const { password: _, ...userWithoutPassword } = foundUser;
    
    setToken(mockToken);
    setUser(userWithoutPassword);
    
    localStorage.setItem('jamiireport_token', mockToken);
    localStorage.setItem('jamiireport_user', JSON.stringify(userWithoutPassword));
  };

  const register = async (userData: any) => {
    // Mock registration - REPLACE with real API call when backend is ready
    const newUser = {
      id: Date.now(),
      ...userData,
      role: 'resident' as const,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    };
    
    const mockToken = generateMockToken();
    const { password: _, ...userWithoutPassword } = newUser;
    
    setToken(mockToken);
    setUser(userWithoutPassword);
    
    localStorage.setItem('jamiireport_token', mockToken);
    localStorage.setItem('jamiireport_user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jamiireport_token');
    localStorage.removeItem('jamiireport_user');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};