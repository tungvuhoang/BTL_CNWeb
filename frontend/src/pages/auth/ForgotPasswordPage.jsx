import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';
import { PlayerInput, PlayerButton } from '../../components/PlayerContainer';
import { ROUTES } from '../../utils/constants';
import styles from './Auth.module.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [serverMessage, setServerMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) return 'Vui lòng nhập email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email không hợp lệ';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setServerMessage('');

    try {
      await forgotPassword({
        email: email.trim(),
      });

      setServerMessage(
        'Nếu email tồn tại trong hệ thống, link đặt lại mật khẩu đã được gửi.'
      );
    } catch (err) {
      console.log(err);
      setError(err?.message || 'Không thể gửi email đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authBackgroundShape}></div>

      <div className={styles.authCard}>
        <div className={styles.logoCircle}>🔑</div>

        <p className={styles.kicker}>Password Recovery</p>

        <h1 className={styles.title}>Quên mật khẩu</h1>

        <p className={styles.subtitle}>
          Nhập email đã đăng ký. Hệ thống sẽ gửi link đặt lại mật khẩu cho bạn.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>

            <PlayerInput
              name="email"
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
                setServerMessage('');
              }}
              disabled={loading}
            />

            {error && <p className={styles.errorText}>{error}</p>}
          </div>

          {serverMessage && (
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
              {serverMessage}
            </div>
          )}

          <PlayerButton
            type="submit"
            size="xl"
            variant="primary"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? '⏳ Đang gửi...' : '📩 Gửi link đặt lại'}
          </PlayerButton>
        </form>

        <div className={styles.footerSection}>
          <Link to={ROUTES.LOGIN} className={styles.softLink}>
            ← Quay lại đăng nhập
          </Link>

          <Link to="/" className={styles.softLink}>
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;