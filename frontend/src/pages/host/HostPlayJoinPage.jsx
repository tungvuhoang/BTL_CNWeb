import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { playerApi } from '../../api/playerApi';
import { playerStorage } from '../../utils/playerStorage';
import { useAuth } from '../../context/AuthContext';
import '../host/HostQuizzes.css';

const HostPlayJoinPage = () => {
  const navigate = useNavigate();
  const { username } = useAuth();

  const [pin, setPin] = useState('');
  const [joining, setJoining] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();

    if (!pin.trim()) {
      message.warning('Vui lòng nhập mã PIN');
      return;
    }

    setJoining(true);

    try {
      const res = await playerApi.joinRoom({
        pin: pin.trim(),
        name: username || 'Host Player',
      });

      const data = res.data || res;

      playerStorage.save({
        roomId: data.roomId,
        playerId: data.playerId,
        name: data.name || username || 'Host Player',
      });

      navigate(`/play/room/${data.roomId}`);
    } catch (err) {
      console.log(err);
      message.error('Mã PIN không hợp lệ hoặc không thể vào phòng');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="host-quizzes">
      <section className="host-quizzes__hero">
        <div className="host-quizzes__hero-content">
          <p className="host-quizzes__hero-kicker">Join Game</p>
          <h1>Chơi bằng tài khoản</h1>
          <p>
            Bạn đang chơi với tên tài khoản: <strong>{username}</strong>
          </p>
        </div>
      </section>

      <div className="quiz-detail__info-card" style={{ maxWidth: 560 }}>
        <div className="quiz-detail__info-header">
          <h3 className="quiz-detail__info-title">🎮 Vào phòng chơi</h3>
        </div>

        <div className="quiz-detail__info-body">
          <form onSubmit={handleJoin}>
            <label style={{ fontWeight: 800 }}>Mã PIN</label>

            <input
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Nhập mã PIN"
              style={{
                width: '100%',
                marginTop: 8,
                marginBottom: 18,
                padding: '13px 14px',
                borderRadius: 12,
                border: '2px solid #e5e5e5',
                background: '#fff',
                color: '#111',
                fontSize: 16,
              }}
            />

            <button
              className="btn-create-quiz"
              type="submit"
              disabled={joining}
              style={{ width: '100%' }}
            >
              {joining ? '⏳ Đang vào phòng...' : '🎮 Tham gia'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HostPlayJoinPage;