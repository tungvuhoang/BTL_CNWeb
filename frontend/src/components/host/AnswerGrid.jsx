const ANSWER_COLORS = ['#e21b3c', '#1368ce', '#d89e00', '#26890c']; // Red, Blue, Yellow, Green
const SHAPES = ['▲', '◆', '●', '■'];

const AnswerGrid = ({ answers }) => {
  return (
    <div className="host-answers-grid">
      {answers.map((ans, idx) => (
        <div 
          key={ans.id} 
          className="answer-item" 
          style={{ backgroundColor: ANSWER_COLORS[idx % 4] }}
        >
          <span className="answer-item__shape">{SHAPES[idx % 4]}</span>
          <span className="answer-item__text">{ans.text}</span>
        </div>
      ))}
    </div>
  );
};

export default AnswerGrid;
