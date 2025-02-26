import { Module } from '@nestjs/common';
import { RoomManager } from '../roomManager/roomManager.module';
import { PlayerService } from './player.service';

@Module({
  imports: [RoomManager],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class Player {}
