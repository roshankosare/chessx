import { Injectable } from '@nestjs/common';
import { RoomManagerService } from '../roomManager/roomManager.service';
import { DiLevel, GameTime, Room } from '../roomManager/room.interface';
import { Square } from 'chess.js';
import { PlayerService } from '../player/player.service';
import { BotService } from '../bot/bot.service';

@Injectable()
export class GameManagerService {
  constructor(
    private readonly playerSerive: PlayerService,
    private readonly botSerive: BotService,
    private readonly roomManagerService: RoomManagerService,
  ) {}

  joinRoom(
    player: string,
    time: GameTime,
    oponent: 'H' | 'M',
    dificultyLevel: DiLevel,
  ): string | null {
    return oponent === 'H'
      ? this.playerSerive.joinRoom(player, time)
      : this.botSerive.joinRoom(player, dificultyLevel);
  }

  getGameInfo(
    roomId: string,
  ): Partial<
    Pick<
      Room,
      | 'playerBlack'
      | 'playerWhite'
      | 'turn'
      | 'playerBlackRemainingTime'
      | 'playerWhiteRemainingTime'
      | 'gameResult'
      | 'gameResultCause'
      | 'matchType'
    >
  > | null {
    const data = this.roomManagerService.findRoom({ roomId: roomId });
    return data.matchType === 'H'
      ? this.playerSerive.getGameInfo(roomId)
      : this.botSerive.getGameInfo(roomId);
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
    const data = this.roomManagerService.findRoom({ roomId: roomId });
    return data.matchType === 'H'
      ? this.playerSerive.updataGame(roomId, updateGameParams)
      : this.botSerive.updataGame(roomId, updateGameParams);
  }
  getGamePosition(player: string, roomId: string) {
    const data = this.roomManagerService.findRoom({ roomId: roomId });
    return data.matchType === 'H'
      ? this.playerSerive.getGamePosition(player, roomId)
      : this.botSerive.getGamePosition(player, roomId);
  }
  getPosMoves(player: string, roomId: string, square: Square): string[] | null {
    const data = this.roomManagerService.findRoom({ roomId: roomId });
    return data.matchType === 'H'
      ? this.playerSerive.getPosMoves(player, roomId, square)
      : this.botSerive.getPosMoves(player, roomId, square);
  }

  async makeMove(
    move: { from: string; to: string; promotion?: string },
    player: string,
    roomId: string,
  ): Promise<'gameover' | 'next'> {
    const data = this.roomManagerService.findRoom({ roomId: roomId });
    return data.matchType === 'H'
      ? this.playerSerive.makeMove(move, player, roomId)
      : await this.botSerive.makeMove(move, player, roomId);
  }

  resignGame(roomId: string, playerId: string): boolean {
    const data = this.roomManagerService.findRoom({ roomId: roomId });
    return data.matchType === 'H'
      ? this.playerSerive.resignGame(roomId, playerId)
      : this.botSerive.resignGame(roomId, playerId);
  }

  setGameOverInfo(roomId: string) {
    const data = this.roomManagerService.findRoom({ roomId: roomId });
    return data.matchType === 'H'
      ? this.playerSerive.setGameOverInfo(roomId)
      : this.botSerive.setGameOverInfo(roomId);
  }

  startBlackTime(roomId: string) {
    const data = this.roomManagerService.findRoom({ roomId: roomId });
    return data.matchType === 'H'
      ? this.playerSerive.startBlackTime(roomId)
      : this.botSerive.startBlackTime();
  }

  startWhiteTime(roomId: string) {
    const data = this.roomManagerService.findRoom({ roomId: roomId });
    return data.matchType === 'H'
      ? this.playerSerive.startWhiteTime(roomId)
      : this.botSerive.startWhiteTime();
  }

  isGameReadyToStart(roomId: string): boolean {
    if (this.roomManagerService.isRoomReadyToStart({ roomId: roomId })) {
      return true;
    }
    return false;
  }
}
