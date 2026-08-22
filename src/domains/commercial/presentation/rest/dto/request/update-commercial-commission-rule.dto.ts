// -----------------------------------------------------------------------------
// Commercial Commission Rule — Update Request DTO
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
 * Transport DTO for updating a Commercial Commission Rule.
 *
 * The DTO intentionally contains primitive transport values only.
 *
 * Conversion into domain value objects is performed by the REST controller
 * before the UpdateCommercialCommissionRuleCommand is created.
 *
 * The public identity of the rule is supplied through the route parameter and
 * is therefore intentionally not included in this request body.
 */
export class UpdateCommercialCommissionRuleDto {
  // ===========================================================================
  // Commission Policy
  // ===========================================================================

  /**
   * Commission model governed by the rule.
   *
   * Expected values:
   *   BOOKING
   *   EARNING
   */
  @IsString()
  @IsNotEmpty()
  public readonly type!: string;

  /**
   * Commission percentage.
   *
   * Must be between 0 and 100 inclusive.
   * The domain value object enforces the final precision and range rules.
   */
  @IsNumber()
  @Min(0)
  public readonly percentage!: number;

  // ===========================================================================
  // Effective Period
  // ===========================================================================

  /**
   * Timestamp from which the updated rule becomes effective.
   */
  @IsDateString()
  public readonly effectiveFrom!: string;

  /**
   * Optional timestamp at which the updated rule ceases to be effective.
   *
   * Omitted when the rule is open-ended.
   */
  @IsOptional()
  @IsDateString()
  public readonly effectiveTo?: string;

  // ===========================================================================
  // Versioning
  // ===========================================================================

  /**
   * Version of the updated commercial commission policy.
   */
  @IsInt()
  @Min(1)
  public readonly version!: number;

  // ===========================================================================
  // Audit & Traceability
  // ===========================================================================

  /**
   * Timestamp at which the update is applied.
   */
  @IsDateString()
  public readonly updatedAt!: string;

  /**
   * Correlation identifier used to trace the command and resulting domain
   * event through the application workflow.
   */
  @IsString()
  @IsNotEmpty()
  public readonly correlationId!: string;

  /**
   * Optional causation identifier identifying the command or event that
   * caused this update command.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default UpdateCommercialCommissionRuleDto;
