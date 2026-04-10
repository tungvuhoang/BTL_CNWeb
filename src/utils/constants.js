export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  PLAYER_NAME: 'playerName',
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  HOST_QUIZZES: '/host/quizzes',
  HOST_QUIZ_DETAIL: '/host/quizzes/:quizId',
  HOST_ROOM: '/host/rooms/:roomId',
  PLAY: '/play',
  PLAY_ROOM: '/play/room/:roomId',
};

export const ROOM_STATUS = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  FINISHED: 'finished',
};

export const WS_TOPICS = {
  ROOM: (roomId) => `/topic/rooms/${roomId}`,
  PLAYERS: (roomId) => `/topic/rooms/${roomId}/players`,
  QUESTION: (roomId) => `/topic/rooms/${roomId}/question`,
  LEADERBOARD: (roomId) => `/topic/rooms/${roomId}/leaderboard`,
};

export const WS_EVENTS = {
  PLAYER_JOINED: 'PLAYER_JOINED',
  GAME_STARTED: 'GAME_STARTED',
  QUESTION_CHANGED: 'QUESTION_CHANGED',
  LEADERBOARD_UPDATED: 'LEADERBOARD_UPDATED',
  GAME_ENDED: 'GAME_ENDED',
};