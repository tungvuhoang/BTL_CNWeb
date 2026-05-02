import { Link } from 'react-router-dom';

/**
 * PlayerHeader - Navigation header content for player pages
 * Displays branding and navigation controls
 */
export const PlayerHeader = ({ roomPin, playerName, showNav = true }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Logo & Branding */}
        <div className="flex items-center space-x-2">
          <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🎮 Web_Quiz
          </div>
        </div>

        {/* Center Info */}
        <div className="hidden sm:flex items-center space-x-6 text-sm">
          {roomPin && (
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase">Room PIN</p>
              <p className="text-xl font-bold text-indigo-600">{roomPin}</p>
            </div>
          )}
          {playerName && (
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase">Player</p>
              <p className="text-lg font-semibold text-gray-900">{playerName}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        {showNav && (
          <nav className="flex items-center space-x-4">
            <Link
              to="/play"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
            >
              Join Game
            </Link>
          </nav>
        )}
      </div>

      {/* Mobile Info */}
      <div className="sm:hidden mt-4 flex justify-around text-xs">
        {roomPin && (
          <div className="text-center">
            <p className="text-gray-500 uppercase">PIN: {roomPin}</p>
          </div>
        )}
        {playerName && (
          <div className="text-center">
            <p className="text-gray-700 font-semibold">{playerName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerHeader;
