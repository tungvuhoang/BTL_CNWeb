import axiosClient from "./axiosClient";

export const playerApi = {
  joinRoom: (data) => {
    return axiosClient.post("/game-rooms/join", data);
  },

  getRoomState: (roomId) => {
    return axiosClient.get(`/game-rooms/${roomId}`);
  },

  getCurrentQuestion: (roomId) => {
    return axiosClient.get(`/game-rooms/${roomId}/current-question`);
  },

  submitAnswer: (roomId, data) => {
    return axiosClient.post(`/game-rooms/${roomId}/submit-answer`, data);
  },

  getLeaderboard: (roomId) => {
    return axiosClient.get(`/game-rooms/${roomId}/leaderboard`);
  },

  getPlayerAnswers: (roomId, playerId) => {
    return axiosClient.get(`/game-rooms/${roomId}/players/${playerId}/answers`);
  },
};