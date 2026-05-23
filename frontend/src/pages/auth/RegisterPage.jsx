import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../../api/authApi';
import { ROUTES } from '../../utils/constants';
import { PlayerInput, PlayerButton } from '../../components/PlayerContainer';
import styles from './Auth.module.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};

    if (!form.fullName.trim()) {
      errs.fullName = 'Họ và tên không được để trống';
    }

    if (!form.email.trim()) {
      errs.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Email không hợp lệ';
    }

    if (!form.dateOfBirth) {
      errs.dateOfBirth = 'Vui lòng chọn ngày sinh';
    }

    if (!form.username.trim()) {
      errs.username = 'Username không được để trống';
    } else if (form.username.trim().length < 3) {
      errs.username = 'Username tối thiểu 3 ký tự';
    }

    if (!form.password.trim()) {
      errs.password = 'Password không được để trống';
    } else if (form.password.length < 6) {
      errs.password = 'Password tối thiểu 6 ký tự';
    }

    if (!form.confirmPassword.trim()) {
      errs.confirmPassword = 'Vui lòng xác nhận password';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Password không khớp';
    }

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
      await registerApi({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        dateOfBirth: form.dateOfBirth,
        username: form.username.trim(),
        password: form.password,
      });

      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      setServerError(err?.message || 'Đăng ký thất bại');
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

        <h1 className={styles.title}>Đăng ký</h1>

        <p className={styles.subtitle}>
          Tạo tài khoản để bắt đầu xây dựng quiz, quản lý câu hỏi và host game
          realtime.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Họ và tên</label>
            <PlayerInput
              name="fullName"
              type="text"
              placeholder="Nhập họ và tên"
              value={form.fullName}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.fullName && (
              <p className={styles.errorText}>{errors.fullName}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <PlayerInput
              name="email"
              type="email"
              placeholder="Nhập email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && (
              <p className={styles.errorText}>{errors.email}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Ngày sinh</label>
            <PlayerInput
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.dateOfBirth && (
              <p className={styles.errorText}>{errors.dateOfBirth}</p>
            )}
          </div>

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
              placeholder="Tối thiểu 6 ký tự"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={loading}
            />
            {errors.password && (
              <p className={styles.errorText}>{errors.password}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Xác nhận mật khẩu</label>
            <PlayerInput
              name="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className={styles.errorText}>{errors.confirmPassword}</p>
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
            {loading ? '⏳ Đang đăng ký...' : '🎮 Tạo tài khoản'}
          </PlayerButton>
        </form>

        <div className={styles.footerSection}>
          <Link to="/" className={styles.softLink}>
            ← Về trang chủ
          </Link>

          <p className={styles.footerText}>
            Đã có tài khoản?{' '}
            <Link to={ROUTES.LOGIN} className={styles.mainLink}>
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;