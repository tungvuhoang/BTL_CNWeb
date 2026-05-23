import BaseLayout from './BaseLayout';
import { ROUTES } from '../utils/constants';

const HostLayout = () => (
  <BaseLayout
    showLogout
    sidebarItems={[
      { to: ROUTES.HOST_QUIZZES, label: 'Quiz của tôi', icon: '📚', end: true },
      { to: ROUTES.HOST_PLAY, label: 'Tham gia phòng', icon: '🎮', end: true },
      { to: ROUTES.HOST_PROFILE, label: 'Tài khoản', icon: '👤', end: true },
      { to: ROUTES.HOST_CHANGE_PASSWORD, label: 'Đổi mật khẩu', icon: '🔐', end: true },
      { to: ROUTES.PUBLIC_QUIZZES, label: 'Public Quizzes', icon: '🌍', end: true },
    ]}
  />
);

export default HostLayout;
