import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/constants';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // GitHub OAuth login
  const handleGithubLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/github`;
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-shape-1"></div>
      <div className="auth-bg-shape-2"></div>

      <div className="auth-card">
        {/* Left: Login Form */}
        <div className="auth-form-section">
          <div className="auth-brand">
            <div className="auth-brand-icon">📏</div>
            <span className="auth-brand-text">QuantiMeasure</span>
          </div>

          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue precision measuring</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Continue'}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            {/* GitHub Login Button */}
            <button type="button" onClick={handleGithubLogin} className="btn-github">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register">Sign Up</Link>
            </p>
          </div>
        </div>

        {/* Right: Visual Section */}
        <div className="auth-visual-section">
          <div className="measurement-dashboard">
            <div className="dashboard-header">
              <div className="window-control red"></div>
              <div className="window-control yellow"></div>
              <div className="window-control green"></div>
            </div>
            <div className="dashboard-content">
              <div className="dashboard-title">
                <span>📊</span>
                <span>Measurement Analytics</span>
              </div>
              <div className="measurement-bars">
                <div className="measurement-bar length"></div>
                <div className="measurement-bar weight"></div>
                <div className="measurement-bar volume"></div>
                <div className="measurement-bar temperature"></div>
              </div>
              <div className="measurement-chart">
                <div className="measurement-pie">⚖️</div>
              </div>
              <div className="measurement-icons">
                <div className="measurement-icon length">📏</div>
                <div className="measurement-icon weight">⚖️</div>
                <div className="measurement-icon volume">🧪</div>
                <div className="measurement-icon temperature">🌡️</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
