import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MpesaB2CResultParameterDto {
  @IsString()
  @IsNotEmpty()
  Key!: string;

  @IsOptional()
  Value?: string | number | boolean | null;
}

export class MpesaB2CResultParametersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MpesaB2CResultParameterDto)
  ResultParameter!: MpesaB2CResultParameterDto[];
}

export class MpesaB2CReferenceItemDto {
  @IsString()
  @IsNotEmpty()
  Key!: string;

  @IsOptional()
  Value?: string | number | boolean | null;
}

export class MpesaB2CReferenceDataDto {
  @ValidateNested()
  @Type(() => MpesaB2CReferenceItemDto)
  ReferenceItem!: MpesaB2CReferenceItemDto;
}

export class MpesaB2CResultDto {
  @IsInt()
  ResultType!: number;

  @IsNumber()
  ResultCode!: number;

  @IsString()
  ResultDesc!: string;

  @IsString()
  @IsNotEmpty()
  OriginatorConversationID!: string;

  @IsString()
  @IsNotEmpty()
  ConversationID!: string;

  @IsString()
  @IsNotEmpty()
  TransactionID!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MpesaB2CResultParametersDto)
  ResultParameters?: MpesaB2CResultParametersDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MpesaB2CReferenceDataDto)
  ReferenceData?: MpesaB2CReferenceDataDto;
}

export class MpesaB2CResultCallbackDto {
  @ValidateNested()
  @Type(() => MpesaB2CResultDto)
  Result!: MpesaB2CResultDto;
}
