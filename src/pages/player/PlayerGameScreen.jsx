import { useEffect, useState } from 'react';
import { playerApi } from '../../api/playerApi';
import { playerStorage } from '../../utils/playerStorage';

const answerColors = {
  A: '#e21b3c',
  B: '#1368ce',
  C: '#d89e00',
  D: '#26890c',
};

const PlayerGameScreen = ({ roomId }) => {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [error, setError] = useState('');

  const player = playerStorage.get();

  useEffect(() => {
    fetchCurrentQuestion();
  }, [roomId]);

  useEffect(() => {
    if (timeRemaining === null || submitted) return;

    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, submitted]);

  const fetchCurrentQuestion = async () => {
    try {
      const res = await playerApi.getCurrentQuestion(roomId);
      const data = res.data || res;

      setQuestion(data);
      setTimeRemaining(data.timeRemaining ?? data.timeLimit ?? 0);
      setSelectedAnswer('');
      setSubmitted(false);
      setResult(null);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Cannot load current question');
    }
  };

  const handleSelectAnswer = async (answer) => {
    if (submitted || timeRemaining <= 0) return;

    setSelectedAnswer(answer);
    setSubmitted(true);

    try {
      const res = await playerApi.submitAnswer(roomId, {
        playerId: Number(player.playerId),
        questionId: question.questionId,
        selectedAnswer: answer,
      });

      setResult(res.data || res);
    } catch (err) {
      console.error(err);
      setError('Cannot submit answer');
      setSubmitted(false);
    }
  };

  if (error) {
    return (
      <div style={{ color: 'white', textAlign: 'center' }}>
        <h2 style={{ color: 'white' }}>{error}</h2>
      </div>
    );
  }

  if (!question) {
    return (
      <div style={{ color: 'white', textAlign: 'center' }}>
        <h2 style={{ color: 'white' }}>Loading question...</h2>
      </div>
    );
  }

  const answers = [
    { key: 'A', text: question.answerA },
    { key: 'B', text: question.answerB },
    { key: 'C', text: question.answerC },
    { key: 'D', text: question.answerD },
  ];

  return (
    <div style={{ width: '100%', maxWidth: 900, color: 'white' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div
          style={{
            display: 'inline-block',
            background: 'white',
            color: '#46178f',
            borderRadius: 999,
            padding: '10px 20px',
            fontWeight: 800,
            fontSize: 22,
            marginBottom: 16,
          }}
        >
          {timeRemaining}s
        </div>

        <h1 style={{ color: 'white', fontSize: 32, marginBottom: 8 }}>
          Question {question.questionNumber} / {question.totalQuestions}
        </h1>

        <div
          style={{
            background: 'white',
            color: '#111827',
            borderRadius: 16,
            padding: 24,
            fontSize: 24,
            fontWeight: 700,
            boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
          }}
        >
          {question.content}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        {answers.map((answer) => {
          const isSelected = selectedAnswer === answer.key;

          return (
            <button
              key={answer.key}
              onClick={() => handleSelectAnswer(answer.key)}
              disabled={submitted || timeRemaining <= 0}
              style={{
                minHeight: 110,
                border: isSelected ? '4px solid white' : 'none',
                borderRadius: 12,
                background: answerColors[answer.key],
                color: 'white',
                fontSize: 22,
                fontWeight: 800,
                cursor: submitted || timeRemaining <= 0 ? 'not-allowed' : 'pointer',
                opacity: submitted && !isSelected ? 0.55 : 1,
                boxShadow: '0 8px 0 rgba(0,0,0,0.25)',
              }}
            >
              {answer.key}. {answer.text}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <h2 style={{ color: 'white' }}>
            Answer submitted!
          </h2>

          {result && (
            <p style={{ color: 'white', fontSize: 18 }}>
              +{result.pointsEarned} points | Total: {result.totalScore}
            </p>
          )}
        </div>
      )}

      {timeRemaining === 0 && !submitted && (
        <p style={{ color: 'white', textAlign: 'center', marginTop: 24 }}>
          Time is up!
        </p>
      )}
    </div>
  );
};

export default PlayerGameScreen;