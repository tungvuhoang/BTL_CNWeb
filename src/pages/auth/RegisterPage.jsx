import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../../api/authApi';
import { ROUTES } from '../../utils/constants';
import { PlayerContainer, PlayerInput, PlayerButton } from '../../components/PlayerContainer';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username không được để trống';
    else if (form.username.trim().length < 3) errs.username = 'Username tối thiểu 3 ký tự';
    
    if (!form.password.trim()) errs.password = 'Password không được để trống';
    else if (form.password.length < 6) errs.password = 'Password tối thiểu 6 ký tự';
    
    if (!form.confirmPassword.trim()) errs.confirmPassword = 'Vui lòng xác nhận password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Password không khớp';
    
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
      await registerApi({ username: form.username, password: form.password });
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(er => ({ ...er, [name]: '' }));
  };

  return (
    <PlayerContainer title="Đăng Ký">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <PlayerInput
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
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
            autoComplete="new-password"
          />
          {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
        </div>

        <div>
          <PlayerInput
            name="confirmPassword"
            type="password"
            placeholder="Xác nhận Password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>}
        </div>

        {serverError && <p className="text-red-500 text-center text-sm bg-red-50 p-3 rounded-lg">{serverError}</p>}

        <PlayerButton 
          type="submit" 
          size="xl" 
          variant="primary" 
          disabled={loading}
          className={`mt-8 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {loading ? '⏳ Đang đăng ký...' : '🎮 Đăng Ký'}
        </PlayerButton>
      </form>

      <p className="text-center text-gray-600 text-sm mt-6">
        Đã có tài khoản?{' '}
        <Link to={ROUTES.LOGIN} className="text-indigo-600 font-semibold hover:text-indigo-700">
          Đăng nhập
        </Link>
      </p>
    </PlayerContainer>
  );
};

export default RegisterPage;