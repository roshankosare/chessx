import { BoardState } from "@/types";
import { useBoardStore } from "../stores/useBoardStore";
import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";

export const useLocalStorage = () => {
  const setBoardStateValue = useBoardStore((state) => state.setBoardStateValue);
  const getBoardStateValue = useBoardStore((state) => state.getBoardStateValue);
  const [localStateLoaded, setlocalStateLoaded] = useState<boolean>(false);
  const getSocketValue = useSocket((state) => state.getSocketValue);
  const reconnect = useSocket((state) => state.reconnect);

  const gameTime = useBoardStore((state) => state.boardState.gameTime);
  const start = useBoardStore((state) => state.boardState.start);
  const waiting = useBoardStore((state) => state.boardState.waiting);
  const gameStarted = useBoardStore((state) => state.boardState.gameStarted);
  const playingId = useBoardStore((state) => state.boardState.playingId);
  const matchType = useBoardStore((state) => state.boardState.matchType);
  const roomId = useBoardStore((state) => state.boardState.roomId);
  const diLevel = useBoardStore((state) => state.boardState.diLevel);
  const gameStatus = useBoardStore((state) => state.boardState.gameStatus);
  useEffect(() => {
    // localStorage.removeItem("boardState");
    const result = localStorage.getItem("boardState");

    if (result) {
      const localState: BoardState = JSON.parse(result);
      setBoardStateValue(localState);
    }
    setlocalStateLoaded(true);
  }, [setBoardStateValue]);

  useEffect(() => {
    if (localStateLoaded) {
      console.log("local state updated");
      localStorage.setItem(
        "boardState",
        JSON.stringify({
          gameTime: gameTime,
          start: start,
          waiting: waiting,
          gameStarted: gameStarted,
          playingId: playingId,
          matchType: matchType,
          roomId: roomId,
          diLevel: diLevel,
          gameStatus: gameStatus,
        } as BoardState)
      );
    }
  }, [
    localStateLoaded,
    gameStatus,
    start,
    gameStarted,
    matchType,
    diLevel,
    waiting,
    gameTime,
    playingId,
    roomId,
  ]);

  useEffect(() => {
    const socket = getSocketValue();
    if (!socket && localStateLoaded) {
      const roomId = getBoardStateValue("roomId");
      const playingId = getBoardStateValue("playingId");
      if (roomId && playingId) {
        if (playingId && roomId) reconnect(playingId, roomId);
      }
    }
  }, [getSocketValue, getBoardStateValue, reconnect, localStateLoaded]);
};
