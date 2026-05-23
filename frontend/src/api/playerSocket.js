import SockJS from 'sockjs-client/dist/sockjs';
import { Client } from '@stomp/stompjs';

export const createPlayerSocket = ({
  roomId,
  onRoomUpdate,
  onQuestionUpdate,
  onLeaderboardUpdate,
  onPlayerJoined,
}) => {
  const client = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    reconnectDelay: 3000,

    onConnect: () => {
      client.subscribe(`/topic/rooms/${roomId}`, (message) => {
        const event = JSON.parse(message.body);
        onRoomUpdate?.(event);
      });

      client.subscribe(`/topic/rooms/${roomId}/question`, (message) => {
        const event = JSON.parse(message.body);
        onQuestionUpdate?.(event);
      });

      client.subscribe(`/topic/rooms/${roomId}/leaderboard`, (message) => {
        const event = JSON.parse(message.body);
        onLeaderboardUpdate?.(event);
      });

      client.subscribe(`/topic/rooms/${roomId}/players`, (message) => {
        const event = JSON.parse(message.body);
        onPlayerJoined?.(event);
      });
    },

    onStompError: (frame) => {
      console.error('WebSocket error:', frame);
    },
  });

  client.activate();
  return client;
};