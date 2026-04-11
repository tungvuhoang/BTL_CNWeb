import BaseLayout from './BaseLayout';
import { ROUTES } from '../utils/constants';

const HostLayout = () => (
  <BaseLayout
    title="Web_Quiz — Host"
    showLogout
    sidebarItems={[
      { to: ROUTES.HOST_QUIZZES, label: 'Quiz của tôi', icon: '📚', end: true },
    ]}
  />
);

export default HostLayout;
