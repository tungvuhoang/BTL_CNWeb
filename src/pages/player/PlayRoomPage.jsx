import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { playerApi } from '../../api/playerApi';
import { playerStorage } from '../../utils/playerStorage';
import PlayerGameScreen from './PlayerGameScreen';

const PlayRoomPage = () => {
  const { roomId } = useParams();

  const [player, setPlayer] = useState(null);
  const [room, setRoom] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedPlayer = playerStorage.get();
    setPlayer(savedPlayer);

    fetchRoomState();

    // Tạm thời polling 3s. Sau này thay bằng WebSocket subscribe.
    const interval = setInterval(fetchRoomState, 3000);

    return () => {
      clearInterval(interval);
      // TODO: disconnect websocket here later
    };
  }, [roomId]);

  const fetchRoomState = async () => {
    try {
      const res = await playerApi.getRoomState(roomId);
      const data = res.data || res;

      setRoom(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Cannot load room information');
    }
  };

  if (error) {
    return (
      <div style={{ color: 'white', textAlign: 'center' }}>
        <h1 style={{color: '#fff'}}>Room {roomId}</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (room?.status?.toLowerCase() === 'playing') {
    return <PlayerGameScreen roomId={roomId} />;
  }
  
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 520,
        color: 'white',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: 40, marginBottom: 8, color: '#fff'}}>Room {roomId}</h1>

      <p style={{ fontSize: 20, marginBottom: 24 }}>
        Welcome, <b>{player?.playerName || 'Player'}</b>
      </p>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.16)',
          borderRadius: 18,
          padding: 24,
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
        }}
      >
        {room ? (
          <>
            <p style={{ fontSize: 18 }}>
              Status: <b>{room.status || 'waiting'}</b>
            </p>

            <p>
              Players: <b>{room.playerCount ?? 0}</b>
            </p>

            <p>
              Total questions: <b>{room.totalQuestions ?? 0}</b>
            </p>

            <p style={{ marginTop: 24, fontSize: 20, fontWeight: 700 }}>
              Waiting for host to start the game...
            </p>

            <p style={{ marginTop: 8, opacity: 0.8 }}>
              This page will update automatically.
            </p>
          </>
        ) : (
          <p>Loading room...</p>
        )}
      </div>

      {/* TODO WebSocket:
          subscribe /topic/rooms/{roomId}
          subscribe /topic/rooms/{roomId}/question
          subscribe /topic/rooms/{roomId}/leaderboard
      */}
    </div>
  );
};

export default PlayRoomPage;