import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as loginApi } from '../../api/authApi';
import { ROUTES } from '../../utils/constants';
import { PlayerInput, PlayerButton } from '../../components/PlayerContainer';
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
      const res = await loginApi(form);

      const token =
        res?.data?.token ||
        res?.data?.accessToken ||
        res?.token ||
        res?.accessToken;

      const username =
        res?.data?.username ||
        res?.data?.user?.username ||
        res?.username ||
        form.username;

      if (!token) {
        setServerError('Không lấy được token từ response login');
        return;
      }

      login(token, username);
      navigate(ROUTES.HOST_QUIZZES, { replace: true });
    } catch (err) {
      setServerError(err?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setServerError('');
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authBackgroundShape}></div>

      <div className={styles.authCard}>
        
        <h1 className={styles.title}>Đăng nhập</h1>


        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Tên đăng nhập</label>
            <PlayerInput
              name="username"
              type="text"
              placeholder="Nhập username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              disabled={loading}
            />
            {errors.username && (
              <p className={styles.errorText}>{errors.username}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Mật khẩu</label>
            <PlayerInput
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={loading}
            />
            {errors.password && (
              <p className={styles.errorText}>{errors.password}</p>
            )}
          </div>

          {serverError && (
            <div className={styles.serverError}>{serverError}</div>
          )}

          <PlayerButton
            type="submit"
            size="xl"
            variant="primary"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? '⏳ Đang đăng nhập...' : '🚀 Đăng nhập'}
          </PlayerButton>
        </form>

        <div className={styles.footerSection}>
          <Link to="/" className={styles.softLink}>
            ← Về trang chủ
          </Link>

          <p className={styles.footerText}>
            Chưa có tài khoản?{' '}
            <Link to={ROUTES.REGISTER} className={styles.mainLink}>
              Đăng ký ngay
            </Link>
          </p>

          <Link to={ROUTES.FORGOT_PASSWORD} className={styles.linkButton}>
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;