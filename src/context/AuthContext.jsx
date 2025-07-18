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
    // Sayfa yüklendiğinde localStorage'dan user bilgilerini kontrol et
    const currentUser = utils.getCurrentUser();
    if (currentUser && utils.isAuthenticated()) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = (token, userInfo) => {
    console.log('Login called with:', { token: !!token, userInfo });
    utils.saveAuthData(token, userInfo);
    setUser(userInfo);
  };

  const logout = () => {
    console.log('Logout called - clearing data...');
    
    // LocalStorage'ı temizle
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    
    console.log('LocalStorage cleared');
    
    // State'i temizle
    setUser(null);
    
    console.log('User state set to null');
    
    // Başarılı logout mesajı
    console.log('Logout completed successfully');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  console.log('AuthContext current state:', { 
    user: !!user, 
    isAuthenticated: !!user, 
    loading 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};