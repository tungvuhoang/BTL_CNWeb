import BaseLayout from './BaseLayout';
import { ROUTES } from '../utils/constants';

const HostLayout = () => (
  <BaseLayout
    showLogout
    sidebarItems={[
      { to: ROUTES.HOST_QUIZZES, label: 'Quiz của tôi', icon: '📚', end: true },
      { to: ROUTES.HOST_REPORTS, label: 'Báo cáo', icon: '📊' },
      { to: ROUTES.HOST_SETTINGS, label: 'Cài đặt', icon: '⚙️' },
    ]}
  />
);

export default HostLayout;
