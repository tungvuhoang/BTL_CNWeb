import { Outlet } from 'react-router-dom';
import PlayerHeader from '../components/PlayerHeader';

/**
 * PlayerLayout - Full-screen game UI layout for quiz players
 *
 * Features:
 * - Full viewport height with gradient background (fills entire screen)
 * - Header and footer as overlays
 * - Centered content area in the middle
 * - Mobile responsive
 */
const PlayerLayout = () => {
  return (
    <div className="relative h-screen bg-gradient-game overflow-hidden flex flex-col">
      {/* Header - overlay on gradient */}
      <header className="bg-white bg-opacity-95 shadow-md border-b-4 border-indigo-600 relative z-10">
        <PlayerHeader />
      </header>

      {/* Main content area - gradient background visible */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-auto">
        <div className="w-full max-w-2xl animate-fadeIn">
          <Outlet />
        </div>
      </main>

      {/* Footer - overlay on gradient */}
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

export default PlayerLayout;