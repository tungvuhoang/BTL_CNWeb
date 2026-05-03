import { Outlet } from 'react-router-dom';
import PlayerHeader from '../components/PlayerHeader';

const PlayerLayout = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #5f0fbd, #7b2ff7, #2d0b59)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header style={{ position: 'relative', zIndex: 10 }}>
        <PlayerHeader showNav={false} />
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default PlayerLayout;