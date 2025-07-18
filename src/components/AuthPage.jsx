import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import './Auth.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <h1 className="auth-title">Business Cards</h1>
          <p className="auth-subtitle">Manage your digital business cards</p>
        </div>
        
        {isLogin ? (
          <Login onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <Signup onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;