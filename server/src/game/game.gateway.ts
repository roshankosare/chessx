import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameManagerService } from './gameManager/gameManager.service';
import { Square } from 'chess.js';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gameManagerService: GameManagerService) {}
  @WebSocketServer()
  io: Server;

  handleConnection(client: Socket) {
    console.log(`user connected with id: ${client.id}`);
    client.emit('connected', { socketId: client.id });
  }

  handleDisconnect(client: Socket) {
    console.log(`user disconnected with id: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { id: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const roomId = this.gameManagerService.joinRoom(data.id, 5);
      if (roomId) {
        client.join(roomId);
        client.emit('room-joined', {
          roomId: roomId,
          playerId: data.id,
        });
        if (this.gameManagerService.isGameReadyToStart(roomId)) {
          this.io.to(roomId).emit('game-started');
          const intervalId = setInterval(() => {
            const room = this.gameManagerService.getGameInfo(roomId);
            this.io.to(roomId).emit('clock-update', {
              whiteRemainigTime: room.playerWhiteRemainingTime,
              blackRemainigTime: room.playerBlackRemainingTime,
            });
            if (room.playerWhiteRemainingTime <= 0) {
              clearInterval(intervalId);
            }
            if (room.playerBlackRemainingTime <= 0) {
              clearInterval(intervalId);
            }
          }, 1000);
          return;
        }
        return client.emit('waiting', { roomId: roomId, playerId: data.id });
      }
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('get-game-info')
  handleGetGameInfo(
    @MessageBody() data: { roomId: string; playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = this.gameManagerService.getGameInfo(data.roomId);

      if (!room) {
        return;
      }
      if (room.playerWhite === data.playerId)
        client.emit('game-info', {
          user: {
            username: 'user',
            remainingTime: room.playerWhiteRemainingTime,
          },
          oponent: {
            username: 'oponent',
            remainingTime: room.playerBlackRemainingTime,
          },
          playingAs: 'w',
        });

      if (room.playerBlack === data.playerId)
        client.emit('game-info', {
          user: {
            username: 'user',
            remainingTime: room.playerBlackRemainingTime,
          },
          oponent: {
            username: 'oponent',
            remainingTime: room.playerWhiteRemainingTime,
          },
          playingAs: 'b',
        });
    } catch (error) {
      console.log(error);
    }
  }
  @SubscribeMessage('get-game-pos')
  handleGetGamePos(
    @MessageBody() data: { roomId: string; playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = this.gameManagerService.getGameInfo(data.roomId);
      if (!room) {
        return;
      }
      const gamePos = this.gameManagerService.getGamePosition(
        data.playerId,
        data.roomId,
      );
      if (gamePos) {
        client.emit('game-pos', {
          gameState: gamePos,
        });
      }
      return;
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('get-pos-moves')
  handleGetPosMoves(
    @MessageBody() data: { square: string; roomId: string; playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.gameManagerService.getGameInfo(data.roomId);
    if (!room) {
      return;
    }
    const square: Square = data.square as Square;

    const posMoves = this.gameManagerService.getPosMoves(
      data.playerId,
      data.roomId,
      square,
    );

    if (posMoves) {
      return client.emit('pos-moves', { moves: posMoves });
    }
    return;
  }

  @SubscribeMessage('make-move')
  handleMakeMove(
    @MessageBody()
    data: { from: string; to: string; roomId: string; playerId: string },
    // @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = this.gameManagerService.getGameInfo(data.roomId);
      if (!room) {
        return;
      }

      this.gameManagerService.makeMove(
        { from: data.from, to: data.to },
        data.playerId,
        data.roomId,
      );
      this.io.to(data.roomId).emit('refresh-game-status');
      return;
    } catch (error) {
      console.log(error);
    }
  }
}
