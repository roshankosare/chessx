import { useCallback } from "react";
import { useSocket } from "./useSocket";
import { useBoardStore } from "../stores/useBoardStore";

export const useGameIo = () => {
  const { createSocketConnection, getSocketValue } = useSocket();
  const getBoardStateValue = useBoardStore((state) => state.getBoardStateValue);

  const startNewGame = useCallback(() => {
    createSocketConnection();
  }, [createSocketConnection]);

  const resignGame = useCallback(() => {
    const socket = getSocketValue();
    if (!socket) return;

    const roomId = getBoardStateValue("roomId");
    const playingId = getBoardStateValue("playingId");
    socket.emit("resign-game", {
      roomId: roomId,
      playerId: playingId,
    });
  }, [getSocketValue, getBoardStateValue]);

  return {
    startNewGame,
    resignGame,
  };
};
