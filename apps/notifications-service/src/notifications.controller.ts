import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @EventPattern('task.created')
  async handleTaskCreated(@Payload() data: any) {
    await this.service.notifyTaskCreated(data);
  }
}
