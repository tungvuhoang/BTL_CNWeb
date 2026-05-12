import { List, Button, Popconfirm, Tag, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, ClockCircleOutlined, TrophyOutlined } from '@ant-design/icons';

const QuestionList = ({ questions, loading, onEdit, onDelete }) => {
  if (!questions || questions.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Chưa có câu hỏi nào trong quiz này"
      />
    );
  }

  return (
    <List
      loading={loading}
      dataSource={questions}
      renderItem={(question, index) => (
        <List.Item
          className="question-card"
          actions={[
            <Button
              key="edit"
              icon={<EditOutlined />}
              onClick={() => onEdit(question)}
            >
              Sửa
            </Button>,
            <Popconfirm
              key="delete"
              title="Xoá câu hỏi này?"
              description="Bạn có chắc chắn muốn xoá câu hỏi này?"
              onConfirm={() => onDelete(question.questionId)}
              okText="Xoá"
              cancelText="Huỷ"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Xoá
              </Button>
            </Popconfirm>,
          ]}
        >
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong style={{ fontSize: '16px' }}>
                {index + 1}. {question.content}
              </strong>
              <div>
                <Tag icon={<ClockCircleOutlined />} color="blue">
                  {question.timeLimit || 20}s
                </Tag>
                <Tag icon={<TrophyOutlined />} color="gold">
                  {question.points || 1000} pts
                </Tag>
              </div>
            </div>
            
            <div className="question-answers-grid">
              {question.answers?.map((ans, i) => (
                <div
                  key={ans.answerId || i}
                  className={`question-answer-item ${ans.isCorrect ? 'correct' : ''}`}
                >
                  <span className="answer-shape">{['▲', '◆', '●', '■'][i % 4]}</span>
                  {ans.content}
                  {ans.isCorrect && <span className="correct-check">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </List.Item>
      )}
    />
  );
};

export default QuestionList;
