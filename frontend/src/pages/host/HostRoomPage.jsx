import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, message, Modal } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import {
  getRoomById,
  getPlayersInRoom,
  startGame,
  nextQuestion,
  endGame,
  getCurrentQuestion,
  getLeaderboard,
} from '../../api/roomApi';

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

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState('waiting');
  const [players, setPlayers] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const [timeLeft, setTimeLeft] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  // WebSocket realtime
  const { isConnected } = useSocket(roomId, (_, socketMessage) => {
    const { type, payload } = socketMessage;

    switch (type) {
      case 'PLAYER_JOINED':
        if (payload && (payload.playerId || payload.id)) {
          setPlayers(prev => {
            const incomingId = payload.playerId || payload.id;
            if (!prev.find(p => (p.playerId || p.id) === incomingId)) {
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
        setCurrentQuestion(payload);

        setCurrentQuestionNumber(
          payload.currentQuestionNumber ||
          payload.questionNumber ||
          1
        );

        setTotalQuestions(
          payload.totalQuestions || totalQuestions
        );

        setTimeLeft(payload.timeLimit || 20);
        break;

      case 'LEADERBOARD_UPDATED':
        setLeaderboard(payload || []);
        break;

      case 'GAME_ENDED':
        setStatus('finished');
        break;

      default:
        break;
    }
  });

  const fetchRoom = async () => {
    try {
      const res = await getRoomById(roomId);
      const data = res.data || res;

      setRoom(data);
      setStatus((data.status || 'WAITING').toLowerCase());
      setTotalQuestions(data.totalQuestions || 0);
    } catch (err) {
      console.log(err);
      message.error('Không thể tải thông tin phòng');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const res = await getPlayersInRoom(roomId);
      setPlayers(res.data || res || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCurrentQuestion = async () => {
    try {
      const res = await getCurrentQuestion(roomId);
      const data = res.data || res;

      setCurrentQuestion(data);

      setCurrentQuestionNumber(
        data.currentQuestionNumber ||
        data.questionNumber ||
        1
      );

      setTotalQuestions(
        data.totalQuestions || totalQuestions
      );

      setTimeLeft(data.timeLimit || 20);
    } catch (err) {
      console.log(err);
      message.error('Không tải được câu hỏi hiện tại');
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await getLeaderboard(roomId);
      setLeaderboard(res.data || res || []);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch 1 lần khi vào trang
  useEffect(() => {
    fetchRoom();
    fetchPlayers();
  }, [roomId]);

  // Polling fallback: chỉ chạy khi WebSocket chưa kết nối
  useEffect(() => {
    if (isConnected) return;

    const interval = setInterval(() => {
      fetchPlayers();

      if (status === 'playing') {
        fetchLeaderboard();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [roomId, status, isConnected]);

  useEffect(() => {
    if (status !== 'playing' || !currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [status, currentQuestion]);

  const handleStartGame = async () => {
    if (!isConnected) {
      message.warning('WebSocket chưa kết nối');
      return;
    }

    try {
      await startGame(roomId);

      setStatus('playing');

      await fetchCurrentQuestion();
      await fetchLeaderboard();

      message.success('Bắt đầu game!');
    } catch (err) {
      console.log(err);
      message.error('Không thể bắt đầu game');
    }
  };

  const handleNextQuestion = async () => {
    try {
      await nextQuestion(roomId);

      await fetchCurrentQuestion();
      await fetchLeaderboard();
    } catch (err) {
      console.log(err);

      setStatus('finished');

      message.info('Trò chơi kết thúc');
    }
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
          await endGame(roomId);

          await fetchLeaderboard();

          setStatus('finished');

          message.success('Game đã kết thúc');
        } catch (err) {
          console.log(err);
          message.error('Không thể kết thúc game');
        }
      },
    });
  };

  const goBackToDashboard = () => {
    navigate(ROUTES.HOST_QUIZZES);
  };

  const normalizeAnswers = question => {
    if (!question) return [];

    if (question.answers) return question.answers;

    return [
      { id: 'A', text: question.answerA },
      { id: 'B', text: question.answerB },
      { id: 'C', text: question.answerC },
      { id: 'D', text: question.answerD },
    ].filter(a => a.text);
  };

  if (loading || !room) {
    return (
      <div
        className="host-room-layout"
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: 24,
        }}
      >
        Đang tải phòng...
      </div>
    );
  }

  if (status === 'waiting') {
    return (
      <div className="host-room-layout">
        <div className="host-room-topbar">
          <h2 className="host-room-topbar__title">
            {room.title || room.quizTitle || 'Phòng chờ Quiz'}
          </h2>

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

            <Button
              type="text"
              style={{ color: 'white' }}
              icon={<SettingOutlined />}
            />
          </div>
        </div>

        <div className="host-room-pin-section">
          <div className="host-room-pin-label">
            Join with Game PIN:
          </div>

          <div className="host-room-pin-display">
            {room.pin}
          </div>
        </div>

        <div className="host-room-players-container">
          {players.length === 0 ? (
            <div className="host-room-waiting-msg">
              Đang chờ người chơi...
            </div>
          ) : (
            <div className="host-room-players-grid">
              {players.map((p, i) => (
                <div
                  key={p.playerId || p.id || i}
                  className="host-room-player-badge"
                >
                  {p.name || p.playerName}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="host-room-bottombar">
          <button
            className="btn-start-game"
            onClick={handleStartGame}
            disabled={!isConnected}
          >
            Start Game {isConnected ? '' : '(Connecting...)'}
          </button>
        </div>
      </div>
    );
  }

  if (status === 'finished') {
    return (
      <div
        className="host-room-layout"
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <GameLeaderboard
            leaderboard={leaderboard}
            title="Kết quả chung cuộc"
          />

          <div
            style={{
              marginTop: 30,
              textAlign: 'center',
            }}
          >
            <Button
              type="primary"
              size="large"
              onClick={goBackToDashboard}
            >
              Về trang quản lý
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const answers = normalizeAnswers(currentQuestion);

  return (
    <div className="host-room-layout host-room-layout--playing">
      <GameHeader
        currentQuestionNumber={currentQuestionNumber}
        totalQuestions={
          totalQuestions || currentQuestionNumber
        }
        timeLeft={timeLeft}
        duration={
          currentQuestion?.timeLimit ||
          currentQuestion?.duration ||
          20
        }
      />

      <div className="host-game-container">
        <div className="host-game-main">
          {currentQuestion ? (
            <>
              <QuestionCard
                content={
                  currentQuestion?.content ||
                  currentQuestion?.text ||
                  'Không có câu hỏi'
                }
              />

              <AnswerGrid answers={answers} />
            </>
          ) : (
            <div
              style={{
                color: 'white',
                textAlign: 'center',
                marginTop: '50px',
              }}
            >
              Đang tải câu hỏi...
            </div>
          )}
        </div>

        <div className="host-game-sidebar">
          <GameLeaderboard leaderboard={leaderboard} />
        </div>
      </div>

      <div className="host-room-bottombar host-room-bottombar--playing">
        <div style={{ display: 'flex', gap: '20px' }}>
          <button
            className="btn-next-question"
            onClick={handleNextQuestion}
          >
            Bỏ qua / Tiếp tục
          </button>

          <button
            className="btn-end-game"
            onClick={handleEndGame}
          >
            Kết thúc Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostRoomPage;