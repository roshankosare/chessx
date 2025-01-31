import { BoardPos, BoardPosElement, PieceColor, PieceType } from "@/types";
import { useSocket } from "./useSocket";
import { useBoard } from "./useBoard";
import { useTiles } from "./useTiles";
import { useCallback, useEffect } from "react";
import { hasKeyOfType } from "@/lib/utils";

const getBoardPosition = (
  gameState: Array<
    Array<{ square: string; type: PieceType; color: PieceColor }>
  >
): BoardPos | null => {
  const pos: Array<BoardPosElement | null> = [];

  gameState.forEach((r) => {
    r.forEach((c) => {
      if (c) {
        pos.push({
          square: c.square,
          piece: c ? { color: c.color == "b" ? "b" : "w", type: c.type } : null,
        });
      } else {
        pos.push(null);
      }
    });
  });
  if (pos.length == 64) {
    return pos as BoardPos;
  }

  return null;
};

export const useGameIo = () => {
  const { socket, createSocketConnection, deleteSocketConnection } =
    useSocket();

  const setBoardState = useBoard((state) => state.setBoardState);
  const setBoardStateValue = useBoard((state) => state.setBoardStateValue);
  const getBoardStateValue = useBoard((state) => state.getBoardStateValue);
  const roomId = useBoard((state) => state.boardState.roomId);
  const gameStarted = useBoard((state) => state.boardState.gameStarted);

  const { setPossibleMoves } = useTiles();

  const startNewGame = () => {
    createSocketConnection();
  };

  const endGame = () => {
    deleteSocketConnection();
  };

  const handleConnected = useCallback(
    (data: { socket: string }) => {
      const gameTime = getBoardStateValue("gameTime");
      if (hasKeyOfType<{ socketId: string }>(data, "socketId", "string")) {
        setBoardState("playingId", data.socketId);
        socket?.emit("join-room", {
          id: data.socketId,
          time: gameTime,
        });
      }
    },
    [socket, setBoardState, getBoardStateValue]
  );

  const handleWaiting = useCallback(
    (data: { roomId: string }) => {
      if (hasKeyOfType<{ roomId: string }>(data, "roomId", "string"))
        setBoardStateValue({
          roomId: data.roomId,
          waiting: true,
          gameStarted: false,
        });
    },
    [setBoardStateValue]
  );

  const handleRoomJoind = useCallback(
    (data: { roomId: string }) => {
      if (hasKeyOfType<{ roomId: string }>(data, "roomId", "string")) {
        setBoardStateValue({
          roomId: data.roomId,
          waiting: true,
          gameStarted: false,
        });
        return;
      }

      setBoardStateValue({
        waiting: true,
        gameStarted: false,
      });
    },
    [setBoardStateValue]
  );

  const handleGameStarted = useCallback(() => {
    const playingAs = getBoardStateValue("playingAS");
    const roomId = getBoardStateValue("roomId");
    const playingId = getBoardStateValue("playingId");
    setBoardStateValue({
      waiting: false,
      gameStarted: true,
    });
    if (!playingAs)
      socket?.emit("get-game-info", {
        roomId: roomId,
        playerId: playingId,
      });
  }, [getBoardStateValue, socket, setBoardStateValue]);

  const handleGameInfo = useCallback(
    (data: {
      user: { username: string; remainingTime: number };
      oponent: { username: string; remainingTime: number };
      playingAs: string;
    }) => {
      setBoardStateValue({
        playersInfo: {
          user: {
            username: "me",
            remainingTime: data.user.remainingTime,
            avatar: "",
          },
          opponent: {
            username: "user",
            remainingTime: data.oponent.remainingTime,
            avatar: "",
          },
        },
        playingAS: data.playingAs == "w" ? "w" : "b",
      });
    },
    [setBoardStateValue]
  );

  const handleGamePos = useCallback(
    (data: { gameState: [] }) => {
      // console.log(data);
      const pos: BoardPos | null = getBoardPosition(data.gameState);

      // console.log(data);
      if (pos) setBoardState("boardPos", pos);
    },
    [setBoardState]
  );

  const handlePosMoves = useCallback(
    (data: { moves: [string] }) => {
      const playingAs = getBoardStateValue("playingAS");
      // console.log(data);
      const moves = data.moves.map((move) => {
        if (move === "O-O") return playingAs === "w" ? "g1" : "g8";
        if (move === "O-O-O") return playingAs === "w" ? "c1" : "c8";
        return move.length <= 4
          ? move[move.length - 1] == "+"
            ? move.slice(0, -1).slice(-2)
            : move.slice(-2)
          : move.slice(0, -1).slice(-2);
      });

      setPossibleMoves(moves);
    },
    [getBoardStateValue, setPossibleMoves]
  );

  const handleClockUpdate = useCallback(
    (data: { whiteRemainigTime: number; blackRemainigTime: number }) => {
      const playingAs = getBoardStateValue("playingAS");
      if (playingAs === "w") {
        setBoardState("playersInfo", (value) => ({
          user: {
            ...value.user,
            remainingTime: data.whiteRemainigTime,
          },
          opponent: {
            ...value.opponent,
            remainingTime: data.blackRemainigTime,
          },
        }));
      }

      if (playingAs === "b") {
        setBoardState("playersInfo", (value) => ({
          user: {
            ...value.user,
            remainingTime: data.blackRemainigTime,
          },
          opponent: {
            ...value.opponent,
            remainingTime: data.whiteRemainigTime,
          },
        }));
      }
    },
    [getBoardStateValue, setBoardState]
  );
  const handleRefreshGame = useCallback(() => {
    const roomId = getBoardStateValue("roomId");
    const playingId = getBoardStateValue("playingId");
    socket?.emit("get-game-pos", {
      roomId: roomId,
      playerId: playingId,
    });
  }, [getBoardStateValue, socket]);

  // const handleGameOver = useCallback(() => {
  //   socket?.emit("get-game-over-info", {
  //     roomId: boardState.roomId,
  //     playerId: boardState.playingId,
  //   });
  // }, [socket, boardState.playingId, boardState.roomId]);

  // const handleGameOverInfo = useCallback(
  //   (data: {
  //     wins: "b" | "w" | "d" | "s";
  //     method: "checkmate" | "timeout";
  //   }) => {

  //     setTimeout(() => {
  //       setBoardState(
  //         "gameStatus",
  //         data.wins === "b"
  //           ? "blackWins"
  //           : data.wins === "w"
  //           ? "whiteWins"
  //           : data.wins === "d"
  //           ? "draw"
  //           : data.wins === "s"
  //           ? "stalemate"
  //           : "stalemate"
  //       );
  //       deleteSocketConnection();

  //       setBoardState(
  //         "wonBy",
  //         data.method === "checkmate" ? "checkmate" : "timeout"
  //       );
  //     }, 500);
  //   },
  //   [setBoardState, deleteSocketConnection]
  // );

  useEffect(() => {
    const playingId = getBoardStateValue("playingId");
    if (!socket) return;

    if (roomId && gameStarted) {
      socket.emit("get-game-pos", {
        roomId: roomId,
        playerId: playingId,
      });
    }
  }, [
    roomId,
    gameStarted,
    socket,
    setBoardState,
    setBoardStateValue,
    getBoardStateValue,
  ]);
  return {
    socket,
    startNewGame,
    endGame,
    handleConnected,
    handleRoomJoind,
    handleGameInfo,
    handleGameStarted,
    handleWaiting,
    handleRefreshGame,
    handlePosMoves,
    handleGamePos,
    handleClockUpdate,
  };
};
