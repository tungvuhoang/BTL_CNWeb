import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../../api/authApi';
import { ROUTES } from '../../utils/constants';
import { PlayerContainer, PlayerInput, PlayerButton } from '../../components/PlayerContainer';
import styles from './Auth.module.css';

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
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <PlayerInput
            name="username"
            type="text"
            placeholder="Username"
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
            autoComplete="new-password"
            disabled={loading}
          />
          {errors.password && <p className={styles.errorText}>{errors.password}</p>}
        </div>

        <div className={styles.inputGroup}>
          <PlayerInput
            name="confirmPassword"
            type="password"
            placeholder="Xác nhận Password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            disabled={loading}
          />
          {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword}</p>}
        </div>

        {serverError && <p className={styles.serverError}>{serverError}</p>}

        <PlayerButton 
          type="submit" 
          size="xl" 
          variant="primary" 
          disabled={loading}
          className={styles.submitBtn}
        >
          {loading ? '⏳ Đang đăng ký...' : '🎮 Đăng Ký'}
        </PlayerButton>
      </form>

      <div className={styles.footerTextContainer}>
        <p className={styles.footerText}>
          Đã có tài khoản?{' '}
          <Link to={ROUTES.LOGIN} className={styles.linkButton}>
            Đăng nhập
          </Link>
        </p>
      </div>
    </PlayerContainer>
  );
};

export default RegisterPage;