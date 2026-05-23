import { useEffect, useState } from 'react';
import { Button, Input, message, Spin } from 'antd';
import { getMyProfile, updateMyProfile } from '../../api/authApi';
import styles from '../auth/Auth.module.css';
import './HostQuizzes.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);

    try {
      const res = await getMyProfile();
      const data = res.data || res;

      setProfile(data);
      setForm({
        fullName: data.fullName || '',
        email: data.email || '',
        dateOfBirth: data.dateOfBirth || '',
      });
    } catch (err) {
      console.log(err);
      message.error('Không thể tải thông tin tài khoản');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const handleSave = async () => {
    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);

    try {
      const res = await updateMyProfile({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        dateOfBirth: form.dateOfBirth || null,
      });

      const data = res.data || res;

      setProfile(data);
      setEditing(false);
      message.success('Cập nhật thông tin thành công');
    } catch (err) {
      console.log(err);
      message.error(err?.message || 'Cập nhật thông tin thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      fullName: profile?.fullName || '',
      email: profile?.email || '',
      dateOfBirth: profile?.dateOfBirth || '',
    });
    setErrors({});
    setEditing(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="host-quizzes">
      <section className="host-quizzes__hero">
        <div className="host-quizzes__hero-content">
          <p className="host-quizzes__hero-kicker">Account</p>
          <h1>Thông tin cá nhân</h1>
          <p>Xem và cập nhật thông tin tài khoản host của bạn.</p>
        </div>
      </section>

      <div className="quiz-detail__info-card" style={{ maxWidth: 640 }}>
        <div className="quiz-detail__info-header">
          <h3 className="quiz-detail__info-title">👤 Hồ sơ tài khoản</h3>

          {!editing ? (
            <Button type="primary" onClick={() => setEditing(true)}>
              Chỉnh sửa
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={handleCancel}>Huỷ</Button>
              <Button type="primary" loading={saving} onClick={handleSave}>
                Lưu
              </Button>
            </div>
          )}
        </div>

        <div className="quiz-detail__info-body">
          <div className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Username</label>
              <Input value={profile?.username || ''} disabled />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Họ và tên</label>
              <Input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                disabled={!editing || saving}
                placeholder="Nhập họ và tên"
              />
              {errors.fullName && (
                <p className={styles.errorText}>{errors.fullName}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                disabled={!editing || saving}
                placeholder="Nhập email"
              />
              {errors.email && (
                <p className={styles.errorText}>{errors.email}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Ngày sinh</label>
              <Input
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                disabled={!editing || saving}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;