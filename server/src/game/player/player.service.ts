import { Injectable } from '@nestjs/common';
import { RoomManagerService } from '../roomManager/roomManager.service';
import { GameTime, Room } from '../roomManager/room.interface';
import { Chess, Square } from 'chess.js';
import { generateNumericID } from 'src/utils';

@Injectable()
export class PlayerService {
  constructor(private readonly roomManagerService: RoomManagerService) {}

  joinRoom(player: string, time: GameTime): string | null {
    const room: Room = this.roomManagerService.findAvailabelRoom({
      time: time,
      status: 'available',
    });

    if (room) {
      this.roomManagerService.addPlayerToRoom({ roomId: room.roomId }, player);
      this.roomManagerService.updateRoomStatus(
        { roomId: room.roomId },
        {
          status: 'full',
          playerBlackUsername: 'guest' + generateNumericID(),
        },
      );
      return room.roomId;
    }

    const newRoom: Room = this.roomManagerService.createRoom(time, 'H');

    if (!newRoom) {
      throw new Error('failed to create new room');
    }
    this.roomManagerService.addPlayerToRoom({ roomId: newRoom.roomId }, player);
    this.roomManagerService.updateRoomStatus(
      { roomId: newRoom.roomId },
      {
        playerWhiteUsername: 'guest' + generateNumericID(),
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
    | 'playerBlackRemainingTime'
    | 'playerWhiteRemainingTime'
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
        playerBlackRemainingTime: data.playerBlackRemainingTime,
        playerWhiteRemainingTime: data.playerWhiteRemainingTime,
        gameResult: data.gameResult,
        gameResultCause: data.gameResultCause,
        matchType: data.matchType,
        playerWhiteUsername: data.playerWhiteUsername,
        playerBlackUsername: data.playerBlackUsername,
      };
    return null;
  }

  updataGame(
    roomId: string,
    updateGameParams: Partial<
      Pick<
        Room,
        'turn' | 'playerBlackRemainingTime' | 'playerWhiteRemainingTime'
      >
    >,
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

  startBlackTime(roomId: string) {
    const room = this.roomManagerService.findRoom({ roomId: roomId });

    if (!room) {
      return;
    }

    const intervalId = setInterval(() => {
      room.playerBlackRemainingTime = room.playerBlackRemainingTime - 1000;
      if (room.playerBlackRemainingTime < 0 || room.status === 'gameover') {
        room.status = 'gameover';
        room.gameResult = 'w';
        room.gameResultCause = 'timeout';
        clearInterval(intervalId);
        return;
      }
      if (room.turn === 'w') {
        clearInterval(intervalId);
      }
    }, 1000);
  }

  startWhiteTime(roomId: string) {
    const room = this.roomManagerService.findRoom({ roomId: roomId });

    if (!room) {
      return;
    }

    const intervalId = setInterval(() => {
      room.playerWhiteRemainingTime = room.playerWhiteRemainingTime - 1000;

      if (room.playerWhiteRemainingTime < 0 || room.status === 'gameover') {
        room.status = 'gameover';
        room.gameResult = 'b';
        room.gameResultCause = 'timeout';
        clearInterval(intervalId);
        return;
      }
      if (room.turn === 'b') {
        clearInterval(intervalId);
      }
    }, 1000);
  }

  makeMove(
    move: { from: string; to: string; promotion?: string },
    player: string,
    roomId: string,
  ): 'gameover' | 'next' {
    try {
      const room = this.roomManagerService.findRoom({ roomId: roomId });

      if (!room) {
        throw new Error('invalid room Id');
      }
      if (room.playerWhite === player && room.turn === 'w') {
        const moveResult = room.game.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        });
        if (room.game.isGameOver()) {
          this.setGameOverInfo(roomId);
          return 'gameover';
        }
        room.moveHistory.push([
          moveResult.piece + (moveResult.captured ? 'x' : '') + moveResult.to,
          null,
        ]);
        this.startBlackTime(room.roomId);
        if (moveResult.captured) {
          const capturedPiece = moveResult.captured;
          room.blackCapturedPieces.push(capturedPiece);
        }
        room.turn = 'b';
        return 'next';
      }
      if (room.playerBlack === player && room.turn === 'b') {
        const moveResult = room.game.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        });

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
        this.startWhiteTime(room.roomId);
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
