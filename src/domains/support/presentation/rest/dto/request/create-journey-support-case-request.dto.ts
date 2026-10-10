/**
 * -----------------------------------------------------------------------------
 * Support — Create Journey Support Case Request DTO
 * -----------------------------------------------------------------------------
 *
 * Transport DTO for creating a Support Case associated with a Journey.
 *
 * The authenticated identity determines the requester.
 * The endpoint's journeyPublicId determines the related Journey.
 *
 * The DTO contains ONLY information that an external caller may provide:
 *
 * - Support Case priority;
 * - Support Case category;
 * - Support Case subject;
 * - optional description.
 *
 * It does NOT contain:
 *
 * - requesterPublicId;
 * - journeyPublicId;
 * - referenceType;
 * - referencePublicId;
 * - internal Support Case ID;
 * - Support Case public ID;
 * - correlation ID;
 * - causation ID;
 * - status or lifecycle information.
 *
 * The application layer establishes the requester and Journey reference.
 * -----------------------------------------------------------------------------
 */

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class CreateJourneySupportCaseRequestDto {
  // ---------------------------------------------------------------------------
  // Priority
  // ---------------------------------------------------------------------------

  /**
   * Support Case priority.
   *
   * Examples: LOW, NORMAL, HIGH, CRITICAL.
   */
  @IsString()
  @IsNotEmpty()
  public readonly priority!: string;

  // ---------------------------------------------------------------------------
  // Category
  // ---------------------------------------------------------------------------

  /**
   * Support Case category.
   *
   * Examples may include ACCOUNT, BOOKING, JOURNEY, PAYMENT,
   * SAFETY, TECHNICAL, or OTHER.
   */
  @IsString()
  @IsNotEmpty()
  public readonly category!: string;

  // ---------------------------------------------------------------------------
  // Subject
  // ---------------------------------------------------------------------------

  /**
   * Short subject describing the support issue.
   */
  @IsString()
  @IsNotEmpty()
  public readonly subject!: string;

  // ---------------------------------------------------------------------------
  // Description
  // ---------------------------------------------------------------------------

  /**
   * Optional detailed description of the support issue or request.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly description?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateJourneySupportCaseRequestDto;
