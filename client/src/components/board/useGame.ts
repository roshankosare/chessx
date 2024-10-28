import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { BoardPos, BoardPosElement, PieceColor, PieceType } from "@/types";
import { hasKeyOfType } from "@/lib/utils";
import { useBoard } from "./useBoard";
import { useTiles } from "./useTiles";

const getBoardPosition = (data: {
  gameState: Array<
    Array<{ square: string; type: PieceType; color: PieceColor }>
  >;
}): BoardPos | null => {
  const pos: Array<BoardPosElement | null> = [];

  data.gameState.forEach((r) => {
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
  const { setPossibleMoves } = useTiles();

  const startNewGame = () => {
    createSocketConnection();
  };

  const endGame = () => {
    deleteSocketConnection();
  };

  useEffect(() => {
    const handleConnected = (data: { socket: string }) => {
      if (hasKeyOfType<{ socketId: string }>(data, "socketId", "string")) {
        setBoardState("playingId", data.socketId);
        socket?.emit("join-room", { id: data.socketId });
      }
    };
    const handleWaiting = (data: { roomId: string }) => {
      if (hasKeyOfType<{ roomId: string }>(data, "roomId", "string"))
        setBoardState("roomId", data.roomId);
      setBoardState("waiting", true);
      setBoardState("gameStarted", false);
    };

    const handleRoomJoind = (data: { roomId: string }) => {
      if (hasKeyOfType<{ roomId: string }>(data, "roomId", "string"))
        setBoardState("roomId", data.roomId);
      setBoardState("gameStarted", false);
      setBoardState("waiting", true);
    };

    const handleGameStarted = () => {
      setBoardState("waiting", false);
      setBoardState("gameStarted", true);
      if (!boardState.playingAS)
        socket?.emit("get-game-info", {
          roomId: boardState.roomId,
          playerId: boardState.playingId,
        });
    };

    const handleGameInfo = (data: { playingAs: string }) => {
      setBoardState("playingAS", data.playingAs == "w" ? "w" : "b");
    };

    const handleGamePos = (data: { gameState: [] }) => {
      const pos: BoardPos | null = getBoardPosition(data);
      // console.log(data);
      if (pos) setBoardState("boardPos", pos);
    };

    const handlePosMoves = (data: { moves: [string] }) => {
      const moves = data.moves.map((move) => {
        if (move === "O-O") return boardState.playingAS === "w" ? "g1" : "g8";
        if (move === "O-O-O") return boardState.playingAS === "w" ? "c1" : "c8";
        return move.length <= 4 ? move.slice(-2) : move.slice(0, -1).slice(-2);
      });
      setPossibleMoves(moves);
    };

    const handleRefreshGame = () => {
      socket?.emit("get-game-pos", {
        roomId: boardState.roomId,
        playerId: boardState.playingId,
      });
    };
    if (!socket) return;
    socket.on("connected", handleConnected);
    socket.on("waiting", handleWaiting);
    socket.on("room-joined", handleRoomJoind);
    socket.on("game-started", handleGameStarted);
    socket.on("game-info", handleGameInfo);
    socket.on("game-pos", handleGamePos);
    socket.on("pos-moves", handlePosMoves);
    socket.on("refresh-game-status", handleRefreshGame);

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
      // console.log("from:", boardState.from, " to:", boardState.to);
      socket.emit("make-move", {
        from: boardState.from,
        to: boardState.to,
        roomId: boardState.roomId,
        playerId: boardState.playingId,
      });
      setBoardState("to", null);
      setBoardState("from", null);
      setBoardState("selectedPiece", null);
      // setPossibleMoves([]);
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
  }, [socket, boardState, setBoardState, setPossibleMoves]);
  return { startNewGame, endGame };
};
