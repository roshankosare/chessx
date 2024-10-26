import { Server, Socket } from "socket.io";
import { ChessGameManeger } from "./chessGameManeger";
import { PlayerManeger } from "./player";
import { Chess, Square } from "chess.js";

const toRoom = ({
  socket,
  event,
  roomId,
  data,
}: {
  socket: Socket;
  event: string;
  roomId: string;
  data?: any;
}) => {
  socket.to(roomId).emit(event, data);
};

const toUser = ({
  io,
  event,
  roomId,
  userId,
  data,
}: {
  io: Server;
  event: string;
  roomId: string;
  userId: string;
  data?: any;
}) => {
  const sockets = io.sockets.adapter.rooms.get(roomId);
  let clientSocket;
  if (sockets)
    for (const socketId of sockets) {
      clientSocket = io.sockets.sockets.get(socketId);
      if (clientSocket && clientSocket.id === userId) {
        break; // Found the user, no need to continue
      }
    }
  if (!clientSocket) return;
  clientSocket.emit(event, data);
};
export default function chessGameSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.emit("connected", { socketId: socket.id });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    socket.on("join-room", (user) => {
      const player = PlayerManeger.createPlayer(user.id);

      const room = ChessGameManeger.joinGameRoom(player, 5);

      if (room) {
        socket.join(room);
        const sockets = io.sockets.adapter.rooms.get(room);
        let clientSocket;
        if (sockets)
          for (const socketId of sockets) {
            clientSocket = io.sockets.sockets.get(socketId);
            if (clientSocket && clientSocket.id === user.id) {
              break; // Found the user, no need to continue
            }
          }

        const r = ChessGameManeger.getRoom(room);
        if (r && clientSocket) {
          const playerId =
            r.playerWhite.socketId == user.id
              ? r.playerWhite.socketId
              : r.playerBlack?.socketId;
          clientSocket.emit("room-joined", {
            roomId: room,
            playerId: playerId,
          });
          if (ChessGameManeger.isRoomReadyToStartGame(room)) {
            ChessGameManeger.startGame(room);

            io.to(room).emit("game-started");
          } else {
            clientSocket.emit("waiting", { roomId: room, playerId: playerId });
          }
        }
      }
    });

    socket.on("get-game-info", (data) => {
      try {
        const roomId = data.roomId;
        const playerId = data.playerId;
        if (!roomId && !playerId) return;

        const gameSession = ChessGameManeger.getGameSession(roomId);
        if (gameSession) {
          const pos = gameSession.chess.board();
          const room = ChessGameManeger.getRoom(roomId);
          const sockets = io.sockets.adapter.rooms.get(roomId);
          let clientSocket;
          if (sockets)
            for (const socketId of sockets) {
              clientSocket = io.sockets.sockets.get(socketId);
              if (clientSocket && clientSocket.id === playerId) {
                break; // Found the user, no need to continue
              }
            }
          if (room && clientSocket) {
            // const playingAs = playerId == room?.playerWhite.socketId ? 1 : 0;
            clientSocket.emit("game-info", {
              playingAs: room.playerWhite.socketId == playerId ? "w" : "b",
            });
          }
          // emit exit game event
        }
      } catch (error) {}
    });

    socket.on("get-game-pos", (data) => {
      const roomId = data.roomId;
      const playerId = data.playerId;
      if (roomId && playerId) {
        const gameSession = ChessGameManeger.getGameSession(roomId);
        if (gameSession) {
          const pos = gameSession.chess.board();
          const room = ChessGameManeger.getRoom(roomId);
          const sockets = io.sockets.adapter.rooms.get(roomId);
          let clientSocket;
          if (sockets)
            for (const socketId of sockets) {
              clientSocket = io.sockets.sockets.get(socketId);
              if (clientSocket && clientSocket.id === playerId) {
                break; // Found the user, no need to continue
              }
            }
          if (room && clientSocket) {
            // const playingAs = playerId == room?.playerWhite.socketId ? 1 : 0;
            clientSocket.emit("game-pos", {
              gameState:
                playerId == room?.playerWhite.socketId
                  ? pos
                  : pos.reverse().map((a) => a.reverse()),
            });
          }
          // emit exit game event
        }
      }
    });

    socket.on("get-pos-moves", (data) => {
      const square: Square = data.square;
      const roomId = data.roomId;
      const playerId = data.playerId;
      if (square == null) {
        return;
      }

      if (!roomId && !square) {
        return;
      }
      try {
        const gameSession = ChessGameManeger.getGameSession(roomId);
        if (!gameSession) return;

        const room = ChessGameManeger.getRoom(roomId);

        const playingAs = playerId == room?.playerWhite.socketId ? "w" : "b";

        const presentPiece = gameSession.chess.get(square);
        if (!presentPiece) {
          // if not peace on square return
          return;
        }

        if (!(presentPiece.color === (playingAs === "w" ? "w" : "b"))) {
          // if user piece not equal to square piece.color
          return;
        }

        const sockets = io.sockets.adapter.rooms.get(roomId);
        let clientSocket;
        if (sockets)
          for (const socketId of sockets) {
            clientSocket = io.sockets.sockets.get(socketId);
            if (clientSocket && clientSocket.id === playerId) {
              break; // Found the user, no need to continue
            }
          }

        if (playingAs != (gameSession.chess.turn() === "w" ? "w" : "b")) {
          const chessCopy = new Chess(gameSession.chess.fen());

          // Set the turn on the copy to match the color of the piece on the square
          if (presentPiece.color !== chessCopy.turn()) {
            chessCopy.load(
              chessCopy
                .fen()
                .replace(/^([^\s]+)(\s)([wb])/, `$1$2${presentPiece.color}`)
            );
          }

          // Get moves for the piece on the specific square in the copied game state
          const moves = chessCopy.moves({ square: square, verbose: false });
          if (room && clientSocket) {
            clientSocket.emit("pos-moves", { moves: moves });
          }
          return;
        }
        const moves = gameSession.chess.moves({
          square: square,
          verbose: false,
        });

        if (room && clientSocket) {
          clientSocket.emit("pos-moves", { moves: moves });
        }
        return;
        // emit exit game event
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("make-move", (data) => {
      try {
        const roomId = data.roomId;
        const playerId = data.playerId;
        const from = data.from;
        const to = data.to;
        if (!roomId) {
          return;
        }

        const gameSession = ChessGameManeger.getGameSession(roomId);
        const room = ChessGameManeger.getRoom(roomId);
        if (!gameSession) return;

        if (!room) return;
        const playerTurn = gameSession.chess.turn();
        const player =
          playerId == room.playerWhite.socketId
            ? room.playerWhite
            : playerId == room.playerBlack?.socketId
            ? room.playerBlack
            : null;

        if (!player) return;

        if (
          (playerTurn == "w" && player.playingAs == "white") ||
          (playerTurn == "b" && player.playingAs == "black")
        ) {
          gameSession.chess.move({ from: from, to: to });
          io.to(roomId).emit("refresh-game-status");
        }
      } catch (error) {
        // console.log(error);
      }
    });
  });
}
