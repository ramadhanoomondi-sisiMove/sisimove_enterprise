import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { MpesaHttpClient } from './mpesa-http.client';

@Module({
  imports: [
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 0,
    }),
  ],

  providers: [MpesaHttpClient],

  exports: [MpesaHttpClient],
})
export class MpesaHttpModule {}

export default MpesaHttpModule;
