import axiosClient from './axiosClient';

/** POST /api/rooms — tạo phòng chơi mới từ quizId */
export const createRoom = (quizId) => axiosClient.post('/rooms', { quizId });

/** GET /api/rooms/:roomId — lấy thông tin phòng chơi */
export const getRoomById = (roomId) => axiosClient.get(`/rooms/${roomId}`);

/** PUT /api/rooms/:roomId/status — cập nhật trạng thái phòng (ví dụ: WAITING -> PLAYING) */
export const updateRoomStatus = (roomId, status) => axiosClient.put(`/rooms/${roomId}/status`, { status });
