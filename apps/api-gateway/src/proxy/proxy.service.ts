import { Injectable } from '@nestjs/common';
import { HttpProxyService } from './http-proxy.service';

@Injectable()
export class ProxyService {
  constructor(private http: HttpProxyService) {}

  forwardToAuth(path: string, method: string, body?: any, headers?: any) {
    return this.http.forward(method, `${process.env.AUTH_SERVICE_URL}${path}`, body, headers);
  }

  forwardToTasks(path: string, method: string, body?: any, headers?: any) {
    return this.http.forward(method, `${process.env.TASKS_SERVICE_URL}${path}`, body, headers);
  }
}
