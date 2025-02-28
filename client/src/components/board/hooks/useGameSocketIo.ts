import { BoardPos, BoardPosElement, PieceColor, PieceType } from "@/types";
import { useSocket } from "./useSocket";
import { useBoard } from "./useBoard";
import { useCallback } from "react";
import { hasKeyOfType } from "@/lib/utils";
import { sortPiecesByPower } from "@/lib/chess";

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

export const useGameSocketIo = () => {
  const { getSocketValue, deleteSocketConnection } = useSocket();

  const setBoardState = useBoard((state) => state.setBoardState);
  const setBoardStateValue = useBoard((state) => state.setBoardStateValue);
  const getBoardStateValue = useBoard((state) => state.getBoardStateValue);

  const handleConnected = useCallback(
    (data: { socketId: string }) => {
      const gameTime = getBoardStateValue("gameTime");
      if (hasKeyOfType<{ socketId: string }>(data, "socketId", "string")) {
        setBoardState("playingId", data.socketId);
        const socket = getSocketValue();
        if (!socket) return;
        const op = getBoardStateValue("matchType");
        const diLevel = getBoardStateValue("diLevel");
        socket.emit("join-room", {
          id: data.socketId,
          time: gameTime,
          opponent: op,
          diLevel: op === "M" ? diLevel : null,
        });
      }
    },
    [getSocketValue, setBoardState, getBoardStateValue]
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
    const socket = getSocketValue();
    if (!socket) return;
    setBoardStateValue({
      waiting: false,
      gameStarted: true,
    });
    if (!playingAs)
      socket.emit("get-game-info", {
        roomId: roomId,
        playerId: playingId,
      });
  }, [getBoardStateValue, getSocketValue, setBoardStateValue]);

  const handleGameInfo = useCallback(
    (data: {
      user: { username: string; remainingTime: number };
      oponent: { username: string; remainingTime: number };
      playingAs: string;
    }) => {
      setBoardStateValue({
        playersInfo: {
          user: {
            username: data.user.username,
            remainingTime: data.user.remainingTime,
            avatar: "",
          },
          opponent: {
            username: data.oponent.username,
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
    (data: {
      gamePos: [];
      whiteCapturedPieces: string[];
      blackCapturedPieces: string[];
      moveHistory: [];
      lastMove: { from: string | null; to: string | null };
    }) => {
      const pos: BoardPos | null = getBoardPosition(data.gamePos);
      setBoardStateValue({
        whiteCapturedPieces: sortPiecesByPower(data.whiteCapturedPieces),
        blackCapturedPieces: sortPiecesByPower(data.blackCapturedPieces),
        moveHistory: data.moveHistory,
        lastMove:{from:data.lastMove.from,to:data.lastMove.to}
      });

      // console.log(data);
      // if (pos) setTiles(pos);
      if (pos) setBoardState("boardPos", pos);
    },
    [setBoardState, setBoardStateValue]
  );

  const handlePosMoves = useCallback(
    (data: { moves: [string] }) => {
      const playingAs = getBoardStateValue("playingAS");
      // console.log(data);
      const promotionalMoves: string[] = data.moves.map((move) => {
        return move[move.length - 1] === "+" || move[move.length - 1] === "#"
          ? move[move.length - 3] === "="
            ? move.slice(0, -3).slice(-2)
            : ""
          : move[move.length - 2] === "="
            ? move.slice(0, -2).slice(-2)
            : "";
      });
      setBoardStateValue({ promotionalMoves: promotionalMoves });
      const moves = data.moves.map((move) => {
        if (move === "O-O") return playingAs === "w" ? "g1" : "g8";
        if (move === "O-O-O") return playingAs === "w" ? "c1" : "c8";
        return move.length >= 4
          ? move[move.length - 1] === "+" || move[move.length - 1] === "#" //check or checkmate move
            ? move[move.length - 3] === "="
              ? move.slice(0, -3).slice(-2) // string has + at last and promotion move
              : move.slice(0, -1).slice(-2) //string + but not promotion
            : move[move.length - 2] === "="
              ? move.slice(0, -2).slice(-2) //string has no + but promotion move
              : move.slice(-2) // string has no plus ans not promotion move
          : move.length > 2 &&
              (move[move.length - 1] === "+" || move[move.length - 1] === "#")
            ? move.slice(0, -1).slice(-2) // pawn move to check or checkmate without take
            : move.slice(-2);
      });
      console.log(moves);
      if (moves.length > 0) setBoardState("possibleMoves", moves);
    },
    [getBoardStateValue, setBoardState, setBoardStateValue]
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
    const socket = getSocketValue();
    if (!socket) return;
    const roomId = getBoardStateValue("roomId");
    const playingId = getBoardStateValue("playingId");
    socket.emit("get-game-pos", {
      roomId: roomId,
      playerId: playingId,
    });
  }, [getBoardStateValue, getSocketValue]);

  const handleGameOver = useCallback(() => {
    const socket = getSocketValue();
    if (!socket) return;
    const roomId = getBoardStateValue("roomId");
    const playingId = getBoardStateValue("playingId");

    socket.emit("get-game-over-info", {
      roomId: roomId,
      playerId: playingId,
    });
  }, [getSocketValue, getBoardStateValue]);

  const handleGameOverInfo = useCallback(
    (data: {
      wins: "b" | "w" | "d" | "s";
      method: "checkmate" | "timeout" | "resignation";
    }) => {
      setTimeout(() => {
        setBoardStateValue({
          gameStatus:
            data.wins === "b"
              ? "blackWins"
              : data.wins === "w"
                ? "whiteWins"
                : data.wins === "d"
                  ? "draw"
                  : data.wins === "s"
                    ? "stalemate"
                    : "stalemate",
          wonBy:
            data.method === "checkmate"
              ? "checkmate"
              : data.method === "resignation"
                ? "resignation"
                : "timeout",
        });
        deleteSocketConnection();
      }, 500);
    },
    [setBoardStateValue, deleteSocketConnection]
  );

  return {
    handleConnected,
    handleRoomJoind,
    handleGameInfo,
    handleGameStarted,
    handleWaiting,
    handleRefreshGame,
    handlePosMoves,
    handleGamePos,
    handleClockUpdate,
    handleGameOver,
    handleGameOverInfo,
  };
};
