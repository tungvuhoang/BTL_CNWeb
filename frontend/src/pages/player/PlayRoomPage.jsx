import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS } from '../../utils/constants';

const PlayRoomPage = () => {
  const { roomId } = useParams();
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem(LOCAL_STORAGE_KEYS.PLAYER_NAME);
    if (name) setPlayerName(name);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Room: {roomId}</h1>
      <p>Welcome, {playerName}!</p>
      <p>Waiting for host to start the game...</p>
    </div>
  );
};

export default PlayRoomPage;