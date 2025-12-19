import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Kiểm tra đăng nhập khi app khởi động
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const adminStatus = localStorage.getItem('isAdmin');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAdmin(adminStatus === 'true');
    }
    setLoading(false);
  };

  // Đăng nhập user thường
  const loginUser = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAdmin', 'false');
    setUser(userData);
    setIsAdmin(false);
    
    // Dispatch storage event để CartContext biết token đã thay đổi
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'token',
      newValue: token,
      oldValue: null
    }));
    
    navigate('/home');
  };

  // Đăng nhập admin
  const loginAdmin = (adminData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(adminData));
    localStorage.setItem('isAdmin', 'true');
    setUser(adminData);
    setIsAdmin(true);
    navigate('/admin/dash-board');
  };

  // Đăng xuất
  const logout = () => {
    // Gọi reset cart nếu có
    if (window.resetCart) {
      window.resetCart();
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    
    // Dispatch storage event
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'token',
      newValue: null,
      oldValue: localStorage.getItem('token')
    }));
    
    setUser(null);
    setIsAdmin(false);
    navigate('/sign-in');
  };

  // Kiểm tra đã đăng nhập chưa
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      loginUser, 
      loginAdmin, 
      logout, 
      isAuthenticated,
      loading,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};