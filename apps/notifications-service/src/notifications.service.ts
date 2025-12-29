import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly gateway: NotificationsGateway) {}

  async notifyTaskCreated(payload: { taskId: string; userId: string; title: string }) {
    console.log(' Notificação recebida:', payload);

    // Emitir via websocket
    this.gateway.emitToUser(payload.userId, {
      type: 'TASK_CREATED',
      data: payload,
    });
  }
}
