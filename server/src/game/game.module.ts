import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameManager } from './gameManager/gameManager.module';

@Module({
  imports: [GameManager],
  providers: [GameGateway],
})
export class GameModule {}
