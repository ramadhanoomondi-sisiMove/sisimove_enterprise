import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MpesaHttpClient {
  public constructor(private readonly httpService: HttpService) {}

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return firstValueFrom(this.httpService.get<T>(url, config));
  }

  public async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return firstValueFrom(this.httpService.post<T>(url, data, config));
  }
}

export default MpesaHttpClient;
