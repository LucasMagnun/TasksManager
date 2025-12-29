import { Injectable, HttpException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

@Injectable()
export class HttpProxyService {
  async forward(method: string, url: string, data?: any, headers?: any) {
    try {
      const response = await axios({
        method,
        url,
        data,
        headers,
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new HttpException(
        axiosError.response?.data || 'Proxy error',
        axiosError.response?.status || 500,
      );
    }
  }
}
