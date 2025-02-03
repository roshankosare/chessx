import { useEffect } from "react";
import { useGameSocketIo } from "./useGameSocketIo";
import { useSocket } from "./useSocket";
import { useBoard } from "./useBoard";

export const useGame = () => {
  const { socket, getSocketValue } = useSocket();
  const getBoardStateValue = useBoard((state) => state.getBoardStateValue);
  const gameStarted = useBoard((state) => state.boardState.gameStarted);

  const {
    handleConnected,
    handleRoomJoind,
    handleWaiting,
    handleGameStarted,
    handleGamePos,
    handleRefreshGame,
    handleGameInfo,
    handlePosMoves,
    handleClockUpdate,
    handleGameOver,
    handleGameOverInfo,
  } = useGameSocketIo();

  useEffect(() => {
    if (!socket) return;
    socket.on("connected", handleConnected);
    socket.on("waiting", handleWaiting);
    socket.on("room-joined", handleRoomJoind);
    socket.on("game-started", handleGameStarted);
    socket.on("game-info", handleGameInfo);
    socket.on("game-pos", handleGamePos);
    socket.on("pos-moves", handlePosMoves);
    socket.on("refresh-game-status", handleRefreshGame);
    socket.on("clock-update", handleClockUpdate);
    socket.on("game-over", handleGameOver);
    socket.on("game-over-info", handleGameOverInfo);

    return () => {
      // deleteSocketConnection();
      // socket?.off();
      socket.off("connected");
      socket.off("waiting");
      socket.off("room-joined");
      socket.off("game-started");
      socket.off("game-info");
      socket.off("game-pos");
      socket.off("pos-moves");
      socket.off("refresh-game-status");
      socket.off("clock-update");
      socket.off("game-over");
      socket.off("game-over-info");
    };
  }, [
    socket,
    handleRoomJoind,
    handleWaiting,
    handleConnected,
    handleGameStarted,
    handleGamePos,
    handleGameInfo,
    handleRefreshGame,
    handlePosMoves,
    handleClockUpdate,
    handleGameOver,
    handleGameOverInfo,
  ]);

  useEffect(() => {
    const socket = getSocketValue();
    if (!socket) return;
    const playingId = getBoardStateValue("playingId");
    const roomId = getBoardStateValue("roomId");

    if (roomId && gameStarted) {
      socket.emit("get-game-pos", {
        roomId: roomId,
        playerId: playingId,
      });
    }
  }, [gameStarted, getBoardStateValue, getSocketValue]);
};
