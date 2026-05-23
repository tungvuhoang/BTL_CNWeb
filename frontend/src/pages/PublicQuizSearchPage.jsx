import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, message, Empty, Spin, Tag } from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  CalendarOutlined,
  GlobalOutlined,
  EyeOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { searchPublicQuizzes } from '../api/quizApi';
import dayjs from 'dayjs';
import './host/HostQuizzes.css';

const PAGE_SIZE = 3;

const PublicQuizSearchPage = () => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPublicQuizzes = async (searchKeyword = '') => {
    setLoading(true);

    try {
      const res = await searchPublicQuizzes(searchKeyword);
      const data = res.data || res || [];

      setQuizzes(data);
      setCurrentPage(1);
    } catch (err) {
      console.log(err);
      message.error('Không thể tải quiz public');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicQuizzes('');
  }, []);

  const handleSearch = () => {
    fetchPublicQuizzes(keyword.trim());
  };

  const totalPages = Math.max(1, Math.ceil(quizzes.length / PAGE_SIZE));

  const paginatedQuizzes = quizzes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div
      className="host-quizzes"
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        paddingBottom: 40,
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <Button
          icon={<HomeOutlined />}
          onClick={() => navigate('/host/quizzes')}
        >
          Quay lại
        </Button>
      </div>

      <section className="host-quizzes__hero">
        <div className="host-quizzes__hero-content">
          <p className="host-quizzes__hero-kicker">Public Library</p>
          <h1>Quiz công khai</h1>
          <p>
            Khám phá các quiz public do người dùng khác chia sẻ và xem nội dung
            câu hỏi trước khi chơi.
          </p>
        </div>
      </section>

      <div className="quiz-detail__info-card">
        <div className="quiz-detail__info-header">
          <h3 className="quiz-detail__info-title">
            <GlobalOutlined />
            Danh sách quiz public
          </h3>

          <Tag color="green">{quizzes.length} quiz</Tag>
        </div>

        <div className="quiz-detail__info-body">
          <div
            style={{
              display: 'flex',
              gap: 12,
              marginBottom: 24,
              alignItems: 'center',
            }}
          >
            <Input
              placeholder="Tìm quiz theo tên..."
              prefix={<SearchOutlined style={{ color: '#999' }} />}
              value={keyword}
              allowClear
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              size="large"
            />

            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={handleSearch}
              style={{
                background: '#46178f',
                borderColor: '#46178f',
                fontWeight: 800,
                minWidth: 110,
              }}
            >
              Tìm kiếm
            </Button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
              <Spin size="large" />
            </div>
          ) : quizzes.length === 0 ? (
            <div className="quiz-empty">
              <Empty description="Không có quiz public phù hợp" />
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {paginatedQuizzes.map((quiz, index) => {
                  const quizId = quiz.quizId || quiz.id;
                  const displayIndex =
                    (currentPage - 1) * PAGE_SIZE + index + 1;

                  return (
                    <div
                      key={quizId}
                      onClick={() => navigate(`/public-quizzes/${quizId}`)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 18,
                        padding: '18px 20px',
                        border: '1px solid #eee',
                        borderRadius: 16,
                        background: '#fff',
                        cursor: 'pointer',
                        boxShadow: '0 6px 18px rgba(17, 12, 46, 0.06)',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 10,
                          }}
                        >
                          <Tag color="blue">Public #{displayIndex}</Tag>
                          <Tag color="green">🌍 Public</Tag>
                        </div>

                        <h3
                          style={{
                            margin: '0 0 10px',
                            color: '#2d0a5e',
                            fontSize: 20,
                            fontWeight: 900,
                          }}
                        >
                          {quiz.title}
                        </h3>

                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 16,
                            color: '#666',
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          <span>
                            <QuestionCircleOutlined /> {quiz.questionCount ?? 0} câu hỏi
                          </span>

                          <span>
                            <UserOutlined /> {quiz.authorName || 'Unknown'}
                          </span>

                          <span>
                            <CalendarOutlined />{' '}
                            {quiz.createdAt
                              ? dayjs(quiz.createdAt).format('DD/MM/YYYY')
                              : '—'}
                          </span>
                        </div>
                      </div>

                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/public-quizzes/${quizId}`);
                        }}
                        style={{
                          background: '#46178f',
                          borderColor: '#46178f',
                          fontWeight: 800,
                        }}
                      >
                        Xem quiz
                      </Button>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 12,
                    marginTop: 28,
                  }}
                >
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    ← Trước
                  </Button>

                  <div
                    style={{
                      background: '#efe8ff',
                      color: '#46178f',
                      padding: '8px 18px',
                      borderRadius: 999,
                      fontWeight: 800,
                    }}
                  >
                    Trang {currentPage} / {totalPages}
                  </div>

                  <Button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Sau →
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicQuizSearchPage;