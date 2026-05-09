import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, message, Modal } from 'antd';
import { UserOutlined, LockOutlined, UnlockOutlined, SettingOutlined } from '@ant-design/icons';
import { getRoomById, updateRoomStatus } from '../../api/roomApi';
import { ROUTES } from '../../utils/constants';
import GameHeader from '../../components/host/GameHeader';
import QuestionCard from '../../components/host/QuestionCard';
import AnswerGrid from '../../components/host/AnswerGrid';
import GameLeaderboard from '../../components/host/GameLeaderboard';
import { useSocket } from '../../hooks/useSocket';
import './HostRoom.css';

const HostRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Basic Room State
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('waiting'); // waiting, playing, finished
  const [players, setPlayers] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

  // Game State driven purely by WebSocket
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  // Socket setup
  const { isConnected } = useSocket(roomId, (_, message) => {
    const { type, payload } = message;

    switch (type) {
      case 'PLAYER_JOINED':
        if (payload && payload.id) {
          setPlayers(prev => {
            if (!prev.find(p => p.id === payload.id)) {
              return [...prev, payload];
            }
            return prev;
          });
        }
        break;
      case 'GAME_STARTED':
        setStatus('playing');
        break;
      case 'QUESTION_CHANGED':
        setCurrentQuestion({
          text: payload.content,
          answers: [
            { id: 'A', text: payload.answerA },
            { id: 'B', text: payload.answerB },
            { id: 'C', text: payload.answerC },
            { id: 'D', text: payload.answerD }
          ],
          duration: payload.timeLimit
        });
        setTimeLeft(payload.timeLimit || 0);
        break;
      case 'LEADERBOARD_UPDATED':
        setLeaderboard(payload);
        break;
      case 'GAME_ENDED':
        setStatus('finished');
        break;
      default:
        // Ignore any other event types exactly as requested
        break;
    }
  });

  useEffect(() => {
    fetchRoom();
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      const res = await getRoomById(roomId).catch(() => ({ 
        data: { id: roomId, pin: Math.floor(100000 + Math.random() * 900000).toString(), title: 'Phòng Quiz' } 
      }));
      setRoom(res.data);
    } catch {
      message.error('Không thể tải thông tin phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = async () => {
    // Triggers backend to start game, UI will react to GAME_STARTED socket event
    try {
      await updateRoomStatus(roomId, 'playing');
    } catch (error) {
      // Ignore if api is not fully implemented, but avoid local mock state mutation
    }
  };

  const handleNextQuestion = () => {
    // Should call API to next question, UI will react to QUESTION_CHANGED
  };

  const handleEndGame = () => {
    Modal.confirm({
      title: 'Kết thúc game?',
      content: 'Bạn có chắc chắn muốn kết thúc game ngay bây giờ?',
      okText: 'Kết thúc',
      cancelText: 'Huỷ',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await updateRoomStatus(roomId, 'finished');
        } catch (error) {
          // Ignore error, but do not mutate local state
        }
      }
    });
  };

  const goBackToDashboard = () => {
    navigate(ROUTES.HOST_QUIZZES);
  };

  if (loading || !room) {
    return <div className="host-room-layout" style={{ justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 24 }}>Đang tải phòng...</div>;
  }

  // RENDER: LOBBY
  if (status === 'waiting') {
    return (
      <div className="host-room-layout">
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

        <div className="host-room-pin-section">
          <div className="host-room-pin-label">Join at www.kahoot.it with Game PIN:</div>
          <div className="host-room-pin-display">{room.pin}</div>
        </div>

        <div className="host-room-players-container">
          {players.length === 0 ? (
            <div className="host-room-waiting-msg">Đang chờ người chơi...</div>
          ) : (
            <div className="host-room-players-grid">
              {players.map((p, i) => (
                <div key={p.id || i} className="host-room-player-badge" style={{ animationDelay: `${(i % 10) * 0.1}s` }}>
                  {p.name || 'Anonymous'}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="host-room-bottombar">
          <button className="btn-start-game" onClick={handleStartGame} disabled={!isConnected}>
            Start Game {isConnected ? '' : '(Connecting...)'}
          </button>
        </div>
      </div>
    );
  }

  // RENDER: FINISHED
  if (status === 'finished') {
    return (
      <div className="host-room-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <GameLeaderboard leaderboard={leaderboard} title="Kết quả chung cuộc" />
          <div style={{ marginTop: 30, textAlign: 'center' }}>
            <Button type="primary" size="large" onClick={goBackToDashboard} style={{ backgroundColor: '#1368ce', height: '50px', fontSize: '18px', padding: '0 40px', borderRadius: '4px' }}>
              Về trang quản lý
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: PLAYING
  return (
    <div className="host-room-layout host-room-layout--playing">
      <GameHeader 
        currentQuestionNumber={currentQuestionNumber}
        totalQuestions={totalQuestions || currentQuestionNumber}
        timeLeft={timeLeft}
        duration={currentQuestion?.duration || timeLeft}
      />
      
      <div className="host-game-container">
        <div className="host-game-main">
          {currentQuestion ? (
            <>
              <QuestionCard content={currentQuestion.text} />
              <AnswerGrid answers={currentQuestion.answers || []} />
            </>
          ) : (
            <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Đang tải câu hỏi...</div>
          )}
        </div>
        
        <div className="host-game-sidebar">
          <GameLeaderboard leaderboard={leaderboard} />
        </div>
      </div>

      <div className="host-room-bottombar host-room-bottombar--playing">
        <div style={{ display: 'flex', gap: '20px' }}>
          <button className="btn-next-question" onClick={handleNextQuestion}>
            Bỏ qua / Tiếp tục
          </button>
          <button className="btn-end-game" onClick={handleEndGame}>
            Kết thúc Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostRoomPage;