import { Injectable } from '@nestjs/common';
import { GameRooms, GameTime, Room } from './room.interface';
import { randomUUID } from 'crypto';
import { Chess } from 'chess.js';

@Injectable()
export class RoomManagerService {
  private rooms: GameRooms = {};

  createRoom(time: GameTime): Room {
    const roomId = randomUUID().toString();
    this.rooms[roomId] = {
      playerWhite: null,
      playerBlack: null,
      roomId: roomId,
      status: 'available',
      time: time,
      turn: 'w',
      playerWhiteRemainingTime:
        time == 10 ? 60 * 10 * 1000 : time == 5 ? 60 * 5 * 1000 : 60 * 3 * 1000,
      playerBlackRemainingTime: null,
      game: new Chess(),
    };
    return this.rooms[roomId];
  }

  deleteRoom(searchRoomParams: Pick<Room, 'roomId'>): boolean {
    if (this.rooms[searchRoomParams.roomId]) {
      delete this.rooms[searchRoomParams.roomId];
      return true;
    }
    return false;
  }

  findAvailabelRoom(searchRoomParams: Pick<Room, 'time' | 'status'>): Room {
    return Object.values(this.rooms).find(
      (room) =>
        room.time === searchRoomParams.time &&
        room.status === searchRoomParams.status,
    );
  }

  findRoom(searchRoomParams: Pick<Room, 'roomId'>): Room | undefined {
    return Object.values(this.rooms).find((room) => {
      return Object.entries(searchRoomParams).every(([key, value]) => {
        return room[key as keyof Room] === value;
      });
    });
  }

  findRoomById(roomId: string): Room | null {
    const room: Room | undefined = Object.values(this.rooms).find(
      (room) => room.roomId === roomId,
    );
    if (room) return room;
    return null;
  }

  addPlayerToRoom(
    searchRoomParams: Pick<Room, 'roomId'>,
    player: string,
  ): boolean {
    const room: Room | null = this.findRoomById(searchRoomParams.roomId);

    if (!room) {
      throw new Error(
        `invalid roomId cannot find room by id ${searchRoomParams.roomId}`,
      );
    }
    if (room.playerWhite === null) {
      room.playerWhite = player;
      return true;
    }

    if (room.playerBlack === null) {
      room.playerBlack = player;
      return true;
    }
    return false;
  }

  updateRoomStatus(
    searchRoomParams: Pick<Room, 'roomId'>,
    updateRoomParams: Partial<
      Pick<
        Room,
        | 'roomId'
        | 'playerBlackRemainingTime'
        | 'playerWhiteRemainingTime'
        | 'turn'
        | 'status'
      >
    >,
  ): Room | null {
    const room: Room | null = this.findRoomById(searchRoomParams.roomId);

    if (!room) {
      throw new Error(
        `invalid roomId cannot find room by id ${searchRoomParams.roomId}`,
      );
    }

    Object.assign(room, updateRoomParams);
    return room;
  }

  isRoomReadyToStart(searchRoomParams: Pick<Room, 'roomId'>): boolean {
    const room: Room | null = this.findRoomById(searchRoomParams.roomId);
    if (!room) {
      throw new Error(
        `invalid roomId cannot find room by id ${searchRoomParams.roomId}`,
      );
    }
    if (room.status === 'full') {
      return true;
    }
    return false;
  }
}
