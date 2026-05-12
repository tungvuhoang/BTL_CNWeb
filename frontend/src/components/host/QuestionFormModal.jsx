import { Modal, Form, Input, InputNumber, Radio, Row, Col, Space } from 'antd';
import { useEffect } from 'react';

const QuestionFormModal = ({ open, onCancel, onSave, initialData, saving }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Find which answer is correct
        let correctIndex = 0;
        if (initialData.answers) {
          const idx = initialData.answers.findIndex(a => a.isCorrect);
          if (idx >= 0) correctIndex = idx;
        }

        form.setFieldsValue({
          content: initialData.content,
          timeLimit: initialData.timeLimit || 20,
          points: initialData.points || 1000,
          answers: initialData.answers?.map(a => a.content) || ['', '', '', ''],
          correctAnswer: correctIndex
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          timeLimit: 20,
          points: 1000,
          answers: ['', '', '', ''],
          correctAnswer: 0
        });
      }
    }
  }, [open, initialData, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      const formattedData = {
        content: values.content,
        timeLimit: values.timeLimit,
        points: values.points,
        answers: values.answers.map((content, index) => ({
          content,
          isCorrect: index === values.correctAnswer
        }))
      };

      onSave(formattedData);
    } catch (err) {
      // validation failed
    }
  };

  return (
    <Modal
      title={initialData ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={saving}
      okText="Lưu"
      cancelText="Huỷ"
      width={700}
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="content"
          label="Nội dung câu hỏi"
          rules={[{ required: true, message: 'Vui lòng nhập câu hỏi' }]}
        >
          <Input.TextArea rows={3} placeholder="Ví dụ: Thủ đô của Việt Nam là gì?" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="timeLimit" label="Thời gian (giây)" rules={[{ required: true }]}>
              <InputNumber min={5} max={240} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="points" label="Điểm số" rules={[{ required: true }]}>
              <InputNumber min={0} step={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ marginTop: 16, marginBottom: 8, fontWeight: 500 }}>
          Các đáp án (Chọn 1 đáp án đúng):
        </div>
        
        <Form.Item name="correctAnswer" rules={[{ required: true }]}>
          <Radio.Group style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              {[0, 1, 2, 3].map((index) => {
                const colors = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];
                const shapes = ['▲', '◆', '●', '■'];
                return (
                  <Col span={12} key={index}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <Radio value={index} style={{ marginTop: '8px' }} />
                      <Form.Item
                        name={['answers', index]}
                        rules={[{ required: true, message: 'Nhập đáp án' }]}
                        style={{ margin: 0, flex: 1 }}
                      >
                        <Input 
                          prefix={<span style={{ color: colors[index], marginRight: 4 }}>{shapes[index]}</span>}
                          placeholder={`Đáp án ${index + 1}`} 
                        />
                      </Form.Item>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuestionFormModal;
