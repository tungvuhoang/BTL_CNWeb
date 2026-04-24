import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, message, Modal } from 'antd';
import { UserOutlined, LockOutlined, UnlockOutlined, SettingOutlined } from '@ant-design/icons';
import { getRoomById, updateRoomStatus } from '../../api/roomApi';
import { ROUTES } from '../../utils/constants';
import './HostRoom.css';

const DUMMY_PLAYERS = [
  { id: 1, name: 'Tùng Vũ' },
  { id: 2, name: 'Hải Nguyễn' },
  { id: 3, name: 'Trang Phạm' },
  { id: 4, name: 'Long Đỗ' },
  { id: 5, name: 'Quang Lê' },
];

const HostRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('waiting'); // waiting, playing, finished
  const [players, setPlayers] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    fetchRoom();
    
    // Simulate players joining one by one for demo purposes
    const interval = setInterval(() => {
      setPlayers(prev => {
        if (prev.length < DUMMY_PLAYERS.length) {
          return [...prev, DUMMY_PLAYERS[prev.length]];
        }
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      // Khi BE chưa hoàn thiện, có thể bị lỗi, ta mock dữ liệu
      const res = await getRoomById(roomId).catch(() => ({ 
        data: { id: roomId, pin: Math.floor(100000 + Math.random() * 900000).toString(), title: 'Sample Quiz' } 
      }));
      setRoom(res.data);
    } catch {
      message.error('Không thể tải thông tin phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = async () => {
    try {
      // await updateRoomStatus(roomId, 'playing');
      setStatus('playing');
      message.success('Bắt đầu game!');
    } catch {
      message.error('Lỗi khi bắt đầu');
    }
  };

  const handleNextQuestion = () => {
    message.info('Chuyển sang câu tiếp theo');
  };

  const handleEndGame = () => {
    Modal.confirm({
      title: 'Kết thúc game?',
      content: 'Bạn có chắc chắn muốn kết thúc game ngay bây giờ?',
      okText: 'Kết thúc',
      cancelText: 'Huỷ',
      okButtonProps: { danger: true },
      onOk: async () => {
        // await updateRoomStatus(roomId, 'finished');
        setStatus('finished');
        message.success('Game đã kết thúc');
        navigate(ROUTES.HOST_QUIZZES);
      }
    });
  };

  if (loading || !room) {
    return <div className="host-room-layout" style={{ justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 24 }}>Đang tải phòng...</div>;
  }

  return (
    <div className="host-room-layout">
      {/* Top Bar */}
      <div className="host-room-topbar">
        <h2 className="host-room-topbar__title">{room.title || 'Phòng chờ Quiz'}</h2>
        <div className="host-room-topbar__actions">
          <div className="host-room-topbar__players">
            <UserOutlined /> {players.length}
          </div>
          <Button 
            type="text" 
            style={{ color: 'white' }} 
            icon={isLocked ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => setIsLocked(!isLocked)}
          />
          <Button type="text" style={{ color: 'white' }} icon={<SettingOutlined />} />
        </div>
      </div>

      {/* PIN Section */}
      <div className="host-room-pin-section">
        <div className="host-room-pin-label">Join at www.kahoot.it with Game PIN:</div>
        <div className="host-room-pin-display">{room.pin}</div>
      </div>

      {/* Players Grid */}
      <div className="host-room-players-container">
        {players.length === 0 ? (
          <div className="host-room-waiting-msg">Đang chờ người chơi...</div>
        ) : (
          <div className="host-room-players-grid">
            {players.map((p, i) => (
              <div key={p.id} className="host-room-player-badge" style={{ animationDelay: `${i * 0.1}s` }}>
                {p.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="host-room-bottombar">
        {status === 'waiting' && (
          <button className="btn-start-game" onClick={handleStartGame}>
            Start Game
          </button>
        )}
        {status === 'playing' && (
          <div style={{ display: 'flex', gap: '20px' }}>
            <button className="btn-next-question" onClick={handleNextQuestion}>
              Next
            </button>
            <button className="btn-end-game" onClick={handleEndGame}>
              End Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostRoomPage;