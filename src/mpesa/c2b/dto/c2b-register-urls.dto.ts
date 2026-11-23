/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 C2B Register URLs DTO
 * -----------------------------------------------------------------------------
 *
 * Validates requests to register the configured C2B validation and
 * confirmation callback URLs with Safaricom Daraja.
 *
 * Architectural rules:
 * - Callback URLs are resolved from the M-PESA provider configuration.
 * - Callback URLs are never supplied directly by the API caller.
 * - Provider identity must be supplied.
 * - ResponseType must be Completed or Cancelled.
 *
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
// Constants
// =============================================================================

export const C2B_RESPONSE_TYPES = ['Completed', 'Cancelled'] as const;

export type C2BResponseType = (typeof C2B_RESPONSE_TYPES)[number];

// =============================================================================
// DTO
// =============================================================================

export class C2BRegisterUrlDto {
  /**
   * Public identifier of the configured M-PESA payment provider.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, {
    message: 'providerPublicId must not contain only whitespace.',
  })
  @MaxLength(50)
  public readonly providerPublicId!: string;

  /**
   * Safaricom response behaviour after successful C2B registration.
   */
  @IsString()
  @IsNotEmpty()
  @IsIn(C2B_RESPONSE_TYPES)
  public readonly responseType!: C2BResponseType;
}

export default C2BRegisterUrlDto;
