import { Module } from '@nestjs/common';
import { RoomManager } from '../roomManager/roomManager.module';
import { PlayerService } from './player.service';
import { ChessGameService } from '../chessGame/chessGame.service';
import { ChessGame } from '../chessGame/chessGame.module';

@Module({
  imports: [RoomManager, ChessGame],
  providers: [PlayerService, ChessGameService],
  exports: [PlayerService],
})
export class Player {}
