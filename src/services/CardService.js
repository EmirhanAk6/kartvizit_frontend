import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - her istekte token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 durumunda logout yap
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Axios response error:', error.response?.status);
    
    if (error.response?.status === 401) {
      console.log('401 error - Token expired or invalid');
      
      // Token süresi dolmuş veya geçersiz
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      
      // Sadece login sayfasında değilsek yönlendir
      if (!window.location.pathname.includes('/login')) {
        console.log('Redirecting to login due to 401');
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  
  test: async () => {
    const response = await api.get('/auth/test');
    return response.data;
  }
};

// Cards API calls
export const cardsAPI = {
  // Kullanıcının kartvizitleri
  getUserCards: async (userId) => {
    const response = await api.get(`/${userId}/cards/my-cards`);
    return response.data;
  },
  
  // Kartvizit oluştur
  createCard: async (userId, cardData) => {
    const response = await api.post(`/${userId}/cards/create`, cardData);
    return response.data;
  },
  
  // Kartvizit güncelle
  updateCard: async (userId, cardId, cardData) => {
    const response = await api.put(`/${userId}/cards/my-cards/${cardId}`, cardData);
    return response.data;
  },
  
  // Kartvizit sil
  deleteCard: async (userId, cardId) => {
    const response = await api.delete(`/${userId}/cards/my-cards/${cardId}`);
    return response.data;
  },
  
  // Public kartvizit getir
  getCard: async (cardId) => {
    const response = await api.get(`/cards/${cardId}`);
    return response.data;
  },
  
  // Kartvizit ara
  searchCards: async (query) => {
    const response = await api.get(`/cards/search?query=${encodeURIComponent(query)}`);
    return response.data;
  }
};

// Utils
export const utils = {
  // Token'dan user bilgilerini al
  getCurrentUser: () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Error parsing user info from localStorage:', error);
      return null;
    }
  },
  
  // Token var mı kontrol et
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('userInfo');
    
    console.log('isAuthenticated check - Token exists:', !!token);
    console.log('isAuthenticated check - UserInfo exists:', !!userInfo);
    
    return !!(token && userInfo);
  },
  
  // Logout işlemi (Artık AuthContext'te yapılacak)
  logout: () => {
    console.warn('utils.logout() deprecated. Use AuthContext logout instead.');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  },
  
  // Token ve user bilgilerini kaydet
  saveAuthData: (token, userInfo) => {
    console.log('Saving auth data to localStorage');
    localStorage.setItem('authToken', token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    console.log('Auth data saved successfully');
  }
};

export default api;