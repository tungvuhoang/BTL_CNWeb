import { useState } from 'react';
import { message } from 'antd';
import { changePassword } from '../../api/authApi';
import styles from '../auth/Auth.module.css';

const ChangePasswordPage = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};

    if (!form.currentPassword.trim()) {
      errs.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!form.newPassword.trim()) {
      errs.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (form.newPassword.length < 6) {
      errs.newPassword = 'Mật khẩu mới tối thiểu 6 ký tự';
    }

    if (form.newPassword !== form.confirmPassword) {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      message.success('Đổi mật khẩu thành công');

      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.log(err);
      message.error(err?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="host-quizzes">
      <section className="host-quizzes__hero">
        <div className="host-quizzes__hero-content">
          <p className="host-quizzes__hero-kicker">Account Security</p>
          <h1>Đổi mật khẩu</h1>
          <p>Cập nhật mật khẩu để bảo vệ tài khoản host của bạn.</p>
        </div>
      </section>

      <div className="quiz-detail__info-card" style={{ maxWidth: 560 }}>
        <div className="quiz-detail__info-header">
          <h3 className="quiz-detail__info-title">🔐 Mật khẩu mới</h3>
        </div>

        <div className="quiz-detail__info-body">
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Mật khẩu hiện tại</label>
              <input
                className={styles.authInput}
                name="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu hiện tại"
                disabled={loading}
              />
              {errors.currentPassword && (
                <p className={styles.errorText}>{errors.currentPassword}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Mật khẩu mới</label>
              <input
                className={styles.authInput}
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Tối thiểu 6 ký tự"
                disabled={loading}
              />
              {errors.newPassword && (
                <p className={styles.errorText}>{errors.newPassword}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Xác nhận mật khẩu mới</label>
              <input
                className={styles.authInput}
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className={styles.errorText}>{errors.confirmPassword}</p>
              )}
            </div>

            <button className="btn-create-quiz" type="submit" disabled={loading}>
              {loading ? '⏳ Đang lưu...' : '🔐 Đổi mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;