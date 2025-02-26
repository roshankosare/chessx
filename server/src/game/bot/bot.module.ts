import { Module } from '@nestjs/common';
import { RoomManager } from '../roomManager/roomManager.module';
import { BotService } from './bot.service';

@Module({
  imports: [RoomManager],
  providers: [BotService],
  exports: [BotService],
})
export class Bot {}
