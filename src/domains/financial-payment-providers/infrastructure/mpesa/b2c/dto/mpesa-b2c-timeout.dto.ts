import { Allow, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MpesaB2CTimeoutDto {
  @Allow()
  @IsOptional()
  ResultType?: number | string;

  @Allow()
  @IsOptional()
  ResultCode?: number | string;

  @IsOptional()
  @IsString()
  ResultDesc?: string;

  @IsOptional()
  @IsString()
  OriginatorConversationID?: string;

  @IsOptional()
  @IsString()
  ConversationID?: string;

  /**
   * Allows additional Safaricom timeout fields without rejecting
   * the callback because of fields not explicitly modelled here.
   */
  [key: string]: unknown;
}

export class MpesaB2CTimeoutCallbackDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => MpesaB2CTimeoutDto)
  Result?: MpesaB2CTimeoutDto;

  /**
   * Allows additional top-level provider fields.
   */
  [key: string]: unknown;
}
