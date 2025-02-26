import { Injectable } from '@nestjs/common';
import { RoomManagerService } from '../roomManager/roomManager.service';
import { Room } from '../roomManager/room.interface';
import { Chess, Square } from 'chess.js';
import axios from 'axios';
import { Move } from 'chess.js';

@Injectable()
export class BotService {
  constructor(private readonly roomManagerService: RoomManagerService) {}

  joinRoom(player: string): string | null {
    const newRoom: Room = this.roomManagerService.createRoom(null, 'M');

    if (!newRoom) {
      throw new Error('failed to create new room');
    }
    this.roomManagerService.addPlayerToRoom({ roomId: newRoom.roomId }, player);
    this.roomManagerService.addPlayerToRoom({ roomId: newRoom.roomId }, 'BOT');

    this.roomManagerService.updateRoomStatus(
      { roomId: newRoom.roomId },
      {
        status: 'full',
      },
    );
    return newRoom.roomId;
  }

  getGameInfo(
    roomId: string,
  ): Pick<
    Room,
    | 'playerBlack'
    | 'playerWhite'
    | 'turn'
    | 'gameResult'
    | 'gameResultCause'
    | 'matchType'
  > | null {
    const data = this.roomManagerService.findRoom({ roomId: roomId });
    if (data)
      return {
        playerBlack: data.playerBlack,
        playerWhite: data.playerWhite,
        turn: data.turn,
        gameResult: data.gameResult,
        gameResultCause: data.gameResultCause,
        matchType: data.matchType,
      };
    return null;
  }

  updataGame(
    roomId: string,
    updateGameParams: Partial<Pick<Room, 'turn'>>,
  ): boolean {
    const room = this.roomManagerService.updateRoomStatus(
      { roomId: roomId },
      updateGameParams,
    );
    if (room) {
      return true;
    }
    return false;
  }
  getGamePosition(player: string, roomId: string) {
    const room = this.roomManagerService.findRoom({ roomId: roomId });

    if (!room) {
      return;
    }
    const pos = room.game.board();
    return {
      gamePos:
        room.playerWhite === player
          ? pos
          : pos.reverse().map((a) => a.reverse()),
      blackCapturedPieces: room.blackCapturedPieces,
      whiteCapturedPieces: room.whiteCapturedPieces,
      moveHistory: room.moveHistory,
    };
  }
  getPosMoves(player: string, roomId: string, square: Square): string[] | null {
    try {
      const room = this.roomManagerService.findRoom({ roomId: roomId });

      if (!room) {
        return null;
      }
      const presentPiece = room.game.get(square);
      if (!presentPiece) {
        // if peach is not present on the square then return null
        return null;
      }

      const playingAs = room.playerWhite === player ? 'w' : 'b';
      if (!(presentPiece.color === (playingAs === 'w' ? 'w' : 'b'))) {
        // if white player trying to get pos moves of black player and vice-cersa the return null;
        return;
      }
      if (playingAs != (room.game.turn() === 'w' ? 'w' : 'b')) {
        const chessCopy = new Chess(room.game.fen());
        // Set the turn on the copy to match the color of the piece on the square
        if (presentPiece.color !== chessCopy.turn()) {
          chessCopy.load(
            chessCopy
              .fen()
              .replace(/^([^\s]+)(\s)([wb])/, `$1$2${presentPiece.color}`),
          );
        }
        const moves = chessCopy.moves({ square: square, verbose: false });
        return moves;
      }
      const moves = room.game.moves({ square: square, verbose: false });

      return moves;
    } catch (error) {
      console.log(error);
    }
  }

  startBlackTime() {
    return;
  }

  startWhiteTime() {
    return;
  }

  async makeMove(
    move: { from: string; to: string; promotion?: string },
    player: string,
    roomId: string,
  ): Promise<'gameover' | 'next'> {
    try {
      const room = this.roomManagerService.findRoom({ roomId: roomId });

      if (!room) {
        throw new Error('invalid room Id');
      }
      if (room.playerWhite === player && room.turn === 'w') {
        let moveResult: Move;
        if (room.playerWhite === 'BOT' && room.turn === 'w') {
          const result = await axios.get('http://localhost:5123/bestmove', {
            data: {
              fen: room.game.fen(),
              depth: 10,
            },
          });
          const botMove: string = result.data.bestMove.replace(/[\s]/g, '');

          const from = botMove.slice(0, 2);
          const to = botMove.slice(-2);
          moveResult = room.game.move({
            from: from,
            to: to,
            // promotion: move.promotion,
          });
        } else {
          moveResult = room.game.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion,
          });
        }

        if (room.game.isGameOver()) {
          this.setGameOverInfo(roomId);
          return 'gameover';
        }
        room.moveHistory.push([
          moveResult.piece + (moveResult.captured ? 'x' : '') + moveResult.to,
          null,
        ]);

        if (moveResult.captured) {
          const capturedPiece = moveResult.captured;
          room.blackCapturedPieces.push(capturedPiece);
        }
        room.turn = 'b';
        return 'next';
      }
      if (room.playerBlack === player && room.turn === 'b') {
        let moveResult: Move;
        if (room.playerBlack === 'BOT' && room.turn === 'b') {
          const result = await axios.get('http://localhost:5123/bestmove', {
            data: {
              fen: room.game.fen(),
              depth: 10,
            },
          });
          const botMove: string = result.data.bestMove.replace(/[\s]/g, '');

          const from = botMove.slice(0, 2);
          const to = botMove.slice(-2);
          moveResult = room.game.move({
            from: from,
            to: to,
            // promotion: move.promotion,
          });
        } else {
          moveResult = room.game.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion,
          });
        }

        if (room.game.isGameOver()) {
          this.setGameOverInfo(roomId);
          return 'gameover';
        }

        room.moveHistory[room.moveHistory.length - 1][1] =
          moveResult.piece + (moveResult.captured ? 'x' : '') + moveResult.to;
        if (moveResult.captured) {
          const capturedPiece = moveResult.captured;
          room.whiteCapturedPieces.push(capturedPiece);
        }
        room.turn = 'w';

        return 'next';
      }
    } catch (error) {
      console.log(error);
      throw new Error('invalid move');
    }
  }

  resignGame(roomId: string, playerId: string): boolean {
    const room = this.roomManagerService.findRoom({ roomId: roomId });

    if (!room) {
      return false;
    }
    let playerResigned: typeof room.gameResult =
      playerId === room.playerBlack ? 'w' : null;
    if (!playerResigned) {
      playerResigned = playerId === room.playerWhite ? 'b' : null;
    }
    if (playerResigned) {
      room.gameResult = playerResigned;
    }
    room.gameResultCause = 'resignation';
  }

  setGameOverInfo(roomId: string) {
    const room = this.roomManagerService.findRoom({ roomId: roomId });

    if (!room) {
      return 'invalidroom';
    }

    if (
      room.playerBlackRemainingTime <= 0 ||
      room.playerWhiteRemainingTime <= 0
    ) {
      room.gameResult = room.playerBlackRemainingTime <= 0 ? 'w' : 'b';
      room.gameResultCause = 'timeout';
      return;
    }

    if (room.game.isDraw()) {
      room.gameResult = 'd';
      room.gameResultCause = 'draw';
      return 'draw';
    }
    if (room.game.isStalemate()) {
      room.gameResult = 's';
      room.gameResultCause = 'stealmate';
      return 'stalemate';
    }
    if (room.game.isGameOver()) {
      if (room.game.isCheckmate()) {
        const playerWin = room.game.turn();
        room.gameResult = playerWin === 'w' ? 'b' : 'w';
        room.gameResultCause = 'checkmate';
        return;
      }
    }
  }
}
