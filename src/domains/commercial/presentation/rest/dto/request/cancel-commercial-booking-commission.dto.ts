// -----------------------------------------------------------------------------
// Commercial Booking Commission — Cancel Request DTO
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
 * REST request DTO for cancelling a Commercial Booking Commission.
 *
 * Cancellation represents the transition of a Commercial Booking Commission
 * into its CANCELLED lifecycle state.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * Conversion into Commercial Booking Commission value objects belongs to the
 * application boundary and must not be performed inside the domain entity
 * or aggregate.
 *
 * The DTO does not accept or modify:
 *
 * - commission percentage;
 * - base amount;
 * - commission amount;
 * - currency;
 * - Commercial Commission Rule reference;
 * - Booking reference;
 * - Journey reference.
 *
 * Those values form the immutable commercial assessment snapshot established
 * when the commission was created.
 *
 * The aggregate remains responsible for enforcing intrinsic lifecycle rules
 * governing cancellation.
 *
 * If the commission was previously assessed, its assessedAt timestamp remains
 * preserved by the domain entity so that the historical assessment fact is
 * not lost.
 */
export class CancelCommercialBookingCommissionDto {
  // ===========================================================================
  // Commercial Booking Commission
  // ===========================================================================

  /**
   * Public identity of the Commercial Booking Commission to cancel.
   */
  @IsString()
  @IsNotEmpty()
  public readonly publicId!: string;

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  /**
   * Timestamp at which the commission cancellation is performed.
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
   * being persisted as part of the Commercial Booking Commission entity.
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
