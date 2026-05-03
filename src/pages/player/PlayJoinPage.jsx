import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS } from '../../utils/constants';
import { PlayerContainer, PlayerInput, PlayerButton } from '../../components/PlayerContainer';
import { playerApi } from '../../api/playerApi';
import { playerStorage } from '../../utils/playerStorage';

const PlayJoinPage = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
  event.preventDefault();
  const newErrors = {};
  
  if (!pin.trim()) newErrors.pin = 'PIN is required';
  if (!name.trim()) newErrors.name = 'Name is required';
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const res = await playerApi.joinRoom({
      pin: pin.trim(),
      name: name.trim(),
    });

    // lưu full info player
    playerStorage.save({
      roomId: res.roomId,
      playerId: res.playerId,
      name: name.trim(),
    });

    navigate(`/play/room/${res.roomId}`);

  } catch (err) {
    console.error(err);
    setErrors({
      pin: 'Invalid PIN or cannot join room',
    });
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'pin') setPin(value);
    if (name === 'name') setName(value);
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <PlayerContainer title="Join a Quiz Game">

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <PlayerInput
            name="pin"
            type="text"
            placeholder="Enter Game PIN"
            value={pin}
            onChange={handleChange}
            maxLength={6}
            autoComplete="off"
          />
          {errors.pin && <p className="text-red-500 text-sm mt-2">{errors.pin}</p>}
        </div>

        <div>
          <PlayerInput
            name="name"
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={handleChange}
            maxLength={20}
            autoComplete="off"
          />
          {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
        </div>

        <PlayerButton type="submit" size="xl" variant="primary" className="mt-8">
          Join Game
        </PlayerButton>
      </form>
    </PlayerContainer>
  );
};

export default PlayJoinPage;