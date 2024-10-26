import { Player } from "./types";
import crypto from "crypto";

export class PlayerManeger {

  static createPlayer(socketId: string): Player {
    const playerId: string = crypto.randomBytes(4).toString("hex");
    const player: Player = {
      socketId: socketId,
      playingAs: "white",
    };

    return player;
  }
}
