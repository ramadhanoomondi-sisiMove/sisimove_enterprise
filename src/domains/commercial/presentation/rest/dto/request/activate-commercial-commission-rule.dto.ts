// -----------------------------------------------------------------------------
// Commercial Commission Rule — Activate Request DTO
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
 * REST request DTO for activating a Commercial Commission Rule.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * Conversion into Commercial Commission Rule value objects belongs to the
 * application boundary and must not be performed inside the domain entity
 * or aggregate.
 *
 * The DTO does not expose:
 *
 * - commission rule status;
 * - effective period;
 * - commission percentage;
 * - commission type;
 * - lifecycle timestamps owned by the domain.
 *
 * The aggregate remains responsible for enforcing intrinsic lifecycle rules,
 * including preventing an already-active rule from being activated again.
 */
export class ActivateCommercialCommissionRuleDto {
  // ===========================================================================
  // Commercial Commission Rule
  // ===========================================================================

  /**
   * Public identity of the Commercial Commission Rule to activate.
   */
  @IsString()
  @IsNotEmpty()
  public readonly publicId!: string;

  // ===========================================================================
  // Activation
  // ===========================================================================

  /**
   * Timestamp at which the activation is requested.
   */
  @IsDateString()
  public readonly activatedAt!: string;

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
