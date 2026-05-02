import axiosClient from './axiosClient';

/** GET /api/quizzes/:quizId/questions — lấy danh sách câu hỏi của quiz */
export const getQuestionsByQuizId = (quizId) => axiosClient.get(`/quizzes/${quizId}/questions`);

/** POST /api/quizzes/:quizId/questions — thêm mới câu hỏi */
export const createQuestion = (quizId, data) => axiosClient.post(`/quizzes/${quizId}/questions`, data);

/** PUT /api/questions/:questionId — cập nhật câu hỏi */
export const updateQuestion = (questionId, data) => axiosClient.put(`/questions/${questionId}`, data);

/** DELETE /api/questions/:questionId — xoá câu hỏi */
export const deleteQuestion = (questionId) => axiosClient.delete(`/questions/${questionId}`);
