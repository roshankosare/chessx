import { Injectable } from '@nestjs/common';
import { RoomManagerService } from '../roomManager/roomManager.service';
import { DiLevel, Room } from '../roomManager/room.interface';
import { Chess, Square } from 'chess.js';
import axios from 'axios';
import { Move } from 'chess.js';
import { generateNumericID } from 'src/utils';
import { stockfishUrl } from 'src/const';
import { ChessGameService } from '../chessGame/chessGame.service';

@Injectable()
export class BotService {
  constructor(
    private readonly roomManagerService: RoomManagerService,
    private readonly chessGameService: ChessGameService,
  ) {}

  joinRoom(player: string, dificultyLevel: DiLevel): string | null {
    const newRoom: Room = this.roomManagerService.createRoom(null, 'M');
    // console.log(newRoom)

    if (!newRoom) {
      throw new Error('failed to create new room');
    }
    if (Math.random() < 0.5) {
      this.roomManagerService.addPlayerToRoom(
        { roomId: newRoom.roomId },
        player,
      );
      this.roomManagerService.addPlayerToRoom(
        { roomId: newRoom.roomId },
        'BOT',
      );
    } else {
      this.roomManagerService.addPlayerToRoom(
        { roomId: newRoom.roomId },
        'BOT',
      );
      this.roomManagerService.addPlayerToRoom(
        { roomId: newRoom.roomId },
        player,
      );
    }

    this.roomManagerService.updateRoomStatus(
      { roomId: newRoom.roomId },
      {
        status: 'full',
        dificultyLevel: dificultyLevel || 10,
        playerBlackUsername:
          newRoom.playerBlack === 'BOT'
            ? 'Stockfish'
            : 'guest' + generateNumericID(),
        playerWhiteUsername:
          newRoom.playerWhite === 'BOT'
            ? 'Stockfish'
            : 'guest' + generateNumericID(),
      },
    );
    // console.log(newRoom);
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
    | 'playerBlackUsername'
    | 'playerWhiteUsername'
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
        playerBlackUsername: data.playerBlackUsername,
        playerWhiteUsername: data.playerWhiteUsername,
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
    const game = this.chessGameService.getGame();
    game.load(room.fen);
    const pos = game.board();
    return {
      gamePos:
        room.playerWhite === player
          ? pos
          : pos.reverse().map((a) => a.reverse()),
      blackCapturedPieces: room.blackCapturedPieces,
      whiteCapturedPieces: room.whiteCapturedPieces,
      moveHistory: room.moveHistory,
      lastMove: { from: room.lastFrom, to: room.lastTo },
    };
  }
  getPosMoves(player: string, roomId: string, square: Square): string[] | null {
    try {
      const room = this.roomManagerService.findRoom({ roomId: roomId });

      if (!room) {
        return null;
      }
      const game = this.chessGameService.getGame();
      game.load(room.fen);
      const presentPiece = game.get(square);
      if (!presentPiece) {
        // if peach is not present on the square then return null
        return null;
      }

      const playingAs = room.playerWhite === player ? 'w' : 'b';
      if (!(presentPiece.color === (playingAs === 'w' ? 'w' : 'b'))) {
        // if white player trying to get pos moves of black player and vice-cersa the return null;
        return;
      }
      if (playingAs != (game.turn() === 'w' ? 'w' : 'b')) {
        const chessCopy = new Chess(game.fen());
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
      const moves = game.moves({ square: square, verbose: false });

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
      const game = this.chessGameService.getGame();
      game.load(room.fen);
      if (room.playerWhite === player && room.turn === 'w') {
        let moveResult: Move;
        if (room.playerWhite === 'BOT' && room.turn === 'w') {
          const result = await axios.get(stockfishUrl + '/bestmove', {
            data: {
              fen: game.fen(),
              depth: room.dificultyLevel,
            },
          });
          const botMove: string = result.data.bestMove.replace(/[\s]/g, '');
          // console.log(botMove)

          const from = botMove.slice(0, 2);
          const to =
            botMove.length > 4
              ? botMove.slice(-3).slice(0, 2)
              : botMove.slice(-2);
          const promotionPiece = botMove.length > 4 ? botMove.slice(-1) : null;
          moveResult = game.move({
            from: from,
            to: to,
            promotion: promotionPiece,
          });
          this.roomManagerService.updateRoomStatus(
            { roomId: roomId },
            {
              lastFrom: moveResult.from,
              lastTo: moveResult.to,
              fen: game.fen(),
              turn: 'b',
            },
          );
        } else {
          moveResult = game.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion,
          });
          this.roomManagerService.updateRoomStatus(
            { roomId: roomId },
            {
              lastFrom: moveResult.from,
              lastTo: moveResult.to,
              fen: game.fen(),
              turn: 'b',
            },
          );
        }

        if (game.isGameOver()) {
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
        return 'next';
      }
      if (room.playerBlack === player && room.turn === 'b') {
        let moveResult: Move;
        if (room.playerBlack === 'BOT' && room.turn === 'b') {
          const result = await axios.get(stockfishUrl + '/bestmove', {
            data: {
              fen: game.fen(),
              depth: room.dificultyLevel,
            },
          });
          const botMove: string = result.data.bestMove.replace(/[\s]/g, '');

          const from = botMove.slice(0, 2);
          const to =
            botMove.length > 4
              ? botMove.slice(-3).slice(0, 2)
              : botMove.slice(-2);
          const promotionPiece = botMove.length > 4 ? botMove.slice(-1) : null;
          moveResult = game.move({
            from: from,
            to: to,
            promotion: promotionPiece,
          });
          this.roomManagerService.updateRoomStatus(
            { roomId: roomId },
            {
              lastFrom: moveResult.from,
              lastTo: moveResult.to,
              fen: game.fen(),
              turn: 'w',
            },
          );
        } else {
          moveResult = game.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion,
          });
          this.roomManagerService.updateRoomStatus(
            { roomId: roomId },
            {
              lastFrom: moveResult.from,
              lastTo: moveResult.to,
              fen: game.fen(),
              turn: 'w',
            },
          );
        }

        if (game.isGameOver()) {
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
    const game = this.chessGameService.getGame();
    game.load(room.fen);

    if (
      room.playerBlackRemainingTime <= 0 ||
      room.playerWhiteRemainingTime <= 0
    ) {
      room.gameResult = room.playerBlackRemainingTime <= 0 ? 'w' : 'b';
      room.gameResultCause = 'timeout';
      return;
    }

    if (game.isDraw()) {
      room.gameResult = 'd';
      room.gameResultCause = 'draw';
      return 'draw';
    }
    if (game.isStalemate()) {
      room.gameResult = 's';
      room.gameResultCause = 'stealmate';
      return 'stalemate';
    }
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        const playerWin = game.turn();
        room.gameResult = playerWin === 'w' ? 'b' : 'w';
        room.gameResultCause = 'checkmate';
        return;
      }
    }
  }
}
