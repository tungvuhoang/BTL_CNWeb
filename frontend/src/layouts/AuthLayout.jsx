import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';
import styles from './AuthLayout.module.css';

/**
 * AuthLayout - Login and Register pages layout
 * Features:
 * - Full screen gradient background
 * - Header with logo
 * - Centered form content
 * - Footer
 */
const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to={ROUTES.HOST_QUIZZES} replace />;

  return (
    <div className={styles.wrapper}>

      {/* Main content area - gradient background visible */}
      <main className={styles.main}>
        <div className={styles.contentCard}>
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AuthLayout;