import { ChessGameManeger } from "./chessGameManeger";
import { GameRooms, GameTime, Player } from "./types";
import crypto from "crypto";

export class GameRoomManeger {
  static rooms: GameRooms = {};

  static createGameRoom(player: Player, time: GameTime): string {
    const roomId: string = crypto.randomBytes(4).toString("hex");
    this.rooms[roomId] = {
      available: true,
      roomId: roomId,
      playerWhite: player,
      playerBlack: null,
      time: time,
      gameSessionId: null,
      gameReady:false
    };
    return roomId;
  }

  static findAllAvailableRooms(): string[] {
    return Object.values(GameRoomManeger.rooms)
      .filter((room) => room.available)
      .map((room) => room.roomId);
  }

  static isRoomAvailable(roomId: string): boolean {
    return GameRoomManeger.rooms[roomId].available;
  }

  static joinRoom(player: Player, roomId: string): boolean {
    if (GameRoomManeger.isRoomAvailable(roomId)) {
      GameRoomManeger.rooms[roomId] = {
        ...GameRoomManeger.rooms[roomId],
        available: false,
        playerBlack: player,
        gameReady:true,
      };
      return true;
    }
    return false;
  }


  static deleteRoom(roomId: string): boolean {
    if (this.rooms[roomId]) {
      delete this.rooms[roomId];
      return true;
    }
    return false;
  }
}
