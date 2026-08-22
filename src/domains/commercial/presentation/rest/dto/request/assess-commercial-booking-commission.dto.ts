// -----------------------------------------------------------------------------
// Commercial Booking Commission — Assess Request DTO
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
 * REST request DTO for assessing a Commercial Booking Commission.
 *
 * Assessment represents the transition of a pending Commercial Booking
 * Commission into its ASSESSED lifecycle state.
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
 * - Booking reference;
 * - Journey reference;
 * - Commercial Commission Rule reference.
 *
 * Those values form the immutable commercial assessment snapshot established
 * when the commission was created.
 *
 * The aggregate remains responsible for enforcing intrinsic lifecycle rules,
 * including preventing assessment from an invalid lifecycle state.
 */
export class AssessCommercialBookingCommissionDto {
  // ===========================================================================
  // Commercial Booking Commission
  // ===========================================================================

  /**
   * Public identity of the Commercial Booking Commission to assess.
   */
  @IsString()
  @IsNotEmpty()
  public readonly publicId!: string;

  // ===========================================================================
  // Assessment
  // ===========================================================================

  /**
   * Timestamp at which the commission assessment is performed.
   */
  @IsDateString()
  public readonly assessedAt!: string;

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
