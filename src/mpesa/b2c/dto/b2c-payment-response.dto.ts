/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 B2C Payment Response DTO
 * -----------------------------------------------------------------------------
 *
 * Represents the immediate response returned by Safaricom Daraja after
 * submitting a B2C business payment request.
 *
 * A successful submission means the request was accepted for processing.
 * Final disbursement status is determined through the B2C result callback.
 *
 * This DTO does not perform financial state transitions.
 * -----------------------------------------------------------------------------
 */

import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class B2CPaymentResponseDto {
  /**
   * Safaricom originator conversation identifier.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  public readonly OriginatorConversationID!: string;

  /**
   * Safaricom conversation identifier.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  public readonly ConversationID!: string;

  /**
   * Daraja response code.
   *
   * "0" indicates that the request was accepted.
   */
  @IsString()
  @IsNotEmpty()
  public readonly ResponseCode!: string;

  /**
   * Daraja response description.
   */
  @IsString()
  @IsNotEmpty()
  public readonly ResponseDescription!: string;

  /**
   * Optional provider error code.
   */
  @IsOptional()
  @IsString()
  public readonly errorCode?: string;

  /**
   * Optional provider error message.
   */
  @IsOptional()
  @IsString()
  public readonly errorMessage?: string;
}

export default B2CPaymentResponseDto;
