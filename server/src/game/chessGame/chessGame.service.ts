import { Injectable } from '@nestjs/common';
import { Chess } from 'chess.js';

@Injectable()
export class ChessGameService {
  private game: Chess = new Chess();

  getGame() {
    return this.game;
  }
}
