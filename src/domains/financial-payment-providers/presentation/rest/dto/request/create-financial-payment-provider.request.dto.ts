import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, type TransformFnParams } from 'class-transformer';

import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
  ArrayUnique,
} from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Capability DTO
// -----------------------------------------------------------------------------

export class CreateFinancialPaymentProviderCapabilityRequestDto {
  @ApiProperty({
    example: 'INITIATE_PAYMENT',
    enum: [
      'INITIATE_PAYMENT',
      'VERIFY_PAYMENT',
      'QUERY_PAYMENT',
      'REFUND_PAYMENT',
      'INITIATE_DISBURSEMENT',
      'VERIFY_DISBURSEMENT',
      'QUERY_BALANCE',
      'WEBHOOKS',
    ],
  })
  @Transform(trimString)
  @IsString()
  @IsIn([
    'INITIATE_PAYMENT',
    'VERIFY_PAYMENT',
    'QUERY_PAYMENT',
    'REFUND_PAYMENT',
    'INITIATE_DISBURSEMENT',
    'VERIFY_DISBURSEMENT',
    'QUERY_BALANCE',
    'WEBHOOKS',
  ])
  type!: string;

  @ApiProperty({
    example: true,
    description: 'Whether the provider integration implements this capability.',
  })
  @IsBoolean()
  isSupported!: boolean;
}

// -----------------------------------------------------------------------------
// Provider Create DTO
// -----------------------------------------------------------------------------

export class CreateFinancialPaymentProviderRequestDto {
  @ApiProperty({
    example: 'MPESA',
    maxLength: 50,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/)
  code!: string;

  @ApiProperty({
    example: 'M-Pesa Kenya',
    maxLength: 120,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @ApiProperty({
    example: 'MOBILE_MONEY',
    enum: [
      'MOBILE_MONEY',
      'BANK',
      'CARD_PROCESSOR',
      'PAYMENT_GATEWAY',
      'DIGITAL_WALLET',
      'OTHER',
    ],
  })
  @Transform(trimString)
  @IsIn([
    'MOBILE_MONEY',
    'BANK',
    'CARD_PROCESSOR',
    'PAYMENT_GATEWAY',
    'DIGITAL_WALLET',
    'OTHER',
  ])
  type!: string;

  @ApiProperty({
    example: 'SANDBOX',
    enum: ['SANDBOX', 'PRODUCTION'],
  })
  @Transform(trimString)
  @IsIn(['SANDBOX', 'PRODUCTION'])
  environment!: string;

  @ApiPropertyOptional({
    example: 'Mobile money payment provider for Kenya.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    example: 'secret-manager/financial/mpesa-ke',
    maxLength: 255,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  configurationReference?: string;

  @ApiPropertyOptional({
    type: [CreateFinancialPaymentProviderCapabilityRequestDto],
    description: 'Capabilities implemented by this provider.',
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique(
    (capability: CreateFinancialPaymentProviderCapabilityRequestDto) =>
      capability.type,
  )
  @ValidateNested({ each: true })
  @Type(() => CreateFinancialPaymentProviderCapabilityRequestDto)
  capabilities?: CreateFinancialPaymentProviderCapabilityRequestDto[];
}

export default CreateFinancialPaymentProviderRequestDto;
