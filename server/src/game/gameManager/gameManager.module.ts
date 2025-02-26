import { Module } from '@nestjs/common';
import { RoomManager } from '../roomManager/roomManager.module';
import { GameManagerService } from './gameManager.service';

import { Player } from '../player/player.module';
import { Bot } from '../bot/bot.module';

@Module({
  imports: [RoomManager, Player, Bot],
  providers: [GameManagerService],
  exports: [GameManagerService],
})
export class GameManager {}
