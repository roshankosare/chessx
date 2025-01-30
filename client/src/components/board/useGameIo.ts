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
  const playingAs = useBoard((state) => state.boardState.playingAS);
  const selectedPiece = useBoard((state) => state.boardState.selectedPiece);
  const setBoardState = useBoard((state) => state.setBoardState);
  const setBoardStateValue = useBoard((state) => state.setBoardStateValue);
  const gameTime = useBoard((state) => state.boardState.gameTime);
  const move = useBoard((state) => state.boardState.move);
  const gameStarted = useBoard((state) => state.boardState.gameStarted);
  const playingId = useBoard((state) => state.boardState.playingId);
  const roomId = useBoard((state) => state.boardState.roomId);

  const { setPossibleMoves } = useTiles();

  const startNewGame = () => {
    createSocketConnection();
  };

  const endGame = () => {
    deleteSocketConnection();
  };

  const handleConnected = useCallback(
    (data: { socket: string }) => {
      if (hasKeyOfType<{ socketId: string }>(data, "socketId", "string")) {
        setBoardState("playingId", data.socketId);
        socket?.emit("join-room", {
          id: data.socketId,
          time: gameTime,
        });
      }
    },
    [socket, setBoardState, gameTime]
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
    setBoardStateValue({
      waiting: false,
      gameStarted: true,
    });
    if (!playingAs)
      socket?.emit("get-game-info", {
        roomId: roomId,
        playerId: playingId,
      });
  }, [playingAs, playingId, roomId, socket, setBoardStateValue]);

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
    [playingAs, setPossibleMoves]
  );

  const handleClockUpdate = useCallback(
    (data: { whiteRemainigTime: number; blackRemainigTime: number }) => {
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
    [playingAs, setBoardState]
  );
  const handleRefreshGame = useCallback(() => {
    socket?.emit("get-game-pos", {
      roomId: roomId,
      playerId: playingId,
    });
  }, [roomId, playingId, socket]);

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
    if (!socket) return;

    if (roomId && gameStarted) {
      socket.emit("get-game-pos", {
        roomId: roomId,
        playerId: playingId,
      });
    }
    if (selectedPiece) {
      socket.emit("get-pos-moves", {
        roomId: roomId,
        playerId: playingId,
        square: selectedPiece,
      });
      // setBoardState("selectedPiece", null);
    }

    if (move.from && move.to) {
      //  console.log("this runs");
      // console.log("from:", boardState.from, " to:", boardState.to);
      socket.emit("make-move", {
        from: move.from,
        to: move.to,
        roomId: roomId,
        playerId: playingId,
      });
      setBoardStateValue({
        move: {
          from: null,
          to: null,
        },
      });
    }
  }, [
    move,
    gameStarted,
    playingId,
    roomId,
    selectedPiece,
    socket,
    setBoardState,
    setBoardStateValue,
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
    handleClockUpdate
  };
};
