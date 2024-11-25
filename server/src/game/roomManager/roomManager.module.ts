import { Module } from '@nestjs/common';
import { RoomManagerService } from './roomManager.service';

@Module({
  providers: [RoomManagerService],
  exports: [RoomManagerService],
})
export class RoomManager {}
