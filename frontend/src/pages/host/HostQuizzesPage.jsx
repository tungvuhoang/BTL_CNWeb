import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Modal, message, Tooltip } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { getMyQuizzes, createQuiz, deleteQuiz } from '../../api/quizApi';
import { ROUTES } from '../../utils/constants';
import dayjs from 'dayjs';
import './HostQuizzes.css';

/* ── banner color rotation ───────────────────────────── */
const BANNER_COLORS = ['purple', 'blue', 'red', 'green', 'orange'];
const getBannerColor = (index) => BANNER_COLORS[index % BANNER_COLORS.length];

/* ── loading skeleton ────────────────────────────────── */
const SkeletonGrid = () => (
  <div className="quiz-grid--loading">
    {Array.from({ length: 6 }).map((_, i) => (
      <div className="quiz-skeleton" key={i}>
        <div className="quiz-skeleton__banner" />
        <div className="quiz-skeleton__body">
          <div className="quiz-skeleton__line" />
          <div className="quiz-skeleton__line" />
          <div className="quiz-skeleton__line" />
        </div>
      </div>
    ))}
  </div>
);

const HostQuizzesPage = () => {
  const navigate = useNavigate();

  /* ── state ─────────────────────────────────────────── */
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [creating, setCreating] = useState(false);

  // delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ── fetch ─────────────────────────────────────────── */
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await getMyQuizzes();
      setQuizzes(res.data ?? []);
    } catch {
      message.info('BE chưa chạy, hiển thị dữ liệu mẫu (mock data)');
      setQuizzes([
        {
          quizId: 1,
          title: 'Quiz Toán Học Lớp 10',
          questionCount: 5,
          createdAt: new Date().toISOString()
        },
        {
          quizId: 2,
          title: 'Quiz Vật Lý - Động Lực Học',
          questionCount: 12,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  /* ── handlers ──────────────────────────────────────── */
  const handleCreate = async () => {
    if (!createTitle.trim()) {
      message.warning('Vui lòng nhập tiêu đề quiz');
      return;
    }
    setCreating(true);
    try {
      const res = await createQuiz({ title: createTitle.trim() });
      message.success('Tạo quiz thành công!');
      setCreateOpen(false);
      setCreateTitle('');
      const newId = res.data?.quizId ?? res.data?.id;
      if (newId) {
        navigate(ROUTES.HOST_QUIZ_DETAIL.replace(':quizId', newId));
      } else {
        fetchQuizzes();
      }
    } catch {
      message.error('Tạo quiz thất bại');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteQuiz(deleteTarget.quizId);
      message.success('Đã xoá quiz');
      setDeleteTarget(null);
      fetchQuizzes();
    } catch {
      message.error('Xoá quiz thất bại');
    } finally {
      setDeleting(false);
    }
  };

  const goToDetail = (quizId) => {
    navigate(ROUTES.HOST_QUIZ_DETAIL.replace(':quizId', quizId));
  };

  /* ── filtered data ─────────────────────────────────── */
  const filtered = quizzes.filter((q) =>
    q.title?.toLowerCase().includes(searchText.toLowerCase()),
  );

  /* ── render ────────────────────────────────────────── */
  return (
    <div className="host-quizzes">
      <section className="host-quizzes__hero">
        <div className="host-quizzes__hero-content">
          <p className="host-quizzes__hero-kicker">Host Dashboard</p>
          <h1>Quiz của tôi</h1>
          <p>
            Tạo bộ câu hỏi nhanh, chỉnh sửa linh hoạt và bắt đầu phòng chơi
            trong vài giây.
          </p>
        </div>
      </section>

      <div className="host-quizzes__toolbar">
        <div className="host-quizzes__search">
          <Input
            placeholder="Tìm kiếm quiz…"
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
          />
        </div>
        {!loading && (
          <span className="host-quizzes__count">
            {filtered.length} / {quizzes.length} quiz
          </span>
        )}
        <button className="btn-create-quiz host-quizzes__toolbar-create" onClick={() => setCreateOpen(true)}>
          <PlusOutlined />
          Tạo Quiz mới
        </button>
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <div className="quiz-empty">
          <span className="quiz-empty__icon">📝</span>
          <h3>
            {searchText ? 'Không tìm thấy quiz' : 'Chưa có quiz nào'}
          </h3>
          <p>
            {searchText
              ? 'Thử tìm kiếm với từ khoá khác'
              : 'Bắt đầu tạo quiz đầu tiên của bạn!'}
          </p>
          {!searchText && (
            <button
              className="btn-create-quiz"
              onClick={() => setCreateOpen(true)}
            >
              <PlusOutlined />
              Tạo Quiz đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="quiz-grid">
          {filtered.map((quiz, index) => (
            <div
              className="quiz-card"
              key={quiz.quizId}
              onClick={() => goToDetail(quiz.quizId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') goToDetail(quiz.quizId);
              }}
            >
              <div className={`quiz-card__cover quiz-card__cover--${getBannerColor(index)}`}>
                <span className="quiz-card__id">Quiz #{quiz.quizId}</span>
              </div>
              <div className="quiz-card__body">
                <h3 className="quiz-card__title">{quiz.title}</h3>
                <div className="quiz-card__meta">
                  <span className="quiz-card__meta-item quiz-card__meta-item--questions">
                    <QuestionCircleOutlined />
                    {quiz.questionCount ?? 0} câu hỏi
                  </span>
                  <span className="quiz-card__meta-item">
                    <CalendarOutlined />
                    {quiz.createdAt
                      ? dayjs(quiz.createdAt).format('DD/MM/YYYY')
                      : '—'}
                  </span>
                </div>
              </div>
              <div className="quiz-card__footer">
                <div
                  className="quiz-card__actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Tooltip title="Chỉnh sửa">
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => goToDetail(quiz.quizId)}
                    />
                  </Tooltip>
                  <Tooltip title="Xoá">
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => setDeleteTarget(quiz)}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Quiz Modal ─────────────────────────── */}
      <Modal
        title="Tạo Quiz mới"
        open={createOpen}
        onCancel={() => {
          setCreateOpen(false);
          setCreateTitle('');
        }}
        onOk={handleCreate}
        confirmLoading={creating}
        okText="Tạo quiz"
        cancelText="Huỷ"
        className="create-quiz-modal"
        centered
      >
        <div className="create-quiz-modal__body">
          <label className="create-quiz-modal__label">Tiêu đề quiz</label>
          <Input
            placeholder="Ví dụ: Kiểm tra Toán học lớp 10"
            value={createTitle}
            onChange={(e) => setCreateTitle(e.target.value)}
            onPressEnter={handleCreate}
            size="large"
            className="create-quiz-modal__input"
            autoFocus
          />
          <p className="create-quiz-modal__hint">Bạn có thể thay đổi tiêu đề sau</p>
        </div>
      </Modal>

      {/* ── Delete Confirm Modal ──────────────────────── */}
      <Modal
        title="Xác nhận xoá quiz"
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={handleDelete}
        confirmLoading={deleting}
        okText="Xoá quiz"
        cancelText="Huỷ"
        okButtonProps={{ danger: true }}
        className="delete-modal"
        centered
      >
        <div className="delete-modal__body">
          <p className="delete-modal__title">
            Bạn có chắc muốn xoá quiz{' '}
            <strong>"{deleteTarget?.title}"</strong>?
          </p>
          <p className="delete-modal__warning">Hành động này không thể hoàn tác.</p>
        </div>
      </Modal>
    </div>
  );
};

export default HostQuizzesPage;