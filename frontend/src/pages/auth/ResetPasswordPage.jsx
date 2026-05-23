import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../api/authApi';
import { PlayerInput, PlayerButton } from '../../components/PlayerContainer';
import { ROUTES } from '../../utils/constants';
import styles from './Auth.module.css';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};

    if (!token) {
      errs.token = 'Link đặt lại mật khẩu không hợp lệ hoặc thiếu token';
    }

    if (!form.newPassword.trim()) {
      errs.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (form.newPassword.length < 6) {
      errs.newPassword = 'Mật khẩu mới tối thiểu 6 ký tự';
    }

    if (!form.confirmPassword.trim()) {
      errs.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (form.newPassword !== form.confirmPassword) {
      errs.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    return errs;
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
    setSuccess('');
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
    setSuccess('');

    try {
      await resetPassword({
        token,
        newPassword: form.newPassword,
      });

      setSuccess('Đặt lại mật khẩu thành công. Bạn có thể đăng nhập lại.');

      setTimeout(() => {
        navigate(ROUTES.LOGIN, { replace: true });
      }, 1200);
    } catch (err) {
      console.log(err);
      setServerError(err?.message || 'Đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authBackgroundShape}></div>

      <div className={styles.authCard}>
        <div className={styles.logoCircle}>🔐</div>

        <p className={styles.kicker}>Reset Password</p>

        <h1 className={styles.title}>Đặt lại mật khẩu</h1>

        <p className={styles.subtitle}>
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.token && (
            <div className={styles.serverError}>{errors.token}</div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Mật khẩu mới</label>

            <PlayerInput
              name="newPassword"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={form.newPassword}
              onChange={handleChange}
              disabled={loading || !token}
            />

            {errors.newPassword && (
              <p className={styles.errorText}>{errors.newPassword}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Xác nhận mật khẩu mới</label>

            <PlayerInput
              name="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={loading || !token}
            />

            {errors.confirmPassword && (
              <p className={styles.errorText}>{errors.confirmPassword}</p>
            )}
          </div>

          {serverError && <div className={styles.serverError}>{serverError}</div>}

          {success && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
                borderRadius: 12,
                padding: '10px 12px',
                fontSize: 14,
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              {success}
            </div>
          )}

          <PlayerButton
            type="submit"
            size="xl"
            variant="primary"
            disabled={loading || !token}
            className={styles.submitBtn}
          >
            {loading ? '⏳ Đang lưu...' : '🔐 Đặt lại mật khẩu'}
          </PlayerButton>
        </form>

        <div className={styles.footerSection}>
          <Link to={ROUTES.LOGIN} className={styles.softLink}>
            ← Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;