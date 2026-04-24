import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Modal, message, Spin } from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  QuestionCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  NumberOutlined,
} from '@ant-design/icons';
import { getQuizById, updateQuiz, deleteQuiz } from '../../api/quizApi';
import { getQuestionsByQuizId, createQuestion, updateQuestion, deleteQuestion } from '../../api/questionApi';
import { createRoom } from '../../api/roomApi';
import { ROUTES } from '../../utils/constants';
import QuestionList from '../../components/host/QuestionList';
import QuestionFormModal from '../../components/host/QuestionFormModal';
import dayjs from 'dayjs';
import './HostQuizzes.css';

const HostQuizDetailPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  /* ── state ─────────────────────────────────────────── */
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  // questions
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // inline edit
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [saving, setSaving] = useState(false);

  // host game
  const [hosting, setHosting] = useState(false);

  // question modal
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionSaving, setQuestionSaving] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // delete modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ── fetch ─────────────────────────────────────────── */
  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await getQuizById(quizId);
      setQuiz(res.data);
      fetchQuestions();
    } catch {
      message.info('BE chưa chạy, hiển thị dữ liệu mẫu (mock data)');
      setQuiz({
        quizId: quizId,
        title: 'Quiz Mẫu (Mock Data)',
        questionCount: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      fetchQuestions();
    }
  };

  const fetchQuestions = async () => {
    setQuestionsLoading(true);
    try {
      const res = await getQuestionsByQuizId(quizId);
      setQuestions(res.data || []);
    } catch {
      // Mock questions
      setQuestions([
        {
          questionId: 'q1',
          content: 'Thủ đô của Việt Nam là gì?',
          timeLimit: 20,
          points: 1000,
          answers: [
            { answerId: 'a1', content: 'Hồ Chí Minh', isCorrect: false },
            { answerId: 'a2', content: 'Đà Nẵng', isCorrect: false },
            { answerId: 'a3', content: 'Hà Nội', isCorrect: true },
            { answerId: 'a4', content: 'Huế', isCorrect: false },
          ]
        },
        {
          questionId: 'q2',
          content: 'Đỉnh núi cao nhất Việt Nam?',
          timeLimit: 20,
          points: 1000,
          answers: [
            { answerId: 'a5', content: 'Fansipan', isCorrect: true },
            { answerId: 'a6', content: 'Ngọc Linh', isCorrect: false },
            { answerId: 'a7', content: 'Bạch Mã', isCorrect: false },
            { answerId: 'a8', content: 'Langbiang', isCorrect: false },
          ]
        }
      ]);
    } finally {
      setQuestionsLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  /* ── handlers ──────────────────────────────────────── */
  const startEdit = () => {
    setEditTitle(quiz?.title ?? '');
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditTitle('');
  };

  const handleSaveTitle = async () => {
    if (!editTitle.trim()) {
      message.warning('Tiêu đề không được để trống');
      return;
    }
    setSaving(true);
    try {
      await updateQuiz(quizId, { title: editTitle.trim() });
      message.success('Đã cập nhật tiêu đề');
      setQuiz((prev) => ({ ...prev, title: editTitle.trim() }));
      setEditing(false);
    } catch {
      message.error('Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteQuiz(quizId);
      message.success('Đã xoá quiz');
      navigate(ROUTES.HOST_QUIZZES);
    } catch {
      message.error('Xoá quiz thất bại');
    } finally {
      setDeleting(false);
    }
  };

  const handleHostGame = async () => {
    setHosting(true);
    try {
      const res = await createRoom(quizId);
      // Giả sử API trả về { roomId: '...', pin: '...' }
      const roomId = res.data?.roomId || res.data?.id;
      if (roomId) {
        navigate(ROUTES.HOST_ROOM.replace(':roomId', roomId));
      } else {
        message.error('Không thể tạo phòng, dữ liệu trả về không hợp lệ');
      }
    } catch {
      message.error('Tạo phòng thất bại');
    } finally {
      setHosting(false);
    }
  };

  /* ── question handlers ──────────────────────────────── */
  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionModalOpen(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      message.success('Đã xoá câu hỏi');
      fetchQuestions();
      setQuiz(prev => ({ ...prev, questionCount: (prev.questionCount || 1) - 1 }));
    } catch {
      message.error('Xoá câu hỏi thất bại');
    }
  };

  const handleSaveQuestion = async (questionData) => {
    setQuestionSaving(true);
    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.questionId || editingQuestion.id, questionData);
        message.success('Cập nhật câu hỏi thành công');
      } else {
        await createQuestion(quizId, questionData);
        message.success('Thêm câu hỏi thành công');
        setQuiz(prev => ({ ...prev, questionCount: (prev.questionCount || 0) + 1 }));
      }
      setQuestionModalOpen(false);
      fetchQuestions();
    } catch {
      message.error('Lưu câu hỏi thất bại');
    } finally {
      setQuestionSaving(false);
    }
  };

  /* ── render: loading ───────────────────────────────── */
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 300,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  /* ── render: not found ─────────────────────────────── */
  if (!quiz) {
    return (
      <div className="quiz-empty">
        <span className="quiz-empty__icon">🔍</span>
        <h3>Không tìm thấy quiz</h3>
        <p>Quiz này có thể đã bị xoá hoặc không tồn tại</p>
        <button
          className="btn-create-quiz"
          onClick={() => navigate(ROUTES.HOST_QUIZZES)}
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  /* ── render ────────────────────────────────────────── */
  return (
    <div className="quiz-detail">
      {/* Back & Host Game */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button
          className="quiz-detail__back"
          onClick={() => navigate(ROUTES.HOST_QUIZZES)}
          style={{ marginBottom: 0 }}
        >
          <ArrowLeftOutlined />
          Quay lại danh sách
        </button>
        <Button 
          type="primary" 
          size="large" 
          className="btn-host-game"
          onClick={handleHostGame}
          loading={hosting}
          style={{ backgroundColor: '#26890c', fontWeight: 600 }}
        >
          🎮 HOST GAME
        </Button>
      </div>

      {/* Hero card */}
      <div className="quiz-detail__hero">
        <div className="quiz-detail__hero-top">
          {editing ? (
            <div className="quiz-detail__edit-row">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onPressEnter={handleSaveTitle}
                size="large"
                autoFocus
                className="quiz-detail__edit-input"
                placeholder="Nhập tiêu đề quiz…"
              />
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={saving}
                onClick={handleSaveTitle}
                size="large"
                className="quiz-detail__edit-btn quiz-detail__edit-save"
              >
                Lưu
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={cancelEdit}
                size="large"
                className="quiz-detail__edit-btn quiz-detail__edit-cancel"
              />
            </div>
          ) : (
            <h1 className="quiz-detail__title">{quiz.title}</h1>
          )}

          {!editing && (
            <div className="quiz-detail__hero-actions">
              <Button icon={<EditOutlined />} onClick={startEdit}>
                Sửa tiêu đề
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => setDeleteOpen(true)}
              >
                Xoá
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="quiz-detail__stats">
          <div className="quiz-detail__stat">
            <span className="quiz-detail__stat-icon">
              <NumberOutlined />
            </span>
            <div className="quiz-detail__stat-info">
              <span className="quiz-detail__stat-label">Quiz ID</span>
              <span className="quiz-detail__stat-value">#{quiz.quizId}</span>
            </div>
          </div>

          <div className="quiz-detail__stat">
            <span className="quiz-detail__stat-icon">
              <QuestionCircleOutlined />
            </span>
            <div className="quiz-detail__stat-info">
              <span className="quiz-detail__stat-label">Câu hỏi</span>
              <span className="quiz-detail__stat-value">
                {quiz.questionCount ?? 0}
              </span>
            </div>
          </div>

          <div className="quiz-detail__stat">
            <span className="quiz-detail__stat-icon">
              <CalendarOutlined />
            </span>
            <div className="quiz-detail__stat-info">
              <span className="quiz-detail__stat-label">Ngày tạo</span>
              <span className="quiz-detail__stat-value">
                {quiz.createdAt
                  ? dayjs(quiz.createdAt).format('DD/MM/YYYY')
                  : '—'}
              </span>
            </div>
          </div>

          <div className="quiz-detail__stat">
            <span className="quiz-detail__stat-icon">
              <ClockCircleOutlined />
            </span>
            <div className="quiz-detail__stat-info">
              <span className="quiz-detail__stat-label">Cập nhật</span>
              <span className="quiz-detail__stat-value">
                {quiz.updatedAt
                  ? dayjs(quiz.updatedAt).format('DD/MM/YYYY')
                  : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions section */}
      <div className="quiz-detail__info-card">
        <div className="quiz-detail__info-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="quiz-detail__info-title">
            📝 Danh sách câu hỏi
          </h3>
          <Button type="primary" onClick={handleOpenAddQuestion}>
            + Thêm câu hỏi
          </Button>
        </div>
        <div className="quiz-detail__info-body" style={{ padding: '0' }}>
          <QuestionList 
            questions={questions} 
            loading={questionsLoading} 
            onEdit={handleOpenEditQuestion}
            onDelete={handleDeleteQuestion}
          />
        </div>
      </div>

      {/* ── Delete Modal ──────────────────────────────── */}
      <Modal
        title="Xác nhận xoá quiz"
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onOk={handleDelete}
        confirmLoading={deleting}
        okText="Xoá quiz"
        cancelText="Huỷ"
        okButtonProps={{ danger: true }}
        className="delete-modal"
        centered
      >
        <div style={{ padding: '12px 0' }}>
          <p style={{ fontSize: 15, color: '#333', margin: '0 0 8px' }}>
            Bạn có chắc muốn xoá quiz <strong>"{quiz.title}"</strong>?
          </p>
          <p style={{ fontSize: 14, color: '#e21b3c', margin: 0 }}>
            ⚠️ Tất cả câu hỏi bên trong cũng sẽ bị xoá. Không thể hoàn tác.
          </p>
        </div>
      </Modal>

      {/* ── Question Form Modal ───────────────────────── */}
      <QuestionFormModal 
        open={questionModalOpen}
        onCancel={() => setQuestionModalOpen(false)}
        onSave={handleSaveQuestion}
        initialData={editingQuestion}
        saving={questionSaving}
      />
    </div>
  );
};

export default HostQuizDetailPage;