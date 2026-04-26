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
import { ROUTES } from '../../utils/constants';
import dayjs from 'dayjs';
import './HostQuizzes.css';

const HostQuizDetailPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  /* ── state ─────────────────────────────────────────── */
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  // inline edit
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [saving, setSaving] = useState(false);

  // delete modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ── fetch ─────────────────────────────────────────── */
  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await getQuizById(quizId);
      setQuiz(res.data);
    } catch {
      message.error('Không thể tải thông tin quiz');
    } finally {
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
      {/* Back */}
      <button
        className="quiz-detail__back"
        onClick={() => navigate(ROUTES.HOST_QUIZZES)}
      >
        <ArrowLeftOutlined />
        Quay lại danh sách
      </button>

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
        <div className="quiz-detail__info-header">
          <h3 className="quiz-detail__info-title">
            📝 Danh sách câu hỏi
          </h3>
        </div>
        <div className="quiz-detail__info-body">
          <p>Phần quản lý câu hỏi sẽ được build tiếp ở giai đoạn sau.</p>
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
    </div>
  );
};

export default HostQuizDetailPage;