import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import {
  getQuestionsByQuizId,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../../api/questionApi';
import { createRoom } from '../../api/roomApi';
import { ROUTES } from '../../utils/constants';
import QuestionList from '../../components/host/QuestionList';
import QuestionFormModal from '../../components/host/QuestionFormModal';
import dayjs from 'dayjs';
import './HostQuizzes.css';


const HostQuizDetailPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const displayIndex = location.state?.displayIndex;

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const [hosting, setHosting] = useState(false);

  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionSaving, setQuestionSaving] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const normalizeQuiz = (data) => {
    if (!data) return null;

    return {
      ...data,
      quizId: data.quizId || data.id,
      questionCount: data.questionCount ?? data.questions?.length ?? 0,
    };
  };

  const normalizeQuestion = (q) => {
    if (!q) return q;

    const correctAnswer = q.correctAnswer;

    return {
      ...q,
      questionId: q.questionId || q.id,
      answers: q.answers || [
        {
          answerId: 'A',
          content: q.answerA,
          isCorrect: correctAnswer === 'A',
        },
        {
          answerId: 'B',
          content: q.answerB,
          isCorrect: correctAnswer === 'B',
        },
        {
          answerId: 'C',
          content: q.answerC,
          isCorrect: correctAnswer === 'C',
        },
        {
          answerId: 'D',
          content: q.answerD,
          isCorrect: correctAnswer === 'D',
        },
      ].filter((a) => a.content),
    };
  };

  const fetchQuestions = async () => {
    setQuestionsLoading(true);

    try {
      const res = await getQuestionsByQuizId(quizId);
      const list = res.data || res || [];

      setQuestions(list.map(normalizeQuestion));
    } catch (err) {
      console.log(err);
      message.error('Không thể tải danh sách câu hỏi');
      setQuestions([]);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const fetchQuiz = async () => {
    setLoading(true);

    try {
      const res = await getQuizById(quizId);
      const data = res.data || res;

      setQuiz(normalizeQuiz(data));
      await fetchQuestions();
    } catch (err) {
      console.log(err);
      message.error('Không thể tải quiz');
      setQuiz(null);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

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

      setQuiz((prev) => ({
        ...prev,
        title: editTitle.trim(),
      }));

      setEditing(false);
    } catch (err) {
      console.log(err);
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
    } catch (err) {
      console.log(err);
      message.error('Xoá quiz thất bại');
    } finally {
      setDeleting(false);
    }
  };

  const handleHostGame = async () => {
    setHosting(true);

    try {
      const res = await createRoom(Number(quizId));
      const data = res.data || res;

      const newRoomId = data.roomId || data.id;

      if (!newRoomId) {
        console.log('Create room response:', res);
        message.error('Không thể tạo phòng, thiếu roomId');
        return;
      }

      navigate(ROUTES.HOST_ROOM.replace(':roomId', newRoomId));
    } catch (err) {
      console.log(err);
      message.error('Tạo phòng thất bại');
    } finally {
      setHosting(false);
    }
  };

  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (question) => {
    setEditingQuestion(normalizeQuestion(question));
    setQuestionModalOpen(true);
  };

  const handleDeleteQuestion = async (questionOrId) => {
    const questionId =
      typeof questionOrId === 'object'
        ? questionOrId.questionId || questionOrId.id
        : questionOrId;

    if (!questionId) {
      message.error('Không tìm thấy questionId');
      console.log('Question missing id:', questionOrId);
      return;
    }

    try {
      await deleteQuestion(questionId);

      message.success('Đã xoá câu hỏi');

      setQuestions((prev) =>
        prev.filter((q) => (q.questionId || q.id) !== questionId)
      );

      setQuiz((prev) => ({
        ...prev,
        questionCount: Math.max((prev?.questionCount || 1) - 1, 0),
      }));
    } catch (err) {
      console.log(err);
      message.error('Xoá câu hỏi thất bại');
    }
  };

  const buildQuestionPayload = (questionData) => {
    const answers = questionData.answers || [];

    const correctIndex = answers.findIndex((a) => a.isCorrect);

    return {
      content: questionData.content,
      answerA: answers[0]?.content || '',
      answerB: answers[1]?.content || '',
      answerC: answers[2]?.content || '',
      answerD: answers[3]?.content || '',
      correctAnswer: ['A', 'B', 'C', 'D'][correctIndex] || '',
      timeLimit: Number(questionData.timeLimit || 20),
    };
  };

  const handleSaveQuestion = async (questionData) => {
    setQuestionSaving(true);

    try {
      const payload = buildQuestionPayload(questionData);

      if (!payload.content?.trim()) {
        message.warning('Nội dung câu hỏi không được để trống');
        return;
      }

      if (!payload.answerA || !payload.answerB || !payload.answerC || !payload.answerD) {
        message.warning('Cần nhập đủ 4 đáp án A, B, C, D');
        return;
      }

      if (!payload.correctAnswer) {
        message.warning('Cần chọn đáp án đúng');
        return;
      }

      if (editingQuestion) {
        const id = editingQuestion.questionId || editingQuestion.id;

        if (!id) {
          message.error('Không tìm thấy questionId để cập nhật');
          return;
        }

        await updateQuestion(id, payload);
        message.success('Cập nhật câu hỏi thành công');
      } else {
        await createQuestion(quizId, payload);
        message.success('Thêm câu hỏi thành công');

        setQuiz((prev) => ({
          ...prev,
          questionCount: (prev?.questionCount || 0) + 1,
        }));
      }

      setQuestionModalOpen(false);
      setEditingQuestion(null);
      await fetchQuestions();
    } catch (err) {
      console.log(err);
      message.error(err?.message || 'Lưu câu hỏi thất bại');
    } finally {
      setQuestionSaving(false);
    }
  };

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

  return (
    <div className="quiz-detail">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
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
          disabled={questions.length === 0}
          style={{ backgroundColor: '#26890c', fontWeight: 600 }}
        >
          🎮 HOST GAME
        </Button>
      </div>

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

        <div className="quiz-detail__stats">
          <div className="quiz-detail__stat">
            <span className="quiz-detail__stat-icon">
              <NumberOutlined />
            </span>
            <div className="quiz-detail__stat-info">
              <span className="quiz-detail__stat-label">Quiz ID</span>
              <span className="quiz-detail__stat-value">
                #{displayIndex || quiz.quizId}
              </span>
            </div>
          </div>

          <div className="quiz-detail__stat">
            <span className="quiz-detail__stat-icon">
              <QuestionCircleOutlined />
            </span>
            <div className="quiz-detail__stat-info">
              <span className="quiz-detail__stat-label">Câu hỏi</span>
              <span className="quiz-detail__stat-value">
                {questions.length}
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

          
        </div>
      </div>

      <div className="quiz-detail__info-card">
        <div
          className="quiz-detail__info-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 className="quiz-detail__info-title">📝 Danh sách câu hỏi</h3>

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

      <QuestionFormModal
        open={questionModalOpen}
        onCancel={() => {
          setQuestionModalOpen(false);
          setEditingQuestion(null);
        }}
        onSave={handleSaveQuestion}
        initialData={editingQuestion}
        saving={questionSaving}
      />
    </div>
  );
};

export default HostQuizDetailPage;