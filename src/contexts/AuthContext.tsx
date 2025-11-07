import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'resident' | 'admin';
  ward: string;
  phone?: string;
  avatar?: string;
  full_name?: string;
   status: 'verified' | 'suspended' | 'pending' | undefined ; 
   department?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<{ success: boolean; message: string }>; // ✅ Fixed return type
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
        localStorage.removeItem('jamiireport_token');
        localStorage.removeItem('jamiireport_user');
        setToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost/jam11report/backend/api/auth/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const backendUser = data.user;
      const frontendUser: User = {
        id: backendUser.id,
        name: backendUser.full_name,
        email: backendUser.email,
        role: backendUser.role,
        ward: backendUser.ward,
        phone: backendUser.phone,
        full_name: backendUser.full_name,
        status: backendUser.status, 
        department: backendUser.department,
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      };

      const mockToken = 'real_backend_token_' + Math.random().toString(36).substr(2, 9);
      
      setToken(mockToken);
      setUser(frontendUser);
      
      localStorage.setItem('jamiireport_token', mockToken);
      localStorage.setItem('jamiireport_user', JSON.stringify(frontendUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; message: string }> => { // ✅ Fixed return type
    try {
      const response = await fetch('http://localhost/jam11report/backend/api/auth/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: userData.name,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          ward: userData.ward,
          estate_street: userData.estateStreet || '',
          proof_of_residence_path: userData.proofOfResidence || ''
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // ✅ Now this matches the return type
      return { success: true, message: data.message };
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
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