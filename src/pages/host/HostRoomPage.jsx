import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, message, Modal } from 'antd';
import { UserOutlined, LockOutlined, UnlockOutlined, SettingOutlined } from '@ant-design/icons';
import { getRoomById, updateRoomStatus } from '../../api/roomApi';
import { ROUTES } from '../../utils/constants';
import GameHeader from '../../components/host/GameHeader';
import QuestionCard from '../../components/host/QuestionCard';
import AnswerGrid from '../../components/host/AnswerGrid';
import GameLeaderboard from '../../components/host/GameLeaderboard';
import './HostRoom.css';

const DUMMY_PLAYERS = [
  { id: 1, name: 'Tùng Vũ' },
  { id: 2, name: 'Hải Nguyễn' },
  { id: 3, name: 'Trang Phạm' },
  { id: 4, name: 'Long Đỗ' },
  { id: 5, name: 'Quang Lê' },
];

const MOCK_QUESTIONS = [
  {
    id: 1,
    text: "Thủ đô của Việt Nam là gì?",
    answers: [
      { id: 'A', text: 'Hồ Chí Minh' },
      { id: 'B', text: 'Đà Nẵng' },
      { id: 'C', text: 'Hà Nội' },
      { id: 'D', text: 'Huế' }
    ],
    duration: 15
  },
  {
    id: 2,
    text: "Đỉnh núi cao nhất Việt Nam?",
    answers: [
      { id: 'A', text: 'Fansipan' },
      { id: 'B', text: 'Ngọc Linh' },
      { id: 'C', text: 'Bạch Mã' },
      { id: 'D', text: 'Langbiang' }
    ],
    duration: 10
  }
];

const INITIAL_LEADERBOARD = DUMMY_PLAYERS.map(p => ({ ...p, score: 0 }));

const HostRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Basic Room State
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('waiting'); // waiting, playing, finished
  const [players, setPlayers] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

  // Game State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions] = useState(MOCK_QUESTIONS);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [leaderboard, setLeaderboard] = useState(INITIAL_LEADERBOARD);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

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

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setStartTime(Date.now());
      setTimeLeft(questions[currentQuestionIndex + 1].duration);
    } else {
      setStatus('finished');
      message.info('Trò chơi kết thúc');
    }
  }, [currentQuestionIndex, questions]);

  // Timer Logic
  useEffect(() => {
    if (status !== 'playing' || !currentQuestion) return;
    
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const newTimeLeft = currentQuestion.duration - elapsed;
      
      if (newTimeLeft <= 0) {
        setTimeLeft(0);
        clearInterval(timer);
        handleNextQuestion();
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [status, startTime, currentQuestion, handleNextQuestion]);

  // Leaderboard Mock Update (Fake Realtime)
  useEffect(() => {
    if (status !== 'playing') return;
    
    const lbTimer = setInterval(() => {
      setLeaderboard(prev => {
        const updated = prev.map(p => ({
          ...p,
          score: p.score + Math.floor(Math.random() * 50)
        }));
        return updated.sort((a, b) => b.score - a.score);
      });
    }, 2500);

    return () => clearInterval(lbTimer);
  }, [status]);

  const handleStartGame = () => {
    setStatus('playing');
    setCurrentQuestionIndex(0);
    setStartTime(Date.now());
    setTimeLeft(questions[0].duration);
    message.success('Bắt đầu game!');
  };

  const handleEndGame = () => {
    Modal.confirm({
      title: 'Kết thúc game?',
      content: 'Bạn có chắc chắn muốn kết thúc game ngay bây giờ?',
      okText: 'Kết thúc',
      cancelText: 'Huỷ',
      okButtonProps: { danger: true },
      onOk: () => {
        setStatus('finished');
        message.success('Game đã kết thúc');
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
                <div key={p.id} className="host-room-player-badge" style={{ animationDelay: `${i * 0.1}s` }}>
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="host-room-bottombar">
          <button className="btn-start-game" onClick={handleStartGame}>
            Start Game
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
        currentQuestionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        timeLeft={timeLeft}
        duration={currentQuestion.duration}
      />
      
      <div className="host-game-container">
        <div className="host-game-main">
          <QuestionCard content={currentQuestion.text} />
          <AnswerGrid answers={currentQuestion.answers} />
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