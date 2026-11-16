/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 B2C Payment Request DTO
 * -----------------------------------------------------------------------------
 *
 * Validates business payout requests before they reach the B2C service.
 *
 * Supported payout classifications:
 * - JOURNEY_EARNINGS
 * - COMMISSION
 * - SETTLEMENT
 *
 * Initiator credentials, SecurityCredential, shortcode, callback URLs and
 * Daraja CommandID are resolved by the backend configuration/service.
 *
 * Employee salaries and promotional rewards are not supported.
 * -----------------------------------------------------------------------------
 */

import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

// =============================================================================
// TYPES
// =============================================================================

export const B2CPayoutTypes = [
  'JOURNEY_EARNINGS',
  'COMMISSION',
  'SETTLEMENT',
] as const;

export type B2CPayoutType = (typeof B2CPayoutTypes)[number];

// =============================================================================
// DTO
// =============================================================================

export class B2CPaymentRequestDto {
  /**
   * Public ID of the configured M-PESA provider.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, {
    message: 'Provider public ID must not contain only whitespace.',
  })
  @MaxLength(50)
  public readonly providerPublicId!: string;

  /**
   * Recipient phone number.
   *
   * Accepted formats:
   * 2547XXXXXXXX
   * 2541XXXXXXXX
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^254(?:7|1)\d{8}$/, {
    message: 'Phone number must be in 2547XXXXXXXX or 2541XXXXXXXX format.',
  })
  public readonly phoneNumber!: string;

  /**
   * Payout amount in Kenyan Shillings.
   *
   * Daraja B2C payments use whole-number amounts.
   */
  @IsInt({
    message: 'Amount must be a whole number.',
  })
  @Min(1, {
    message: 'Amount must be greater than zero.',
  })
  public readonly amount!: number;

  /**
   * SisiMove business payout classification.
   *
   * All supported classifications use Daraja's BusinessPayment CommandID.
   * The distinction is retained in SisiMove's internal payment metadata.
   */
  @IsString()
  @IsIn(B2CPayoutTypes, {
    message: 'Payout type must be JOURNEY_EARNINGS, COMMISSION, or SETTLEMENT.',
  })
  public readonly payoutType!: B2CPayoutType;

  /**
   * Description of the business payout.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, {
    message: 'Remarks must not contain only whitespace.',
  })
  @MaxLength(100)
  public readonly remarks!: string;

  /**
   * Optional additional payout reference or occasion.
   */
  @IsOptional()
  @IsString()
  @Matches(/\S/, {
    message: 'Occasion must not contain only whitespace.',
  })
  @MaxLength(100)
  public readonly occasion?: string;

  /**
   * Optional SisiMove internal payment reference.
   *
   * Used to correlate the Daraja request with the internal payment.
   */
  @IsOptional()
  @IsString()
  @Matches(/\S/, {
    message: 'Payment reference must not contain only whitespace.',
  })
  @MaxLength(100)
  public readonly paymentReference?: string;
}

export default B2CPaymentRequestDto;
