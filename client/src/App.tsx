import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { Socket, io } from "socket.io-client";
import Board from "./components/board/board";
import { BoardPos, BoardPosElement, PieceColor, PieceType } from "./types";
import { useBoard } from "./components/board/useBoard";
import { hasKeyOfType } from "./lib/utils";
import { useTiles } from "./components/board/useTiles";

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

const startNewGame = async (socket: Socket, id: string | null) => {
  if (!id) {
    return;
  }
  if (socket) {
    socket.emit("join-room", { id });
  }
};

const SOCKET_SERVER_URL = "http://localhost:5000";
function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [start, setStart] = useState<boolean>(false);
  const { boardState, setBoardState } = useBoard();
  const { setPossibleMoves } = useTiles();

  // Establish the connection with the socket server
  useEffect(() => {
    // Create a socket connection only once, and avoid multiple connections
    const newSocket = io(SOCKET_SERVER_URL);

    setSocket(newSocket); // Set the new socket instance in state

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect(); // Always disconnect the socket to clean up resources
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connected", (data) => {
        if (hasKeyOfType<{ socketId: string }>(data, "socketId", "string")) {
          setBoardState("playingId", data.socketId);
        }
      });

      socket?.on("waiting", (data) => {
        if (hasKeyOfType<{ roomId: string }>(data, "roomId", "string"))
          setBoardState("roomId", data.roomId);
        setBoardState("waiting", true);
        setBoardState("gameStarted", false);
      });

      socket.on("room-joined", (data) => {
        if (hasKeyOfType<{ roomId: string }>(data, "roomId", "string"))
          setBoardState("roomId", data.roomId);
        setBoardState("gameStarted", false);
        setBoardState("waiting", true);
      });

      socket?.on("game-started", () => {
        setBoardState("waiting", false);
        setBoardState("gameStarted", true);
        if (!boardState.playingAS)
          socket.emit("get-game-info", {
            roomId: boardState.roomId,
            playerId: boardState.playingId,
          });
        // setBoardState("playingAS", data.playingAs === 1 ? "w" : "b");
      });

      socket.on("game-info", (data) => {
        setBoardState("playingAS", data.playingAs == "w" ? "w" : "b");
      });

      socket?.on("game-pos", (data) => {
        const pos: BoardPos | null = getBoardPosition(data);

        // console.log(data);
        if (pos) setBoardState("boardPos", pos);
      });

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

      socket.on("pos-moves", (data: { moves: [string] }) => {
        const moves = data.moves.map((mov) => {
          if (mov == "O-O" && boardState.playingAS == "w") {
            return "g1";
          }
          if (mov == "O-O-O" && boardState.playingAS == "w") {
            return "c1";
          }

          if (mov == "O-O" && boardState.playingAS == "b") {
            return "g8";
          }
          if (mov == "O-O-O" && boardState.playingAS == "b") {
            return "c8";
          }
          return mov.length <= 4 ? mov.slice(-2) : mov.slice(0, -1).slice(-2);
        });
        // console.log(moves);
        // setBoardState("selectedPiece", null);
        setPossibleMoves(moves);
      });

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
      }

      socket.on("refresh-game-status", () => {
        socket.emit("get-game-pos", {
          roomId: boardState.roomId,
          playerId: boardState.playingId,
        });
      });

      return () => {
        socket.off("game-pos");
        socket.off("pos-moves");
        socket.off("get-game-pos");
        socket.off("waiting");
        socket.off("room-joined");
      };
    }
  }, [
    socket,
    boardState.gameStarted,
    boardState.selectedPiece,
    boardState.playingId,
    boardState.roomId,
    boardState.from,
    boardState.to,
    boardState.playingAS,
    setBoardState,
    setPossibleMoves,
  ]);
  // console.log(boardState.from, boardState.to);
  // console.log(boardState.selectedPiece);

  return (
    <div className=" h-auto px-5 py-5 flex flex-col gap-y-5 w-full sm:max-w-[800px] ">
      {boardState.gameStarted ? (
        <Board size={500}></Board>
      ) : (
        // <></>
        <div className="w-[500px] h-[500px] mx-auto my-auto relative">
          {boardState.waiting && !boardState.gameStarted && (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-20 h-20 border-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          <img
            className="w-full h-full"
            src="/chess-image.png"
            alt="Chess board"
          />
        </div>
      )}
      <div className="flex flex-row justify-center gap-x-4">
        {start ? (
          <Button
            className="text-lg font-bold"
            onClick={() => {
              setStart(false);
            }}
          >
            Exit
          </Button>
        ) : (
          <>
            <Button
              className="text-lg font-bold"
              onClick={() => {
                setStart(true);
                if (socket) startNewGame(socket, boardState.playingId);
              }}
            >
              Play Bot
            </Button>
            <Button className="text-lg font-bold">Play Random</Button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
