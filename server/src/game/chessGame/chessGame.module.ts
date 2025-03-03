import { Module } from '@nestjs/common';
import { ChessGameService } from './chessGame.service';

@Module({
  imports: [],
  providers: [ChessGameService],
  exports: [],
})
export class ChessGame {}
