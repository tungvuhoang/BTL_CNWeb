import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

const WS_BASE_URL =
  import.meta.env.VITE_WS_BASE_URL || "http://localhost:8080/ws";

export const createPlayerSocket = ({
  roomId,
  onRoomUpdate,
  onQuestionUpdate,
  onLeaderboardUpdate,
  onPlayerJoined,
  onConnect,
  onDisconnect,
  onError,
}) => {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_BASE_URL),
    reconnectDelay: 3000,

    onConnect: () => {
      console.log("WebSocket connected:", WS_BASE_URL);

      onConnect?.();

      client.subscribe(`/topic/rooms/${roomId}`, (message) => {
        console.log("ROOM MESSAGE:", message.body);
        const event = JSON.parse(message.body);
        onRoomUpdate?.(event);
      });

      client.subscribe(`/topic/rooms/${roomId}/question`, (message) => {
        console.log("QUESTION MESSAGE:", message.body);
        const event = JSON.parse(message.body);
        onQuestionUpdate?.(event);
      });

      client.subscribe(`/topic/rooms/${roomId}/leaderboard`, (message) => {
        console.log("LEADERBOARD MESSAGE:", message.body);
        const event = JSON.parse(message.body);
        onLeaderboardUpdate?.(event);
      });

      client.subscribe(`/topic/rooms/${roomId}/players`, (message) => {
        console.log("PLAYER MESSAGE:", message.body);
        const event = JSON.parse(message.body);
        onPlayerJoined?.(event);
      });
    },

    onDisconnect: () => {
      console.log("❌ WebSocket disconnected");
      onDisconnect?.();
    },

    onStompError: (frame) => {
      console.error("WebSocket STOMP error:", frame);
      onError?.(frame);
    },

    onWebSocketError: (error) => {
      console.error("WebSocket connection error:", error);
      onError?.(error);
    },
  });

  client.activate();
  return client;
};