import { TrophyOutlined } from '@ant-design/icons';

const GameLeaderboard = ({ leaderboard, title = "Bảng xếp hạng" }) => {
  const topPlayers = leaderboard.slice(0, 5);
  
  return (
    <div className="host-leaderboard">
      <h3 className="host-leaderboard__title">
        <TrophyOutlined style={{ color: '#d89e00', marginRight: '8px' }} />
        {title}
      </h3>
      <div className="host-leaderboard__list">
        {topPlayers.map((player, index) => (
          <div key={player.id} className={`host-leaderboard__item ${index === 0 ? 'top-1' : ''}`}>
            <span className="host-leaderboard__rank">{index + 1}</span>
            <span className="host-leaderboard__name">{player.name}</span>
            <span className="host-leaderboard__score">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLeaderboard;
