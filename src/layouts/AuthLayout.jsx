import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

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
    <div className="relative h-screen bg-gradient-game overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-white bg-opacity-95 shadow-md border-b-4 border-indigo-600 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🎮 Web_Quiz
          </div>
        </div>
      </header>

      {/* Main content area - gradient background visible */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-auto">
        <div className="w-full max-w-md animate-fadeIn">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white bg-opacity-95 border-t border-gray-200 py-4 sm:py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
            <p className="text-center sm:text-left mb-2 sm:mb-0">
              🎯 <span className="font-semibold">Web_Quiz</span> - Real-time Learning Experience
            </p>
            <p className="text-center sm:text-right text-xs text-gray-500">
              © 2026 All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;