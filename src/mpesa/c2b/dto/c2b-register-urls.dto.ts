/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 C2B Register URLs DTO
 * -----------------------------------------------------------------------------
 *
 * Validates requests to register the configured C2B validation and
 * confirmation URLs with Safaricom Daraja.
 *
 * The callback URLs are resolved from the M-PESA provider configuration.
 * They are not supplied directly by the API caller.
 * -----------------------------------------------------------------------------
 */

import {
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class C2BRegisterUrlDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, {
    message: 'providerPublicId must not contain only whitespace.',
  })
  @MaxLength(50)
  public readonly providerPublicId!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Completed', 'Cancelled'])
  public readonly responseType!: 'Completed' | 'Cancelled';
}

export default C2BRegisterUrlDto;
