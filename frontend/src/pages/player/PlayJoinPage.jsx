import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS } from '../../utils/constants';
import { PlayerContainer, PlayerInput, PlayerButton } from '../../components/PlayerContainer';

const PlayJoinPage = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};
    
    if (!pin.trim()) newErrors.pin = 'PIN is required';
    if (!name.trim()) newErrors.name = 'Name is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    localStorage.setItem(LOCAL_STORAGE_KEYS.PLAYER_NAME, name.trim());
    navigate(`/play/room/${pin.trim()}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'pin') setPin(value);
    if (name === 'name') setName(value);
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <PlayerContainer title="Join a Quiz Game">
      <p className="text-center text-gray-600 text-lg mb-8">
        Enter the game PIN and your name to join
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          🎮 Join Game
        </PlayerButton>
      </form>
    </PlayerContainer>
  );
};

export default PlayJoinPage;