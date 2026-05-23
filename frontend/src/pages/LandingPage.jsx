import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const LandingPage = () => {
  const navigate = useNavigate();

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
          maxWidth: 560,
          background: '#fff',
          borderRadius: 28,
          padding: '46px 42px',
          textAlign: 'center',
          boxShadow: '0 24px 70px rgba(0,0,0,0.28)',
        }}
      >
        <div style={{ fontSize: 54, marginBottom: 10 }}>🎮</div>

        <p
          style={{
            margin: 0,
            color: '#66bf39',
            fontWeight: 800,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            fontSize: 13,
          }}
        >
          Web_Quiz
        </p>

        <h1
          style={{
            margin: '8px 0 12px',
            fontSize: 42,
            lineHeight: 1.1,
            color: '#2d0a5e',
            fontWeight: 900,
          }}
        >
          Chơi là học
        </h1>

        <p
          style={{
            margin: '0 auto 34px',
            color: '#666',
            fontSize: 16,
            lineHeight: 1.6,
            maxWidth: 430,
          }}
        >
          Tạo quiz, host game thời gian thực hoặc tham gia phòng chơi bằng mã PIN.
        </p>

        <div
          style={{
            display: 'grid',
            gap: 14,
          }}
        >
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            style={primaryBtn}
          >
            Đăng nhập
          </button>

          <button
            onClick={() => navigate(ROUTES.REGISTER)}
            style={secondaryBtn}
          >
            Đăng ký tài khoản
          </button>

          <button
            onClick={() => navigate('/play')}
            style={playBtn}
          >
            🎯 Chơi ngay
          </button>
        </div>
      </div>
    </div>
  );
};

const baseBtn = {
  width: '100%',
  border: 'none',
  borderRadius: 12,
  padding: '15px 20px',
  fontSize: 17,
  fontWeight: 800,
  cursor: 'pointer',
};

const primaryBtn = {
  ...baseBtn,
  color: '#fff',
  background: '#46178f',
  boxShadow: '0 5px 0 #2d0a5e',
};

const secondaryBtn = {
  ...baseBtn,
  color: '#46178f',
  background: '#efe8ff',
  boxShadow: '0 4px 0 #d8c6ff',
};

const playBtn = {
  ...baseBtn,
  color: '#fff',
  background: '#26890c',
  boxShadow: '0 5px 0 #1b6508',
};

export default LandingPage;