/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 STK Push Request DTO
 * -----------------------------------------------------------------------------
 *
 * Validates customer payment initiation requests before they reach the
 * M-PESA STK Push service.
 *
 * Required information:
 * - Configured M-PESA provider public ID.
 * - Customer phone number.
 * - Transaction amount.
 * - Account reference.
 * - Transaction description.
 *
 * Architectural boundary:
 * - This DTO validates transport input only.
 * - FinancialModule owns payment creation and financial state transitions.
 * - The M-PESA module must not create or modify financial records.
 *
 * -----------------------------------------------------------------------------
 */

import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class StkPushRequestDto {
  /**
   * Public ID of the configured M-PESA payment provider.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  providerPublicId!: string;

  /**
   * Customer phone number in international Kenyan format.
   *
   * Accepted formats:
   * - 2547XXXXXXXX
   * - 2541XXXXXXXX
   *
   * The service may normalize supported local formats before
   * communicating with Daraja, but this DTO requires international format.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?:2547|2541)\d{8}$/, {
    message: 'Phone number must be in 2547XXXXXXXX or 2541XXXXXXXX format.',
  })
  phoneNumber!: string;

  /**
   * Transaction amount in Kenyan Shillings.
   *
   * Daraja STK Push uses whole-number amounts.
   */
  @IsInt({
    message: 'Amount must be a whole number.',
  })
  @Min(1, {
    message: 'Amount must be greater than zero.',
  })
  @Max(250000, {
    message: 'Amount exceeds the configured STK Push request limit.',
  })
  amount!: number;

  /**
   * Customer account reference.
   *
   * Maximum length: 12 characters.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'Account reference must contain only letters and numbers.',
  })
  @MaxLength(12)
  accountReference!: string;

  /**
   * Transaction description.
   *
   * Maximum length: 13 characters.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(13)
  transactionDescription!: string;

  /**
   * Optional SisiMove internal payment reference.
   *
   * Used only for correlation with a FinancialModule payment.
   *
   * This value does not authorize the M-PESA module to create,
   * update or transition a financial payment.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  paymentReference?: string;
}

// =============================================================================
// Default Export
// =============================================================================

export default StkPushRequestDto;
