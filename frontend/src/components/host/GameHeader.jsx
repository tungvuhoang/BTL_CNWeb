import { Progress } from 'antd';

const GameHeader = ({ currentQuestionNumber, totalQuestions, timeLeft, duration }) => {
  const percentage = Math.max(0, (timeLeft / duration) * 100);
  
  return (
    <div className="host-game-header">
      <div className="host-game-header__qnum">
        Câu {currentQuestionNumber} / {totalQuestions}
      </div>
      <div className="host-game-header__timer">
        <Progress 
          type="circle" 
          percent={percentage} 
          format={() => timeLeft} 
          size={70}
          strokeColor={timeLeft <= 5 ? '#e21b3c' : '#864cbf'}
          strokeWidth={10}
        />
      </div>
      <div className="host-game-header__spacer"></div>
    </div>
  );
};

export default GameHeader;
