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
import { DiLevel, GameTime } from './roomManager/room.interface';

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
    try {
      if (client.handshake.auth.socketId && client.handshake.auth.roomId) {
        const roomId = client.handshake.auth.roomId;
        const socketId = client.handshake.auth.socketId;
        const room = this.gameManagerService.getGameInfo(roomId);
        if (!room || room.gameResult) {
          client.emit('game-not-found');
          return;
        }
        console.log(room.playerBlack === socketId);
        console.log(room.playerWhite === socketId);

        this.io.sockets.sockets.get(socketId)?.disconnect(true);
        this.gameManagerService.updataGame(roomId, {
          playerBlack:
            room.playerBlack === socketId ? client.id : room.playerBlack,
          playerWhite:
            room.playerWhite === socketId ? client.id : room.playerWhite,
        });

        console.log(`user Reconnected with id: ${client.id}`);
        client.join(roomId);
        client.emit('reconnection', {
          socketId: client.id,
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
    console.log(`user connected with id: ${client.id}`);
    client.emit('connected', { socketId: client.id });
  }

  handleDisconnect(client: Socket) {
    console.log(`user disconnected with id: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody()
    data: {
      id: string;
      time: number;
      opponent: 'H' | 'M';
      diLevel: DiLevel;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const id = data.id;
      const time = data.time;
      const opponent: 'H' | 'M' = data.opponent;
      const diLevel = data.diLevel;

      if (!id && !time && !opponent) {
        return;
      }

      const roomId = this.gameManagerService.joinRoom(
        id,
        time as GameTime,
        opponent,
        diLevel,
      );
      if (roomId) {
        client.join(roomId);
        client.emit('room-joined', {
          roomId: roomId,
          playerId: data.id,
        });

        if (this.gameManagerService.isGameReadyToStart(roomId)) {
          const room = this.gameManagerService.getGameInfo(roomId);

          if (room.matchType === 'H') {
            this.gameManagerService.startWhiteTime(roomId);
            const intervalId = setInterval(() => {
              const room = this.gameManagerService.getGameInfo(roomId);

              this.io.to(roomId).emit('clock-update', {
                whiteRemainigTime: room.playerWhiteRemainingTime,
                blackRemainigTime: room.playerBlackRemainingTime,
              });
              if (room.playerWhiteRemainingTime <= 0) {
                this.gameManagerService.setGameOverInfo(roomId);
                this.io.to(roomId).emit('game-over');
                clearInterval(intervalId);
              }
              if (room.playerBlackRemainingTime <= 0) {
                this.gameManagerService.setGameOverInfo(roomId);
                this.io.to(roomId).emit('game-over');
                clearInterval(intervalId);
              }
            }, 1000);
          }

          this.io.to(roomId).emit('game-started');

          if (room.playerWhite === 'BOT') {
            setTimeout(() => {
              try {
                this.handleMakeMove({
                  from: '',
                  to: '',
                  promotionPiece: null,
                  playerId: 'BOT',
                  roomId: roomId,
                });
              } catch (error) {
                console.log(error);
              }
            }, 300);
            return;
          }
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
      const roomId = data.roomId;
      const playerId = data.playerId;
      if (!roomId || !playerId) {
        return;
      }
      const room = this.gameManagerService.getGameInfo(roomId);

      if (!room) {
        return;
      }
      if (room.playerWhite === playerId)
        client.emit('game-info', {
          user: {
            username: room.playerWhiteUsername,
            remainingTime: room.playerWhiteRemainingTime,
          },
          oponent: {
            username: room.playerBlackUsername,
            remainingTime: room.playerBlackRemainingTime,
          },
          playingAs: 'w',
        });

      if (room.playerBlack === playerId)
        client.emit('game-info', {
          user: {
            username: room.playerBlackUsername,
            remainingTime: room.playerBlackRemainingTime,
          },
          oponent: {
            username: room.playerWhiteUsername,
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
      const roomId = data.roomId;
      const playerId = data.playerId;
      if (!roomId || !playerId) {
        return;
      }
      const room = this.gameManagerService.getGameInfo(roomId);
      if (!room) {
        return;
      }
      const pos = this.gameManagerService.getGamePosition(playerId, roomId);
      if (pos) {
        client.emit('game-pos', {
          gamePos: pos.gamePos,
          whiteCapturedPieces: pos.whiteCapturedPieces,
          blackCapturedPieces: pos.blackCapturedPieces,
          moveHistory: pos.moveHistory,
          lastMove: pos.lastMove,
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
    const roomId = data.roomId;
    const playerId = data.playerId;
    if (!roomId || !playerId) {
      return;
    }
    const room = this.gameManagerService.getGameInfo(roomId);
    if (!room) {
      return;
    }
    const square: Square = data.square as Square;

    const posMoves = this.gameManagerService.getPosMoves(
      playerId,
      roomId,
      square,
    );

    if (posMoves) {
      return client.emit('pos-moves', { moves: posMoves });
    }
    return;
  }

  @SubscribeMessage('make-move')
  async handleMakeMove(
    @MessageBody()
    data: {
      from: string;
      to: string;
      promotionPiece: string;
      roomId: string;
      playerId: string;
    },
    // @ConnectedSocket() client: Socket,
  ) {
    try {
      const roomId = data.roomId;
      const playerId = data.playerId;
      const from = data.from;
      const to = data.to;
      if (!roomId || !playerId) {
        return;
      }
      const room = this.gameManagerService.getGameInfo(roomId);
      if (!room) {
        return;
      }

      let result = await this.gameManagerService.makeMove(
        { from: from, to: to, promotion: data.promotionPiece },
        playerId,
        roomId,
      );

      this.io.to(data.roomId).emit('refresh-game-status');

      if (result === 'gameover') {
        return this.io.to(data.roomId).emit('game-over');
      }
      let botMoveResult;
      if (room.matchType === 'M') {
        setTimeout(async () => {
          try {
            botMoveResult = await this.gameManagerService.makeMove(
              { from: '', to: '' },
              'BOT',
              roomId,
            );
            this.io.to(data.roomId).emit('refresh-game-status');
            if (botMoveResult == 'gameover') {
              this.io.to(data.roomId).emit('game-over');
            }
          } catch (error) {}
        }, 800);
      }
      return;
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('resign-game')
  handleResignGame(@MessageBody() data: { roomId: string; playerId: string }) {
    const roomId = data.roomId;
    const playerId = data.playerId;
    if (!roomId || !playerId) {
      return;
    }
    try {
      const room = this.gameManagerService.getGameInfo(data.roomId);
      if (!room) {
        return;
      }

      this.gameManagerService.resignGame(roomId, playerId);
      this.io.to(roomId).emit('game-over');
      return;
    } catch (error) {
      console.log(error);
    }
  }
  @SubscribeMessage('get-game-over-info')
  handleGameOverInfo(
    @MessageBody() data: { square: string; roomId: string; playerId: string },
  ) {
    try {
      const roomId = data.roomId;
      const playerId = data.playerId;
      if (!roomId || !playerId) {
        return;
      }
      const room = this.gameManagerService.getGameInfo(roomId);
      if (!room) {
        return;
      }

      this.io.to(data.roomId).emit('game-over-info', {
        wins:
          room.gameResult === 'b'
            ? 'b'
            : room.gameResult === 'w'
              ? 'w'
              : room.gameResult === 'd'
                ? 'd'
                : 's',
        method: room.gameResultCause,
      });
      return;
    } catch (error) {
      console.log(error);
    }
  }
}
