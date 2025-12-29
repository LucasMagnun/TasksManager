import { Controller, Req, UseGuards, All } from '@nestjs/common';
import { Request } from 'express';
import { ProxyService } from './proxy/proxy.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private proxy: ProxyService) {}

  @UseGuards(JwtAuthGuard)
  @All('tasks/*')
  handleTasks(@Req() req: Request) {
    return this.proxy.forwardToTasks(req.originalUrl.replace('/tasks', ''), req.method, req.body, {
      Authorization: req.headers.authorization,
    });
  }

  @All('auth/*')
  handleAuth(@Req() req: Request) {
    return this.proxy.forwardToAuth(
      req.originalUrl.replace('/auth', ''),
      req.method,
      req.body,
      req.headers,
    );
  }
}
