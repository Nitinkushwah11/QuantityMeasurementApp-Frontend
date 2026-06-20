import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { oauthLogin } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken  = params.get('accessToken');
    const email        = params.get('email');
    const fullName     = params.get('fullName');

    if (accessToken && email) {
      oauthLogin(accessToken, email, fullName);
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      color: '#6b7280',
      fontSize: '16px'
    }}>
      Logging you in...
    </div>
  );
};

export default OAuthCallback;
