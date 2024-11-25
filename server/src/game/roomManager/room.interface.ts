import { Chess } from 'chess.js';

export type GameTime = 3 | 5 | 10;
export type RoomStatus = 'available' | 'running' | 'full';
export interface Room {
  roomId: string;
  status: RoomStatus;
  playerWhite: string | null;
  playerBlack: string | null;
  time: GameTime;
  turn: 'w' | 'b';
  playerWhiteRemainingTime: number;
  playerBlackRemainingTime: number | null;
  game: Chess;
}

export interface GameRooms {
  [roomId: string]: Room;
}
