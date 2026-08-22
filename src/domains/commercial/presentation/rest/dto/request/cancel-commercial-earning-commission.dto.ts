// -----------------------------------------------------------------------------
// Commercial Earning Commission — Cancel Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for cancelling a Commercial Earning Commission.
 *
 * Cancellation represents a lifecycle transition only.
 *
 * The command does not modify the historical financial snapshot of the
 * commission. Existing base amount, commission amount, net amount, currency,
 * percentage, and Commercial Commission Rule reference remain preserved for
 * auditability.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * Conversion into Commercial Earning Commission value objects belongs to the
 * application boundary and must not be performed inside the domain entity
 * or aggregate.
 *
 * The DTO does not accept or modify:
 *
 * - commission percentage;
 * - base amount;
 * - commission amount;
 * - net amount;
 * - currency;
 * - Commercial Commission Rule reference;
 * - Journey reference;
 * - Settlement reference;
 * - Provider reference.
 *
 * Those values form the immutable historical financial snapshot established
 * when the commission was created.
 *
 * The aggregate remains responsible for enforcing intrinsic lifecycle rules
 * governing cancellation.
 */
export class CancelCommercialEarningCommissionDto {
  // ===========================================================================
  // Commercial Earning Commission
  // ===========================================================================

  /**
   * Public identifier of the Commercial Earning Commission to cancel.
   */
  @IsString()
  @IsNotEmpty()
  public readonly publicId!: string;

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  /**
   * Timestamp at which the earning commission is cancelled.
   */
  @IsDateString()
  public readonly cancelledAt!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for distributed tracing and domain-event
   * correlation.
   *
   * This value is supplied by the application/request boundary rather than
   * being persisted as part of the Commercial Earning Commission entity.
   */
  @IsString()
  @IsNotEmpty()
  public readonly correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command or event that caused this operation.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;
}
