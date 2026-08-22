// -----------------------------------------------------------------------------
// Commercial Earning Commission — Assess Request DTO
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
 * REST request DTO for assessing a Commercial Earning Commission.
 *
 * Assessment represents a lifecycle transition only.
 *
 * The earning commission's financial snapshot is already established when
 * the commission is created and is not recalculated by this operation.
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
 * Those values form the immutable historical assessment snapshot established
 * when the commission was created.
 *
 * The aggregate remains responsible for enforcing intrinsic lifecycle rules,
 * including preventing assessment from an invalid lifecycle state.
 */
export class AssessCommercialEarningCommissionDto {
  // ===========================================================================
  // Commercial Earning Commission
  // ===========================================================================

  /**
   * Public identifier of the Commercial Earning Commission to assess.
   */
  @IsString()
  @IsNotEmpty()
  public readonly publicId!: string;

  // ===========================================================================
  // Assessment
  // ===========================================================================

  /**
   * Timestamp at which the earning commission is assessed.
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
