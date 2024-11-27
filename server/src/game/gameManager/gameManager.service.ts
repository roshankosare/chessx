import { Injectable } from '@nestjs/common';
import { RoomManagerService } from '../roomManager/roomManager.service';
import { GameTime, Room } from '../roomManager/room.interface';
import { Chess, Square } from 'chess.js';

@Injectable()
export class GameManagerService {
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
        },
      );
      return room.roomId;
    }

    const newRoom: Room = this.roomManagerService.createRoom(time);

    if (!newRoom) {
      throw new Error('failed to create new room');
    }
    this.roomManagerService.addPlayerToRoom({ roomId: newRoom.roomId }, player);
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
  > | null {
    const data = this.roomManagerService.findRoom({ roomId: roomId });
    if (data)
      return {
        playerBlack: data.playerBlack,
        playerWhite: data.playerWhite,
        turn: data.turn,
        playerBlackRemainingTime: data.playerBlackRemainingTime,
        playerWhiteRemainingTime: data.playerWhiteRemainingTime,
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
    return room.playerWhite === player
      ? pos
      : pos.reverse().map((a) => a.reverse());
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

      if (room.turn === 'b') {
        clearInterval(intervalId);
      }
    }, 1000);
  }

  makeMove(move: { from: string; to: string }, player: string, roomId: string) {
    try {
      const room = this.roomManagerService.findRoom({ roomId: roomId });

      if (!room) {
        return;
      }
      if (room.playerWhite === player && room.turn === 'w') {
        room.game.move({ from: move.from, to: move.to });
        room.turn = 'b';
        this.startBlackTime(room.roomId);
        return;
      }
      if (room.playerBlack === player && room.turn === 'b') {
        room.game.move({ from: move.from, to: move.to });
        room.turn = 'w';
        this.startWhiteTime(room.roomId);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  isGameReadyToStart(roomId: string): boolean {
    if (this.roomManagerService.isRoomReadyToStart({ roomId: roomId })) {
      return true;
    }
    return false;
  }
}
