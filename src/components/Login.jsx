import { useState } from 'react';
import { authAPI } from '../services/CardService';
import { useAuth } from '../context/AuthContext';

const Login = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await authAPI.login(formData);
      
      if (response.success) {
        login(response.token, response.userInfo);
        setMessage('Login successful! Redirecting...');
      } else {
        setMessage(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="card-body p-4">
        <h2 className="text-center mb-4 fw-bold">Welcome Back</h2>
        
        {message && (
          <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className={`form-control form-control-custom ${errors.username ? 'is-invalid' : ''}`}
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className={`form-control form-control-custom ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-auth w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="switch-auth">
          <span className="text-muted">Don't have an account? </span>
          <a href="#" className="switch-link" onClick={(e) => {e.preventDefault(); onSwitchToSignup();}}>
            Sign up here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;