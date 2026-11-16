/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 C2B Register URLs Response DTO
 * -----------------------------------------------------------------------------
 *
 * Represents the response returned by Safaricom Daraja after submitting
 * a C2B validation and confirmation URL registration request.
 *
 * This DTO describes the provider response only. It does not update
 * FinancialModule payment or provider state.
 * -----------------------------------------------------------------------------
 */

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class C2BRegisterResponseDto {
  @IsString()
  @IsNotEmpty()
  public readonly OriginatorCoversationID!: string;

  @IsString()
  @IsNotEmpty()
  public readonly ResponseCode!: string;

  @IsString()
  @IsNotEmpty()
  public readonly ResponseDescription!: string;

  @IsOptional()
  @IsString()
  public readonly errorCode?: string;

  @IsOptional()
  @IsString()
  public readonly errorMessage?: string;
}

export default C2BRegisterResponseDto;
