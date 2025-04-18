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
    const time = JSON.parse(localStorage.getItem("time") || "0");
    const timeDiff =
      Math.floor(Date.now() / 1000) -
      (time.time || Math.floor(Date.now() / 1000) + 5000);

    if (result && timeDiff < 1500) {
      const localState: BoardState = JSON.parse(result);
      setBoardStateValue({
        gameTime: localState.gameTime,
        start: localState.start,
        waiting: localState.waiting,
        gameStarted: localState.gameStarted,
        playingId: localState.playingId,
        matchType: localState.matchType,
        roomId: localState.roomId,
        diLevel: localState.diLevel,
        gameStatus: localState.gameStatus,
      });
    }
    setlocalStateLoaded(true);
  }, [setBoardStateValue]);

  useEffect(() => {
    if (localStateLoaded) {
      localStorage.setItem(
        "time",
        JSON.stringify({
          time: Math.floor(Date.now() / 1000),
        })
      );
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
