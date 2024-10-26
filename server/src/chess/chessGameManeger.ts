import { BLACK, Chess, Square } from "chess.js";
import { ChessGameSessionManegaer } from "./chessGameSessionManeger";
import { GameRoomManeger } from "./gameRoom";
import {
  ChessGames,
  GameRooms,
  GameSession,
  GameTime,
  Player,
  Room,
} from "./types";

export class ChessGameManeger {
  //   static gameSessionManeger:ChessGameSessionManegaer = new ChessGameSessionManegaer() ;
  //   static  gameRoom:GameRoomManeger = new GameRoomManeger();

  static gameRoomInit(player: Player, time: GameTime): string {
    const roomId = GameRoomManeger.createGameRoom(player, time);
    return roomId;
  }

  static joinGameRoom(player: Player, time: GameTime): string | null {
    const rooms = GameRoomManeger.findAllAvailableRooms();

    if (rooms.length == 0) {
      player.playingAs = "white";
      const room = GameRoomManeger.createGameRoom(player, time);
      return room;
    }
    for (let i = 0; i < rooms.length; i++) {
      if (GameRoomManeger.rooms[rooms[i]].available) {
        if (GameRoomManeger.joinRoom(player, rooms[i])) {
          player.playingAs = "black";
          return rooms[i];
        }
      }
    }
    return null;
  }

  static isRoomReadyToStartGame(roomId: string): boolean {
    const room = GameRoomManeger.rooms[roomId].gameReady;
    if (room) {
      return true;
    }
    return false;
  }

  static startGame(roomId: string): boolean {
    const gameSessionId = ChessGameSessionManegaer.createGameSession();
    const room = GameRoomManeger.rooms[roomId];
    if (room && gameSessionId) {
      room.gameSessionId = gameSessionId;
      return true;
    }

    return false;
  }

  static getPossibleMoves(roomId: string, square: Square): any {
    const gameSessionId = GameRoomManeger.rooms[roomId].gameSessionId;
    if (gameSessionId) {
      const moves = ChessGameSessionManegaer.games[gameSessionId].chess.moves({
        square: square,
        verbose: true,
      });
      return moves;
    }
  }

  static getGameSession(roomId: string): GameSession | null {
    const room = GameRoomManeger.rooms[roomId];

    if (room) {
      const gameSessionId = room.gameSessionId;

      if (!gameSessionId) return null;
      const session = ChessGameSessionManegaer.games[gameSessionId];

      if (session) {
        return session;
      }
    }

    return null;
  }

  static getRoom(roomId: string): Room | null {
    const room = GameRoomManeger.rooms[roomId];
    if (room) {
      return room;
    }
    return null;
  }
}
