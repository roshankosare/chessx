import { Chess } from "chess.js";
import { ChessGames } from "./types";
import crypto from "crypto";

export class ChessGameSessionManegaer {
  static games: ChessGames = {};

  static createGameSession(): string | null {
    const sessionId: string = crypto.randomBytes(4).toString("hex");

    if (!sessionId) return null;
    ChessGameSessionManegaer.games[sessionId] = {
      sessionId: sessionId,
      chess: new Chess(),
      turn: "w",
    };
    return sessionId;
  }

  static deleteGameSession(sessionId: string): boolean {
    if (this.games[sessionId]) {
      delete this.games[sessionId];
      return true;
    }
    return false;
  }
}
