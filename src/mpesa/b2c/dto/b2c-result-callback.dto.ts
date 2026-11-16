
/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 B2C Result Callback DTO
 * -----------------------------------------------------------------------------
 *
 * Represents the B2C result callback payload received from Safaricom Daraja.
 *
 * The callback reports the final provider processing outcome, including
 * successful and failed business payouts.
 *
 * This DTO describes the provider payload only.
 * FinancialModule owns disbursement reconciliation and financial effects.
 * -----------------------------------------------------------------------------
 */

import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
  ValidateIf,
} from 'class-validator';

import { Type } from 'class-transformer';

// =============================================================================
// RESULT PARAMETER
// =============================================================================

export class B2CResultParameterDto {
  @IsString()
  @IsNotEmpty()
  public readonly Key!: string;

  @ValidateIf((_object, value) => value !== undefined && value !== null)
  @IsString()
  public readonly Value?: string;
}

// =============================================================================
// RESULT PARAMETERS
// =============================================================================

export class B2CResultParametersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => B2CResultParameterDto)
  public readonly ResultParameter!: B2CResultParameterDto[];
}

// =============================================================================
// REFERENCE ITEM
// =============================================================================

export class B2CReferenceItemDto {
  @IsString()
  @IsNotEmpty()
  public readonly Key!: string;

  @ValidateIf((_object, value) => value !== undefined && value !== null)
  @IsString()
  public readonly Value?: string;
}

// =============================================================================
// REFERENCE DATA
// =============================================================================

export class B2CReferenceDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => B2CReferenceItemDto)
  public readonly ReferenceItem!: B2CReferenceItemDto[];
}

// =============================================================================
// RESULT
// =============================================================================

export class B2CResultDto {
  @IsInt()
  public readonly ResultType!: number;

  @IsInt()
  public readonly ResultCode!: number;

  @IsString()
  @IsNotEmpty()
  public readonly ResultDesc!: string;

  @IsString()
  @IsNotEmpty()
  public readonly OriginatorConversationID!: string;

  @IsString()
  @IsNotEmpty()
  public readonly ConversationID!: string;

  @IsOptional()
  @IsString()
  public readonly TransactionID?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => B2CResultParametersDto)
  public readonly ResultParameters?: B2CResultParametersDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => B2CReferenceDataDto)
  public readonly ReferenceData?: B2CReferenceDataDto;
}

// =============================================================================
// CALLBACK
// =============================================================================

export class B2CResultCallbackDto {
  @IsObject()
  @ValidateNested()
  @Type(() => B2CResultDto)
  public readonly Result!: B2CResultDto;
}

export default B2CResultCallbackDto;
