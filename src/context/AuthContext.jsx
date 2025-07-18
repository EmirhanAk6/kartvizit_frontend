import { createContext, useContext, useState, useEffect } from 'react';
import { utils } from '../services/CardService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🟡 AuthProvider useEffect running...');
    
    // Sayfa yüklendiğinde localStorage'dan user bilgilerini kontrol et
    const currentUser = utils.getCurrentUser();
    const isAuth = utils.isAuthenticated();
    
    console.log('🟡 Current user from localStorage:', currentUser);
    console.log('🟡 Is authenticated:', isAuth);
    
    if (currentUser && isAuth) {
      console.log('🟡 Setting user from localStorage');
      setUser(currentUser);
    } else {
      console.log('🟡 No valid user found, user remains null');
    }
    
    setLoading(false);
    console.log('🟡 Loading set to false');
  }, []);

  const login = (token, userInfo) => {
    console.log('🟢 Login called with:', { token: !!token, userInfo });
    utils.saveAuthData(token, userInfo);
    setUser(userInfo);
    console.log('🟢 User state updated to:', userInfo);
  };

  const logout = () => {
    console.log('🔴 LOGOUT FUNCTION CALLED!!!');
    console.log('🔴 Current user before logout:', user);
    console.log('🔴 localStorage before cleanup:', {
      token: !!localStorage.getItem('authToken'),
      userInfo: !!localStorage.getItem('userInfo')
    });
    
    // LocalStorage'ı temizle
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    
    console.log('🔴 localStorage after cleanup:', {
      token: !!localStorage.getItem('authToken'),
      userInfo: !!localStorage.getItem('userInfo')
    });
    
    // State'i temizle
    setUser(null);
    console.log('🔴 User state set to null');
    
    console.log('🔴 About to reload page...');
    
    // Sayfayı yeniden yükle
    setTimeout(() => {
      console.log('🔴 RELOADING PAGE NOW!');
      window.location.reload();
    }, 100);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  console.log('🟡 AuthContext render - Current state:', { 
    user: !!user, 
    username: user?.username,
    isAuthenticated: !!user, 
    loading 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};