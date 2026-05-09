import axiosClient from './axiosClient';

/** POST /api/game-rooms — tạo phòng chơi mới từ quizId */
export const createRoom = (quizId) =>
  axiosClient.post('/game-rooms', { quizId });

/** GET /api/game-rooms/:roomId — lấy thông tin phòng chơi */
export const getRoomById = (roomId) =>
  axiosClient.get(`/game-rooms/${roomId}`);

/** POST /api/game-rooms/:roomId/start — bắt đầu game */
export const startGame = (roomId) =>
  axiosClient.post(`/game-rooms/${roomId}/start`);

/** POST /api/game-rooms/:roomId/next — sang câu tiếp theo */
export const nextQuestion = (roomId) =>
  axiosClient.post(`/game-rooms/${roomId}/next`);

/** POST /api/game-rooms/:roomId/end — kết thúc game */
export const endGame = (roomId) =>
  axiosClient.post(`/game-rooms/${roomId}/end`);

/** GET /api/game-rooms/:roomId/current-question */
export const getCurrentQuestion = (roomId) =>
  axiosClient.get(`/game-rooms/${roomId}/current-question`);

/** GET /api/game-rooms/:roomId/leaderboard */
export const getLeaderboard = (roomId) =>
  axiosClient.get(`/game-rooms/${roomId}/leaderboard`);

/** GET /api/game-rooms/:roomId/players */
export const getPlayersInRoom = (roomId) =>
  axiosClient.get(`/game-rooms/${roomId}/players`);

/** POST /api/game-rooms/join */
export const joinRoom = (data) =>
  axiosClient.post('/game-rooms/join', data);

/** POST /api/game-rooms/:roomId/submit-answer */
export const submitAnswer = (roomId, data) =>
  axiosClient.post(`/game-rooms/${roomId}/submit-answer`, data);

export const updateRoomStatus = (roomId, status) => {
  if (status === 'PLAYING') {
    return startGame(roomId);
  }

  if (status === 'ENDED') {
    return endGame(roomId);
  }

  return getRoomById(roomId);
};