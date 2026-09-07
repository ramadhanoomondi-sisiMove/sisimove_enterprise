// -----------------------------------------------------------------------------
// Support — Create Support Case Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for creating a Support Case.
//
// Physical-world request:
//
// - identify the requester;
// - specify the Support Case priority;
// - specify the Support Case category;
// - provide the Support Case subject;
// - optionally provide a description;
// - optionally identify a related domain resource.
//
// The DTO contains ONLY information that an external caller can legitimately
// provide when requesting creation of a Support Case.
//
// It does NOT contain:
//
// - internal Support Case ID;
// - Support Case public ID;
// - correlation ID;
// - causation ID;
// - Support Case status;
// - lifecycle timestamps;
// - version;
// - assignment information;
// - participants;
// - messages;
// - notes;
// - evidence;
// - resolution information;
// - domain events.
//
// Support Case lifecycle state is established by the domain/application
// creation flow.
//
// -----------------------------------------------------------------------------
//
// Cross-domain references:
//
// requesterPublicId
//     → opaque public identity reference to the Identity domain.
//
// referenceType / referencePublicId
//     → optional opaque reference to the domain resource associated with the
//       Support Case.
//
// These references remain opaque at the Support transport boundary.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class CreateSupportCaseRequestDto {
  // ---------------------------------------------------------------------------
  // Requester
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the member requesting support.
   *
   * This is an externally supplied opaque Identity reference.
   */
  @IsString()
  @IsNotEmpty()
  public readonly requesterPublicId!: string;

  // ---------------------------------------------------------------------------
  // Priority
  // ---------------------------------------------------------------------------

  /**
   * Support Case priority.
   *
   * Examples include:
   *
   * - LOW
   * - NORMAL
   * - HIGH
   * - CRITICAL
   *
   * The transport layer represents the value as a string.
   * The application layer converts it into SupportCasePriority.
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
   * Examples may include:
   *
   * - ACCOUNT
   * - BOOKING
   * - JOURNEY
   * - PAYMENT
   * - WALLET
   * - VERIFICATION
   * - SAFETY
   * - TECHNICAL
   * - OTHER
   *
   * The transport layer represents the value as a string.
   * The application layer converts it into SupportCaseCategory.
   */
  @IsString()
  @IsNotEmpty()
  public readonly category!: string;

  // ---------------------------------------------------------------------------
  // Subject
  // ---------------------------------------------------------------------------

  /**
   * Short subject describing the Support Case.
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

  // ---------------------------------------------------------------------------
  // Related Resource
  // ---------------------------------------------------------------------------

  /**
   * Optional type of the domain resource associated with the Support Case.
   *
   * Examples may include:
   *
   * - JOURNEY
   * - BOOKING
   * - PAYMENT
   * - WALLET
   * - NOTIFICATION
   *
   * The value remains opaque at the transport boundary because Support does
   * not own the referenced aggregate.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly referenceType?: string;

  /**
   * Optional public identifier of the domain resource associated with the
   * Support Case.
   *
   * This remains an opaque cross-domain reference.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly referencePublicId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateSupportCaseRequestDto;
