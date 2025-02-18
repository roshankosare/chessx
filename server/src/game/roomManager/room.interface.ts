import { Chess } from 'chess.js';

export type GameTime = 1 | 3 | 5 | 10;
export type RoomStatus = 'available' | 'running' | 'full' | 'gameover';
export interface Room {
  roomId: string;
  status: RoomStatus;
  playerWhite: string | null;
  playerBlack: string | null;
  time: GameTime;
  turn: 'w' | 'b';
  playerWhiteRemainingTime: number;
  whiteCapturedPieces: string[];
  blackCapturedPieces: string[];
  moveHistory: [string, string| null][];
  playerBlackRemainingTime: number | null;
  gameResult: 'w' | 'b' | 'd' | 's' | null;
  gameResultCause:
    | 'timeout'
    | 'checkmate'
    | 'draw'
    | 'stealmate'
    | 'resignation'
    | null;

  game: Chess;
}

export interface GameRooms {
  [roomId: string]: Room;
}
