import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { HttpProxyService } from './http-proxy.service';

@Module({
  providers: [ProxyService, HttpProxyService],
  exports: [ProxyService],
})
export class ProxyModule {}
