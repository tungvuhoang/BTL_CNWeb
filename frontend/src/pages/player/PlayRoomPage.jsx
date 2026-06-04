import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { playerApi } from "../../api/playerApi";
import { playerStorage } from "../../utils/playerStorage";
import PlayerGameScreen from "./PlayerGameScreen";
import GameEndedScreen from "./GameEndedScreen";
import { createPlayerSocket } from "../../api/playerSocket";

const normalizeStatus = (status) => {
  if (!status) return "waiting";

  const normalized = String(status).toLowerCase();

  if (
    normalized === "playing" ||
    normalized === "started" ||
    normalized === "in_progress" ||
    normalized === "in-progress" ||
    normalized === "active"
  ) {
    return "playing";
  }

  if (
    normalized === "finished" ||
    normalized === "ended" ||
    normalized === "completed"
  ) {
    return "finished";
  }

  return "waiting";
};

const PlayRoomPage = () => {
  const { roomId } = useParams();

  const [liveLeaderboard, setLiveLeaderboard] = useState(null);
  const [player, setPlayer] = useState(null);
  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");
  const [questionVersion, setQuestionVersion] = useState(0);

  const fetchRoomState = useCallback(async () => {
    try {
      const res = await playerApi.getRoomState(roomId);
      const data = res.data || res;

      setRoom(data);
      setError("");

      return data;
    } catch (err) {
      console.error("Cannot load room information:", err);
      setError("Cannot load room information");
      return null;
    }
  }, [roomId]);

  useEffect(() => {
    const savedPlayer = playerStorage.get();

    if (!savedPlayer) {
      setError("Player session not found");
      return;
    }

    setPlayer(savedPlayer);

    fetchRoomState();

    const socket = createPlayerSocket({
      roomId,

      onConnect: async () => {
        console.log("Player socket connected");
        await fetchRoomState();
      },

      onRoomUpdate: async (event) => {
        console.log("ROOM UPDATE:", event);

        if (event?.type === "GAME_STARTED") {
          setRoom((prev) => ({
            ...prev,
            status: "PLAYING",
          }));

          setQuestionVersion((v) => v + 1);
        }

        if (event?.type === "GAME_ENDED") {
          setRoom((prev) => ({
            ...prev,
            status: "FINISHED",
          }));
        }

        await fetchRoomState();
      },

      onQuestionUpdate: async (event) => {
        console.log("QUESTION UPDATE:", event);

        setRoom((prev) => ({
          ...prev,
          status: "PLAYING",
        }));

        setQuestionVersion((v) => v + 1);

        await fetchRoomState();
      },

      onPlayerJoined: async (event) => {
        console.log("PLAYER JOINED:", event);
        await fetchRoomState();
      },

      onLeaderboardUpdate: (event) => {
        console.log("LEADERBOARD UPDATE:", event);
        setLiveLeaderboard(event?.payload || []);
      },

      onError: (error) => {
        console.error("Player socket error:", error);
      },
    });

    return () => {
      socket?.deactivate?.();
    };
  }, [roomId, fetchRoomState]);

  // Fallback: nếu WebSocket không nhận event thì vẫn tự cập nhật trạng thái phòng
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const latestRoom = await fetchRoomState();

      if (!latestRoom) return;

      const latestStatus = normalizeStatus(latestRoom.status);

      if (latestStatus === "playing") {
        setQuestionVersion((v) => v + 1);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [fetchRoomState]);

  const roomStatus = normalizeStatus(room?.status);

  if (error) {
    return (
      <div style={{ color: "white", textAlign: "center" }}>
        <h1 style={{ color: "#fff" }}>Room {roomId}</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (roomStatus === "finished") {
    return <GameEndedScreen roomId={roomId} />;
  }

  if (roomStatus === "playing") {
    return (
      <PlayerGameScreen
        roomId={roomId}
        liveLeaderboard={liveLeaderboard}
        questionVersion={questionVersion}
      />
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 520,
        color: "white",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 40, marginBottom: 8, color: "#fff" }}>
        Room {roomId}
      </h1>

      <p style={{ fontSize: 20, marginBottom: 24 }}>
        Welcome, <b>{player?.name || player?.playerName || "Player"}</b>
      </p>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.16)",
          borderRadius: 18,
          padding: 24,
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.25)",
        }}
      >
        {room ? (
          <>
            <p style={{ fontSize: 18 }}>
              Status: <b>{room.status || "waiting"}</b>
            </p>

            <p>
              Players: <b>{room.playerCount ?? 0}</b>
            </p>

            <p>
              Total questions: <b>{room.totalQuestions ?? 0}</b>
            </p>

            <p style={{ marginTop: 24, fontSize: 20, fontWeight: 700 }}>
              Waiting for host to start the game...
            </p>

            <p style={{ marginTop: 8, opacity: 0.8 }}>
              This page updates automatically.
            </p>
          </>
        ) : (
          <p>Loading room...</p>
        )}
      </div>
    </div>
  );
};

export default PlayRoomPage;