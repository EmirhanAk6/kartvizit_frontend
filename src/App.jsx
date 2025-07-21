import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // Global CSS'i import et
import './App.css';

// Ana uygulama içeriği
const AppContent = () => {
  const { user, loading } = useAuth();

  console.log('AppContent render - User:', !!user, 'Loading:', loading);

  if (loading) {
    return (
      <div className="vh-100 vw-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('Rendering:', user ? 'Dashboard' : 'AuthPage');
  
  return (
    <div className="app-container">
      {user ? <Dashboard /> : <AuthPage />}
    </div>
  );
};

// Ana App component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;