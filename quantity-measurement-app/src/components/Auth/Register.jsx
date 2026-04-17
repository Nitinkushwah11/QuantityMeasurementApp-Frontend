import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/constants';
import './Auth.css';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setError('Mobile number must be 10 digits and start with 6-9');
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{6,}$/.test(password)) {
      setError('Password must contain uppercase, lowercase, special character, and be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(fullName, email, mobileNumber, password);
      localStorage.setItem('fullName', fullName);
      setSuccessMessage('Registration successful. Please sign in.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Background shapes are handled by CSS */}
      <div className="auth-bg-shape-1"></div>
      <div className="auth-bg-shape-2"></div>
      
      <div className="auth-card">
        {/* Left: Registration Form */}
        <div className="auth-form-section">
          <div className="auth-brand">
            <div className="auth-brand-icon">📏</div>
            <span className="auth-brand-text">QuantiMeasure</span>
          </div>

          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join us to start precision measuring</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

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
              <label>Mobile Number</label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your 10-digit mobile number"
                pattern="^[6-9]\d{9}$"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min 8 characters)"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              onClick={() => { window.location.href = `${API_BASE_URL}/oauth2/authorization/github`; }}
              className="btn-github"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>

        {/* Right: Measurement Tools Mock */}
        <div className="auth-visual-section">
          <div className="measurement-dashboard">
            {/* Window Header */}
            <div className="dashboard-header">
              <div className="window-control red"></div>
              <div className="window-control yellow"></div>
              <div className="window-control green"></div>
            </div>

            {/* Content */}
            <div className="dashboard-content">
              <div className="dashboard-title">
                <span>🔧</span>
                <span>Measurement Tools</span>
              </div>

              {/* Measurement Operations */}
              <div className="measurement-bars">
                <div className="measurement-bar length" style={{width: '80%'}}></div>
                <div className="measurement-bar weight" style={{width: '60%'}}></div>
                <div className="measurement-bar volume" style={{width: '90%'}}></div>
                <div className="measurement-bar temperature" style={{width: '45%'}}></div>
              </div>

              {/* Conversion Chart */}
              <div className="measurement-chart">
                <div className="measurement-pie">🔄</div>
              </div>

              {/* Operations Icons */}
              <div className="measurement-icons">
                <div className="measurement-icon length">+</div>
                <div className="measurement-icon weight">-</div>
                <div className="measurement-icon volume">×</div>
                <div className="measurement-icon temperature">÷</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
