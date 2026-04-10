import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as loginApi } from '../../api/authApi';
import { ROUTES } from '../../utils/constants';
import { PlayerContainer, PlayerInput, PlayerButton } from '../../components/PlayerContainer';
import OAuthButtons from '../../components/OAuthButtons';

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
      const res = await loginApi(form);
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <PlayerInput
            name="username"
            type="text"
            placeholder="Username hoặc Email"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            disabled={loading}
          />
          {errors.username && <p className="text-red-500 text-sm mt-2">{errors.username}</p>}
        </div>

        <div>
          <PlayerInput
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            disabled={loading}
          />
          {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
        </div>

        {serverError && <p className="text-red-500 text-center text-sm bg-red-50 p-3 rounded-lg">{serverError}</p>}

        <PlayerButton 
          type="submit" 
          size="xl" 
          variant="primary" 
          disabled={loading}
          className={`mt-6 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {loading ? '⏳ Đang đăng nhập...' : '🚀 Đăng Nhập'}
        </PlayerButton>
      </form>

      {/* Forgot Password & Sign Up */}
      <div className="space-y-3 mt-6">
        <p className="text-center text-sm text-indigo-600 hover:text-indigo-700 cursor-pointer font-semibold">
          Quên mật khẩu?
        </p>
        
        <div className="border-t border-gray-200 pt-4">
          <p className="text-center text-gray-600 text-sm">
            Chưa có tài khoản?{' '}
            <Link to={ROUTES.REGISTER} className="text-indigo-600 font-semibold hover:text-indigo-700">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </PlayerContainer>
  );
};

export default LoginPage;