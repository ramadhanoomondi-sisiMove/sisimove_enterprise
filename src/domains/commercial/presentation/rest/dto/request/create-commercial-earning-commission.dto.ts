// -----------------------------------------------------------------------------
// Commercial Earning Commission — Create Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for creating a Commercial Earning Commission.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * Conversion into Commercial Earning Commission value objects belongs to the
 * application boundary and must not be performed inside the domain entity
 * or aggregate.
 *
 * The DTO captures the complete commercial earning assessment snapshot:
 *
 * - Commercial Commission Rule reference;
 * - Journey reference;
 * - Settlement reference;
 * - Provider reference;
 * - commission percentage;
 * - provider earning before commission;
 * - commission amount retained by the platform;
 * - provider net earning after commission;
 * - currency.
 *
 * These values become historical snapshots on the Commercial Earning
 * Commission entity and remain stable even when the underlying Commercial
 * Commission Rule changes later.
 *
 * The DTO does not expose:
 *
 * - commission public ID;
 * - lifecycle status;
 * - assessed timestamp;
 * - cancelled timestamp;
 * - lifecycle events.
 *
 * Those values are owned by the Commercial Earning Commission domain.
 *
 * A newly created Commercial Earning Commission begins in PENDING state.
 * Assessment and cancellation are handled by their respective commands.
 */
export class CreateCommercialEarningCommissionDto {
  // ===========================================================================
  // Commercial Commission Rule
  // ===========================================================================

  /**
   * Public identity of the Commercial Commission Rule used to produce this
   * earning commission assessment.
   */
  @IsString()
  @IsNotEmpty()
  public readonly commissionRulePublicId!: string;

  // ===========================================================================
  // Journey
  // ===========================================================================

  /**
   * Public identity of the Journey whose provider earning is subject to the
   * commission.
   */
  @IsString()
  @IsNotEmpty()
  public readonly journeyPublicId!: string;

  // ===========================================================================
  // Settlement
  // ===========================================================================

  /**
   * Public identity of the Settlement from which the provider earning was
   * derived.
   */
  @IsString()
  @IsNotEmpty()
  public readonly settlementPublicId!: string;

  // ===========================================================================
  // Provider
  // ===========================================================================

  /**
   * Public identity of the provider whose earning is subject to the
   * commission.
   *
   * Identity belongs to the Identity bounded context and is represented here
   * only through its public identifier.
   */
  @IsString()
  @IsNotEmpty()
  public readonly providerPublicId!: string;

  // ===========================================================================
  // Commission Percentage
  // ===========================================================================

  /**
   * Commission percentage captured as part of the earning assessment
   * snapshot.
   */
  @IsNumber()
  @Min(0)
  public readonly percentage!: number;

  // ===========================================================================
  // Base Amount
  // ===========================================================================

  /**
   * Provider earning before the Commercial commission.
   */
  @IsNumber()
  @Min(0)
  public readonly baseAmount!: number;

  // ===========================================================================
  // Commission Amount
  // ===========================================================================

  /**
   * Commission amount retained by the platform.
   *
   * This is a persisted historical assessment snapshot and is not
   * recalculated by the aggregate lifecycle.
   */
  @IsNumber()
  @Min(0)
  public readonly commissionAmount!: number;

  // ===========================================================================
  // Net Amount
  // ===========================================================================

  /**
   * Provider earning remaining after the Commercial commission.
   *
   * This value is captured as part of the historical assessment snapshot.
   * Additional net-earning invariants are enforced by the corresponding
   * CommercialEarningCommissionNetAmount value object.
   */
  @IsNumber()
  @Min(0)
  public readonly netAmount!: number;

  // ===========================================================================
  // Currency
  // ===========================================================================

  /**
   * Currency in which the earning commission assessment is denominated.
   */
  @IsString()
  @IsNotEmpty()
  public readonly currency!: string;

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
