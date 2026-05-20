import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { ROUTES } from '../../utils/constants';
import { PlayerContainer, PlayerInput, PlayerButton } from '../../components/PlayerContainer';
import OAuthButtons from '../../components/OAuthButtons';
import styles from './Auth.module.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username không được để trống';
    if (!form.password.trim()) errs.password = 'Password không được để trống';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { 
      setErrors(errs); 
      return; 
    }
    
    setLoading(true);
    setServerError('');
    try {
      const res = await authApi.login(data);
      login(res.data.token, res.data.username);
      navigate(ROUTES.HOST_QUIZZES, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleOAuthSuccess = (provider) => {
    // Mock OAuth login
    console.log(`${provider} OAuth login clicked`);
    setLoading(true);
    // Simulate OAuth flow
    setTimeout(() => {
      login('oauth-token-' + Date.now(), 'oauth_user_' + provider);
      navigate(ROUTES.HOST_QUIZZES, { replace: true });
    }, 1500);
  };

  return (
    <PlayerContainer title="Đăng Nhập">
      {/* OAuth Section */}
      <OAuthButtons 
        onGoogleSuccess={() => handleOAuthSuccess('google')}
        onMicrosoftClick={() => handleOAuthSuccess('microsoft')}
        onAppleClick={() => handleOAuthSuccess('apple')}
      />

      {/* Username & Password Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <PlayerInput
            name="username"
            type="text"
            placeholder="Username hoặc Email"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            disabled={loading}
          />
          {errors.username && <p className={styles.errorText}>{errors.username}</p>}
        </div>

        <div className={styles.inputGroup}>
          <PlayerInput
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            disabled={loading}
          />
          {errors.password && <p className={styles.errorText}>{errors.password}</p>}
        </div>

        {serverError && <p className={styles.serverError}>{serverError}</p>}

        <PlayerButton 
          type="submit" 
          size="xl" 
          variant="primary" 
          disabled={loading}
          className={styles.submitBtn}
        >
          {loading ? '⏳ Đang đăng nhập...' : '🚀 Đăng Nhập'}
        </PlayerButton>
      </form>

      {/* Forgot Password & Sign Up */}
      <div className={styles.footerSection}>
        <button className={styles.linkButton}>
          Quên mật khẩu?
        </button>
        
        <div className={styles.dividerBox}>
          <p className={styles.footerText}>
            Chưa có tài khoản?{' '}
            <Link to={ROUTES.REGISTER} className={styles.linkButton}>
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </PlayerContainer>
  );
};

export default LoginPage;