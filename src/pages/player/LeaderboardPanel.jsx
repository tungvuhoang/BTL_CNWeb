import { useEffect, useState } from 'react';
import { playerApi } from '../../api/playerApi';
import { playerStorage } from '../../utils/playerStorage';

const LeaderboardPanel = ({ roomId, latestResult }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [animatedPlayerId, setAnimatedPlayerId] = useState(null);

  const player = playerStorage.get();
  const currentPlayerId = Number(player.playerId);

  useEffect(() => {
    fetchLeaderboard();
  }, [roomId, latestResult]);

  useEffect(() => {
    if (!latestResult) return;

    setAnimatedPlayerId(currentPlayerId);

    const timeout = setTimeout(() => {
      setAnimatedPlayerId(null);
    }, 700);

    return () => clearTimeout(timeout);
  }, [latestResult, currentPlayerId]);

  const fetchLeaderboard = async () => {
    try {
      const res = await playerApi.getLeaderboard(roomId);
      const data = res.data || res;

      setLeaderboard(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ color: 'white' }}>
      <h2
        style={{
          color: 'white',
          textAlign: 'center',
          marginBottom: 16,
          fontSize: 28,
          fontWeight: 900,
        }}
      >
        Leaderboard
      </h2>

      {leaderboard.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'white' }}>No scores yet</p>
      ) : (
        leaderboard.map((item, index) => {
          const isCurrentPlayer =
            Number(item.playerId) === currentPlayerId;

          const shouldAnimate =
            Number(item.playerId) === animatedPlayerId;

          return (
            <div
              key={`${item.playerId}-${item.score}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                marginBottom: 10,
                borderRadius: 14,
                background: isCurrentPlayer
                  ? 'rgba(255,255,255,0.35)'
                  : 'rgba(255,255,255,0.14)',
                color: 'white',
                fontWeight: isCurrentPlayer ? 900 : 700,
                fontSize: 18,
                boxShadow: isCurrentPlayer
                  ? '0 8px 22px rgba(255,255,255,0.18)'
                  : 'none',
                animation: shouldAnimate ? 'rankJump 0.7s ease' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <span>
                #{index + 1} {item.name}
                {isCurrentPlayer ? ' (You)' : ''}
              </span>

              <span>{item.score}</span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default LeaderboardPanel;