// -----------------------------------------------------------------------------
// Commercial Commission Rule — Create Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsDateString,
  IsInt,
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
 * REST request DTO for creating a Commercial Commission Rule.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * Conversion into Commercial Commission Rule value objects belongs to the
 * application boundary and must not be performed inside the domain entity
 * or aggregate.
 *
 * The DTO does not expose:
 *
 * - commission rule public ID;
 * - lifecycle status;
 * - lifecycle timestamps;
 * - activation state;
 * - domain events.
 *
 * Those values are owned by the Commercial Commission Rule domain.
 *
 * An undefined effectiveTo represents an open-ended commission rule.
 */
export class CreateCommercialCommissionRuleDto {
  // ===========================================================================
  // Commission Type
  // ===========================================================================

  /**
   * Commission type governed by the rule.
   */
  @IsString()
  @IsNotEmpty()
  public readonly type!: string;

  // ===========================================================================
  // Commission Percentage
  // ===========================================================================

  /**
   * Commission percentage applied by the rule.
   *
   * Domain-specific percentage constraints are enforced by the corresponding
   * CommercialCommissionPercentage value object.
   */
  @IsNumber()
  @Min(0)
  public readonly percentage!: number;

  // ===========================================================================
  // Effective From
  // ===========================================================================

  /**
   * Timestamp from which the commission rule becomes effective.
   */
  @IsDateString()
  public readonly effectiveFrom!: string;

  // ===========================================================================
  // Effective To
  // ===========================================================================

  /**
   * Optional timestamp at which the commission rule ceases to be effective.
   *
   * Omitted when the rule is open-ended.
   */
  @IsOptional()
  @IsDateString()
  public readonly effectiveTo?: string;

  // ===========================================================================
  // Version
  // ===========================================================================

  /**
   * Version of the commercial commission policy.
   */
  @IsInt()
  @Min(1)
  public readonly version!: number;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for distributed tracing and domain-event
   * correlation.
   *
   * This value is supplied by the application/request boundary rather than
   * being persisted as part of the Commercial Commission Rule entity.
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
