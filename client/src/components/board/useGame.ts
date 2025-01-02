import { useCallback, useEffect } from "react";
import { useSocket } from "./useSocket";
import { BoardPos, BoardPosElement, PieceColor, PieceType } from "@/types";
import { hasKeyOfType } from "@/lib/utils";
import { useBoard } from "./useBoard";
import { useTiles } from "./useTiles";

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

export const useGame = () => {
  const { socket, createSocketConnection, deleteSocketConnection } =
    useSocket();
  const { boardState, setBoardState } = useBoard();
  const { setPossibleMoves, selectPiece } = useTiles();

  const startNewGame = () => {
    createSocketConnection();
  };

  const endGame = () => {
    deleteSocketConnection();
  };

  const selectSquare = (id: string, selected: boolean) => {
    if (boardState.selectedPiece == id) {
      selected = false;
      setBoardState("selectedPiece", null);
      setPossibleMoves([]);
      return;
    }

    if (boardState.selectedPiece && boardState.selectedPiece != id) {
      if (selected) {
        setBoardState("from", boardState.selectedPiece);
        setBoardState("to", id);
        setBoardState("selectedPiece", null);
        setPossibleMoves([]);
        return;
      }
    }
    selectPiece(id, boardState, (square: string | null) => {
      if (boardState.selectedPiece == square) {
        setBoardState("selectedPiece", null);
        return;
      }
      setBoardState("selectedPiece", square);
    });
  };

  const handleConnected = useCallback(
    (data: { socket: string }) => {
      if (hasKeyOfType<{ socketId: string }>(data, "socketId", "string")) {
        setBoardState("playingId", data.socketId);
        socket?.emit("join-room", { id: data.socketId });
      }
    },
    [socket, setBoardState]
  );

  const handleWaiting = useCallback(
    (data: { roomId: string }) => {
      if (hasKeyOfType<{ roomId: string }>(data, "roomId", "string"))
        setBoardState("roomId", data.roomId);
      setBoardState("waiting", true);
      setBoardState("gameStarted", false);
    },
    [setBoardState]
  );

  const handleRoomJoind = useCallback(
    (data: { roomId: string }) => {
      if (hasKeyOfType<{ roomId: string }>(data, "roomId", "string"))
        setBoardState("roomId", data.roomId);
      setBoardState("gameStarted", false);
      setBoardState("waiting", true);
    },
    [setBoardState]
  );

  const handleGameStarted = useCallback(() => {
    setBoardState("waiting", false);
    setBoardState("gameStarted", true);
    if (!boardState.playingAS)
      socket?.emit("get-game-info", {
        roomId: boardState.roomId,
        playerId: boardState.playingId,
      });
  }, [
    boardState.playingAS,
    boardState.playingId,
    setBoardState,
    boardState.roomId,
    socket,
  ]);

  const handleGameInfo = useCallback(
    (data: {
      user: { username: string; remainingTime: number };
      oponent: { username: string; remainingTime: number };
      playingAs: string;
    }) => {
      //fetch username here
      setBoardState("user", {
        username: "me",
        remainingTime: data.user.remainingTime,
        avatar: "",
      });
      setBoardState("oponent", {
        username: "user",
        remainingTime: data.oponent.remainingTime,
        avatar: "",
      });
      setBoardState("playingAS", data.playingAs == "w" ? "w" : "b");
    },
    [setBoardState]
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
        if (move === "O-O") return boardState.playingAS === "w" ? "g1" : "g8";
        if (move === "O-O-O") return boardState.playingAS === "w" ? "c1" : "c8";
        return move.length <= 4
          ? move[move.length - 1] == "+"
            ? move.slice(0, -1).slice(-2)
            : move.slice(-2)
          : move.slice(0, -1).slice(-2);
      });
      moves.push(boardState.selectedPiece || "");
      setPossibleMoves(moves);
    },
    [boardState.playingAS, boardState.selectedPiece, setPossibleMoves]
  );

  const handleClockUpdate = useCallback(
    (data: { whiteRemainigTime: number; blackRemainigTime: number }) => {
      if (boardState.playingAS === "w") {
        setBoardState("user", (value) => ({
          ...value,
          remainingTime: data.whiteRemainigTime,
        }));
        setBoardState("oponent", (value) => ({
          ...value,
          remainingTime: data.blackRemainigTime,
        }));
      }

      if (boardState.playingAS === "b") {
        setBoardState("user", (value) => ({
          ...value,
          remainingTime: data.blackRemainigTime,
        }));
        setBoardState("oponent", (value) => ({
          ...value,
          remainingTime: data.whiteRemainigTime,
        }));
      }
    },
    [boardState.playingAS, setBoardState]
  );
  const handleRefreshGame = useCallback(() => {
    socket?.emit("get-game-pos", {
      roomId: boardState.roomId,
      playerId: boardState.playingId,
    });
  }, [boardState.roomId, boardState.playingId, socket]);
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

    if (boardState.roomId && boardState.gameStarted) {
      socket.emit("get-game-pos", {
        roomId: boardState.roomId,
        playerId: boardState.playingId,
      });
    }
    if (boardState.selectedPiece) {
      socket.emit("get-pos-moves", {
        roomId: boardState.roomId,
        playerId: boardState.playingId,
        square: boardState.selectedPiece,
      });
      // setBoardState("selectedPiece", null);
    }

    if (boardState.from && boardState.to) {
      //  console.log("this runs");
      // console.log("from:", boardState.from, " to:", boardState.to);
      socket.emit("make-move", {
        from: boardState.from,
        to: boardState.to,
        roomId: boardState.roomId,
        playerId: boardState.playingId,
      });
      setBoardState("to", null);
      setBoardState("from", null);

      // console.log("this runs");
    }

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
    };
  }, [
    boardState.from,
    boardState.to,
    boardState.gameStarted,
    boardState.playingId,
    boardState.roomId,
    boardState.selectedPiece,
    socket,
    setBoardState,
    setPossibleMoves,
    handleRoomJoind,
    handleWaiting,
    handleConnected,
    handleGameStarted,
    handleGamePos,
    handleGameInfo,
    handleRefreshGame,
    handlePosMoves,
    handleClockUpdate
  ]);
  return { startNewGame, endGame, selectSquare };
};
