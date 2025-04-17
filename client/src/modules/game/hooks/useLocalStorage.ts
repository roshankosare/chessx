import { BoardState } from "@/types";
import { useBoardStore } from "../stores/useBoardStore";
import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import { io } from "socket.io-client";
import { getServerUrl } from "@/lib/utils";

export const useLocalStorage = () => {
  const boardState = useBoardStore((state) => state.boardState);
  const setBoardStateValue = useBoardStore((state) => state.setBoardStateValue);
  const getBoardStateValue = useBoardStore((state) => state.getBoardStateValue);
  const resetBoardState = useBoardStore((state) => state.resetBoardState);
  const { setSocketValue, getSocketValue } = useSocket();
  const [localStateLoaded, setlocalStateLoaded] = useState<boolean>(false);

  const SOCKET_SERVER_URL = getServerUrl();
  useEffect(() => {
    // localStorage.removeItem("boardState");
    const result = localStorage.getItem("boardState");

    if (result) {
      const localState: BoardState = JSON.parse(result);
      if (localState.start) {
        return;
      }
      setBoardStateValue(localState);
    }
    setlocalStateLoaded(true);
  }, [setBoardStateValue]);

  useEffect(() => {
    if (localStateLoaded) {
      localStorage.setItem(
        "boardState",
        JSON.stringify({
          gameTime: boardState.gameTime,
          start: boardState.start,
          waiting: boardState.waiting,
          gameStarted: boardState.gameStarted,
          playingId: boardState.playingId,
          roomId: boardState.roomId,
          boardPos: null,
          playingAS: boardState.playingAS,
          selectedPiece: null,
          playersInfo: {
            user: {
              username: boardState.playersInfo.user.username,
              remainingTime: 0,
              avatar: null,
            },
            opponent: {
              username: boardState.playersInfo.opponent.username,
              remainingTime: 0,
              avatar: null,
            },
          },
          move: { from: null, to: null },
          gameStatus: boardState.gameStatus,
          wonBy: null,
          possibleMoves: [],
          whiteCapturedPieces: [],
          blackCapturedPieces: [],
          moveHistory: [],
          promotionalMoves: [],
          promotionPiece: null,
          showPomotionWindow: false,
          matchType: boardState.matchType,
          diLevel: boardState.diLevel,
          lastMove: { from: null, to: null },
        } as BoardState)
      );
    }
    // console.log(JSON.parse(localStorage.getItem("boardState") || "0"));
  }, [
    localStateLoaded,
    boardState.gameStatus,
    boardState.start,
    boardState.gameStarted,
    boardState.matchType,
    boardState.playingAS,
    boardState.diLevel,
    boardState.lastMove,
    boardState.waiting,
    boardState.gameTime,
    boardState.playingId,
    boardState.roomId,
    boardState.playersInfo.user.username,
    boardState.playersInfo.opponent.username,
  ]);

  useEffect(() => {
    const socket = getSocketValue();
    console.log(socket);

    if (!socket) {
      if (
        boardState.playingId &&
        (boardState.gameStatus === "running" ||
          (boardState.gameStatus === "ready" && boardState.roomId))
      ) {
        const playingAS = getBoardStateValue("playingAS");
        setBoardStateValue({ playingAS: null });
        const socketId = boardState.playingId;
        const roomId = boardState.roomId;
        const newSocket = io(SOCKET_SERVER_URL, {
          auth: { socketId: socketId, roomId: roomId }, // Send the stored socketId
          reconnection: true, // Enable auto-reconnection
        });
        console.log(newSocket);
        newSocket.on("game-not-found", () => {
          newSocket.disconnect();
          newSocket.close();
          localStorage.removeItem("boardState");
          resetBoardState();
        });
        newSocket.on("reconnection", (data: { socketId: string }) => {
          setBoardStateValue({
            playingId: data.socketId,
          });
          setSocketValue(newSocket);
          // setFetchLocalStorage(true);
          setBoardStateValue({ playingAS: playingAS });
          newSocket.emit("get-game-pos", {
            roomId: roomId,
            playerId: boardState.playingId,
          });
        });
      }
    }
  }, [
    getBoardStateValue,
    resetBoardState,
    setBoardStateValue,
    boardState.roomId,
    boardState.playingId,
    boardState.gameStatus,
    setSocketValue,
    SOCKET_SERVER_URL,
    getSocketValue,
  ]);
};
