import { Module } from '@nestjs/common';
import { RoomManager } from '../roomManager/roomManager.module';
import { BotService } from './bot.service';
import { ChessGame } from '../chessGame/chessGame.module';
import { ChessGameService } from '../chessGame/chessGame.service';

@Module({
  imports: [RoomManager, ChessGame],
  providers: [BotService, ChessGameService],
  exports: [BotService],
})
export class Bot {}
