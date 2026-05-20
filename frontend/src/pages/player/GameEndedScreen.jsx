import { useEffect, useState } from 'react';
import { playerApi } from '../../api/playerApi';
import { playerStorage } from '../../utils/playerStorage';

const GameEndedScreen = ({ roomId }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');

  const player = playerStorage.get();
  const currentPlayerId = Number(player.playerId);

  useEffect(() => {
    fetchFinalResult();
  }, [roomId]);

  const fetchFinalResult = async () => {
    try {
      const res = await playerApi.getLeaderboard(roomId);
      const data = res.data || res;

      setLeaderboard(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Cannot load final result');
    }
  };

  const currentPlayerRank = leaderboard.findIndex(
    (item) => Number(item.playerId) === currentPlayerId
  ) + 1;

  const currentPlayer = leaderboard.find(
    (item) => Number(item.playerId) === currentPlayerId
  );

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 720,
        color: 'white',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: 'white', fontSize: 44, marginBottom: 12 }}>
        🎉 Game Over!
      </h1>

      <p style={{ fontSize: 20, marginBottom: 28 }}>
        Final results are here
      </p>

      {error && <p style={{ color: 'white' }}>{error}</p>}

      {currentPlayer && (
        <div
          style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 20,
            padding: 24,
            marginBottom: 24,
            boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
          }}
        >
          <h2 style={{ color: 'white', marginBottom: 8 }}>
            Your Result
          </h2>

          <p style={{ fontSize: 24, fontWeight: 900 }}>
            Rank #{currentPlayerRank}
          </p>

          <p style={{ fontSize: 22 }}>
            Score: <b>{currentPlayer.score}</b>
          </p>
        </div>
      )}

      <div
        style={{
          background: 'rgba(255,255,255,0.16)',
          borderRadius: 20,
          padding: 24,
          boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
        }}
      >
        <h2 style={{ color: 'white', marginBottom: 16 }}>
          Final Leaderboard
        </h2>

        {leaderboard.length === 0 ? (
          <p>No result yet</p>
        ) : (
          leaderboard.map((item, index) => {
            const isCurrentPlayer =
              Number(item.playerId) === currentPlayerId;

            return (
              <div
                key={item.playerId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  marginBottom: 10,
                  borderRadius: 14,
                  background: isCurrentPlayer
                    ? 'rgba(255,255,255,0.35)'
                    : 'rgba(255,255,255,0.12)',
                  color: 'white',
                  fontWeight: isCurrentPlayer ? 900 : 700,
                  fontSize: 18,
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
    </div>
  );
};

export default GameEndedScreen;