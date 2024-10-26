import { Chess } from "chess.js";

export interface Player {
  socketId: string;
  playingAs: "black" | "white";
}

export interface GameSession {
  sessionId: string;
  chess: Chess;
  turn: "b" | "w";
}

export interface ChessGames {
  [gameId: string]: GameSession;
}

export type GameTime = 3 | 5 | 7;

export interface Room {
  available: boolean;
  roomId: string;
  playerWhite: Player;
  playerBlack: Player | null;
  time: GameTime;
  gameSessionId: string | null;
  gameReady :boolean
}

export interface GameRooms {
  [roomId: string]: Room;
}
