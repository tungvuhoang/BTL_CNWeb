import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlayerInput, PlayerButton } from '../../components/PlayerContainer';
import { playerApi } from '../../api/playerApi';
import { playerStorage } from '../../utils/playerStorage';

const PlayJoinPage = () => {
  const navigate = useNavigate();

  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [joining, setJoining] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!pin.trim()) newErrors.pin = 'Vui lòng nhập mã PIN';
    if (!name.trim()) newErrors.name = 'Vui lòng nhập tên người chơi';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setJoining(true);

    try {
      const res = await playerApi.joinRoom({
        pin: pin.trim(),
        name: name.trim(),
      });

      const data = res.data || res;

      playerStorage.save({
        roomId: data.roomId,
        playerId: data.playerId,
        name: data.name || name.trim(),
      });

      navigate(`/play/room/${data.roomId}`);
    } catch (err) {
      console.error(err);
      setErrors({
        pin: 'Mã PIN không hợp lệ hoặc không thể vào phòng',
      });
    } finally {
      setJoining(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'pin') setPin(value.replace(/\D/g, '').slice(0, 6));
    if (name === 'name') setName(value);

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 28%), linear-gradient(135deg, #2d0a5e 0%, #46178f 48%, #864cbf 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 500,
          background: '#fff',
          borderRadius: 28,
          padding: '42px 38px',
          textAlign: 'center',
          boxShadow: '0 24px 70px rgba(0,0,0,0.28)',
        }}
      >

        <h1
          style={{
            margin: '8px 0 10px',
            fontSize: 38,
            lineHeight: 1.1,
            color: '#2d0a5e',
            fontWeight: 900,
          }}
        >
          Vào phòng chơi
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            textAlign: 'left',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 800,
                color: '#333',
              }}
            >
              Mã PIN
            </label>

            <PlayerInput
              name="pin"
              type="text"
              placeholder="Nhập mã PIN"
              value={pin}
              onChange={handleChange}
              maxLength={6}
              autoComplete="off"
              disabled={joining}
            />

            {errors.pin && (
              <p
                style={{
                  margin: '8px 0 0',
                  color: '#e21b3c',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {errors.pin}
              </p>
            )}
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 800,
                color: '#333',
              }}
            >
              Tên người chơi
            </label>

            <PlayerInput
              name="name"
              type="text"
              placeholder="Nhập tên của bạn"
              value={name}
              onChange={handleChange}
              maxLength={20}
              autoComplete="off"
              disabled={joining}
            />

            {errors.name && (
              <p
                style={{
                  margin: '8px 0 0',
                  color: '#e21b3c',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {errors.name}
              </p>
            )}
          </div>

          <PlayerButton
            type="submit"
            size="xl"
            variant="primary"
            disabled={joining}
            style={{
              marginTop: 10,
              width: '100%',
            }}
          >
            {joining ? '⏳ Đang vào phòng...' : '🎮 Tham gia ngay'}
          </PlayerButton>
        </form>

        <div
          style={{
            marginTop: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <Link
            to="/"
            style={{
              color: '#6c3db4',
              fontSize: 14,
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            ← Về trang chủ
          </Link>

          <p
            style={{
              margin: 0,
              color: '#777',
              fontSize: 13,
            }}
          >
            Không cần đăng nhập để tham gia chơi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayJoinPage;