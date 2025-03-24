import { Controller, Get, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async test(@Query('email') email: string) {
    return this.notificationService.test(email);
  }
}
