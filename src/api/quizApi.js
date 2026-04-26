import axiosClient from './axiosClient';

/** GET /api/quizzes/my — lấy danh sách quiz của host */
export const getMyQuizzes = () => axiosClient.get('/quizzes/my');

/** POST /api/quizzes — tạo quiz mới */
export const createQuiz = (data) => axiosClient.post('/quizzes', data);

/** GET /api/quizzes/:id — chi tiết quiz */
export const getQuizById = (id) => axiosClient.get(`/quizzes/${id}`);

/** PUT /api/quizzes/:id — cập nhật quiz (title, …) */
export const updateQuiz = (id, data) => axiosClient.put(`/quizzes/${id}`, data);

/** DELETE /api/quizzes/:id — xoá quiz */
export const deleteQuiz = (id) => axiosClient.delete(`/quizzes/${id}`);
