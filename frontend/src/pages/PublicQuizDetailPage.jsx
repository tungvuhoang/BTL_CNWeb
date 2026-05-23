import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Spin, message, Tag } from 'antd';
import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { getPublicQuizDetail } from '../api/quizApi';
import './host/HostQuizzes.css';

const PublicQuizDetailPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuiz = async () => {
    setLoading(true);

    try {
      const res = await getPublicQuizDetail(quizId);
      const data = res.data || res;

      setQuiz(data);
    } catch (err) {
      console.log(err);
      message.error('Không thể tải quiz public');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-empty">
        <h3>Không tìm thấy quiz</h3>
        <Button onClick={() => navigate('/public-quizzes')}>
          Quay lại tra cứu
        </Button>
      </div>
    );
  }

  const questions = quiz.questions || [];

  return (
    <div className="host-quizzes">
      <button
        className="quiz-detail__back"
        onClick={() => navigate('/public-quizzes')}
      >
        <ArrowLeftOutlined />
        Quay lại tra cứu
      </button>

      <section className="host-quizzes__hero">
        <div className="host-quizzes__hero-content">
          <p className="host-quizzes__hero-kicker">Public Quiz</p>
          <h1>{quiz.title}</h1>
          <p>Quiz công khai có thể được xem bởi tất cả người dùng.</p>
        </div>
      </section>

      <div className="quiz-detail__info-card">
        <div className="quiz-detail__info-header">
          <h3 className="quiz-detail__info-title">
            <QuestionCircleOutlined />
            Danh sách câu hỏi
          </h3>

          <Tag color="green">🌍 Public</Tag>
        </div>

        <div className="quiz-detail__info-body" style={{ padding: 0 }}>
          {questions.length === 0 ? (
            <p>Quiz này chưa có câu hỏi.</p>
          ) : (
            questions.map((q, index) => (
              <div
                key={q.questionId || index}
                className="question-card"
              >
                <h3 style={{ margin: 0 }}>
                  Câu {index + 1}: {q.content}
                </h3>

                <div className="question-answers-grid">
                  <div className="question-answer-item">
                    <span className="answer-shape">▲</span>
                    {q.answerA}
                  </div>

                  <div className="question-answer-item">
                    <span className="answer-shape">◆</span>
                    {q.answerB}
                  </div>

                  <div className="question-answer-item">
                    <span className="answer-shape">●</span>
                    {q.answerC}
                  </div>

                  <div className="question-answer-item">
                    <span className="answer-shape">■</span>
                    {q.answerD}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicQuizDetailPage;