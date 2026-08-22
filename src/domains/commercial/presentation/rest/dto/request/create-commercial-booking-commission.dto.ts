// -----------------------------------------------------------------------------
// Commercial Booking Commission — Create Request DTO
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
 * REST request DTO for creating a Commercial Booking Commission.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * Conversion into Commercial Booking Commission value objects belongs to the
 * application boundary and must not be performed inside the domain entity
 * or aggregate.
 *
 * The DTO captures the complete commercial assessment snapshot:
 *
 * - Commercial Commission Rule reference;
 * - Booking reference;
 * - Journey reference;
 * - commission percentage;
 * - assessment base amount;
 * - calculated commission amount;
 * - currency.
 *
 * The DTO does not expose:
 *
 * - commission public ID;
 * - lifecycle status;
 * - assessed timestamp;
 * - cancelled timestamp;
 * - lifecycle events.
 *
 * Those values are owned by the Commercial Booking Commission domain.
 *
 * The newly created Commercial Booking Commission begins in PENDING state.
 * Assessment and cancellation are handled by their respective commands.
 */
export class CreateCommercialBookingCommissionDto {
  // ===========================================================================
  // Commercial Commission Rule
  // ===========================================================================

  /**
   * Public identity of the Commercial Commission Rule used to produce this
   * commission assessment.
   */
  @IsString()
  @IsNotEmpty()
  public readonly commissionRulePublicId!: string;

  // ===========================================================================
  // Booking
  // ===========================================================================

  /**
   * Public identity of the Booking against which the commission is assessed.
   */
  @IsString()
  @IsNotEmpty()
  public readonly bookingPublicId!: string;

  // ===========================================================================
  // Journey
  // ===========================================================================

  /**
   * Public identity of the Journey associated with the Booking.
   */
  @IsString()
  @IsNotEmpty()
  public readonly journeyPublicId!: string;

  // ===========================================================================
  // Commission Percentage
  // ===========================================================================

  /**
   * Commission percentage captured as part of the assessment snapshot.
   */
  @IsNumber()
  @Min(0)
  public readonly percentage!: number;

  // ===========================================================================
  // Base Amount
  // ===========================================================================

  /**
   * Monetary Booking amount against which the commission is assessed.
   */
  @IsNumber()
  @Min(0)
  public readonly baseAmount!: number;

  // ===========================================================================
  // Commission Amount
  // ===========================================================================

  /**
   * Commission amount calculated from the applicable commercial rule and
   * captured as an immutable historical assessment snapshot.
   */
  @IsNumber()
  @Min(0)
  public readonly commissionAmount!: number;

  // ===========================================================================
  // Currency
  // ===========================================================================

  /**
   * Currency in which the commission assessment is denominated.
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
