import { Module } from '@nestjs/common';
import { RoomManager } from '../roomManager/roomManager.module';
import { GameManagerService } from './gameManager.service';

@Module({
  imports: [RoomManager],
  providers: [GameManagerService],
  exports: [GameManagerService],
})
export class GameManager {}
