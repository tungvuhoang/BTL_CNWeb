import { useEffect, useState } from 'react';
import { playerApi } from '../../api/playerApi';
import { playerStorage } from '../../utils/playerStorage';
import LeaderboardPanel from './LeaderboardPanel';

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
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const player = playerStorage.get();

  useEffect(() => {
    fetchCurrentQuestion();
  }, [roomId]);

  useEffect(() => {
    if (timeRemaining === null || submitted || timeRemaining <= 0) return;

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
      setShowLeaderboard(false);
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

      const data = res.data || res;
      setResult(data);

      setTimeout(() => {
        setShowLeaderboard(true);
      }, 700);
    } catch (err) {
      console.error(err);
      setError('Cannot submit answer');
      setSubmitted(false);
      setSelectedAnswer('');
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
    <div
      style={{
        width: '100%',
        maxWidth: 900,
        margin: '0 auto',
        color: 'white',
      }}
    >
      <div>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              display: 'inline-block',
              background: 'white',
              color: '#46178f',
              borderRadius: 999,
              padding: '10px 22px',
              fontWeight: 900,
              fontSize: 24,
              marginBottom: 16,
              boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
            }}
          >
            {timeRemaining}s
          </div>

          <h1 style={{ color: 'white', fontSize: 32, marginBottom: 12 }}>
            Question {question.questionNumber} / {question.totalQuestions}
          </h1>

          <div
            style={{
              background: 'white',
              color: '#111827',
              borderRadius: 18,
              padding: 26,
              fontSize: 26,
              fontWeight: 800,
              boxShadow: '0 14px 34px rgba(0,0,0,0.25)',
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
                  minHeight: 112,
                  border: isSelected ? '4px solid white' : '4px solid transparent',
                  borderRadius: 14,
                  background: answerColors[answer.key],
                  color: 'white',
                  fontSize: 22,
                  fontWeight: 900,
                  cursor: submitted || timeRemaining <= 0 ? 'not-allowed' : 'pointer',
                  opacity: submitted && !isSelected ? 0.5 : 1,
                  boxShadow: '0 8px 0 rgba(0,0,0,0.25)',
                  transition: 'transform 0.12s ease, opacity 0.12s ease',
                }}
              >
                {answer.key}. {answer.text}
              </button>
            );
          })}
        </div>

        {submitted && (
          <div style={{ textAlign: 'center', marginTop: 26 }}>
            <h2 style={{ color: 'white', marginBottom: 8 }}>
              {result ? (result.isCorrect ? 'Correct!' : 'Incorrect!') : 'Submitting...'}
            </h2>

            {result && (
              <p style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>
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

      {showLeaderboard && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            background: 'rgba(70, 23, 143, 0.98)',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: '24px 16px',
            boxShadow: '0 -12px 40px rgba(0,0,0,0.35)',
            animation: 'slideUp 0.45s ease-out',
          }}
        >
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <LeaderboardPanel roomId={roomId} latestResult={result} />

            <button
              onClick={() => setShowLeaderboard(false)}
              style={{
                marginTop: 16,
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                border: 'none',
                background: 'white',
                color: '#46178f',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerGameScreen;