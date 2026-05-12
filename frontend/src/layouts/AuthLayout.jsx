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
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            🎮 Web_Quiz
          </div>
        </div>
      </header>

      {/* Main content area - gradient background visible */}
      <main className={styles.main}>
        <div className={styles.contentCard}>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerContent}>
            <p>
              🎯 <span className={styles.footerTextBold}>Web_Quiz</span> - Real-time Learning Experience
            </p>
            <p className={styles.footerCopy}>
              © 2026 All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;