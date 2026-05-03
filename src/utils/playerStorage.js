const PLAYER_ROOM_ID = "playerRoomId";
const PLAYER_ID = "playerId";
const PLAYER_NAME = "playerName";

export const playerStorage = {
  save({ roomId, playerId, name }) {
    localStorage.setItem(PLAYER_ROOM_ID, roomId);
    localStorage.setItem(PLAYER_ID, playerId);
    localStorage.setItem(PLAYER_NAME, name);
  },

  get() {
    return {
      roomId: localStorage.getItem(PLAYER_ROOM_ID),
      playerId: localStorage.getItem(PLAYER_ID),
      playerName: localStorage.getItem(PLAYER_NAME),
    };
  },

  clear() {
    localStorage.removeItem(PLAYER_ROOM_ID);
    localStorage.removeItem(PLAYER_ID);
    localStorage.removeItem(PLAYER_NAME);
  },
};