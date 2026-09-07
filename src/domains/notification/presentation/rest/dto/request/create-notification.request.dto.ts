// -----------------------------------------------------------------------------
// Notification — Create Notification Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for creating a Notification.
//
// Physical-world request:
//
// - identify the recipient;
// - specify the notification type;
// - specify the notification priority;
// - provide the notification title;
// - provide the notification body;
// - optionally identify a related domain resource;
// - optionally identify the source domain event.
//
// The DTO contains ONLY information that an external caller can legitimately
// provide when requesting creation of a Notification.
//
// It does NOT contain:
//
// - internal Notification ID;
// - Notification public ID;
// - correlation ID;
// - causation ID;
// - notification status;
// - lifecycle timestamps;
// - sentAt;
// - readAt;
// - failedAt;
// - cancelledAt;
// - failure reason;
// - delivery records;
// - provider references.
//
// Notification lifecycle state is established by the domain.
//
// -----------------------------------------------------------------------------
//
// Cross-domain references:
//
// recipientPublicId
//     → opaque public identity reference to the Identity domain.
//
// referenceType / referencePublicId
//     → optional reference to the domain resource for which the notification
//       was created.
//
// eventType / eventPublicId
//     → optional reference to the source domain event.
//
// These references remain opaque at the Notification transport boundary.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class CreateNotificationRequestDto {
  // ---------------------------------------------------------------------------
  // Recipient
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the member who should receive the Notification.
   *
   * This is an externally supplied opaque Identity reference.
   */
  @IsString()
  @IsNotEmpty()
  public readonly recipientPublicId!: string;

  // ---------------------------------------------------------------------------
  // Type
  // ---------------------------------------------------------------------------

  /**
   * Notification type.
   *
   * Examples include:
   *
   * - JOURNEY
   * - BOOKING
   * - PAYMENT
   * - WALLET
   * - TRUST
   * - VERIFICATION
   * - MESSAGE
   * - SUPPORT
   * - SYSTEM
   */
  @IsString()
  @IsNotEmpty()
  public readonly type!: string;

  // ---------------------------------------------------------------------------
  // Priority
  // ---------------------------------------------------------------------------

  /**
   * Notification priority.
   *
   * Examples include:
   *
   * - LOW
   * - NORMAL
   * - HIGH
   * - CRITICAL
   */
  @IsString()
  @IsNotEmpty()
  public readonly priority!: string;

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  /**
   * Notification title.
   */
  @IsString()
  @IsNotEmpty()
  public readonly title!: string;

  /**
   * Notification body.
   */
  @IsString()
  @IsNotEmpty()
  public readonly body!: string;

  // ---------------------------------------------------------------------------
  // Related Resource
  // ---------------------------------------------------------------------------

  /**
   * Optional type of the domain resource associated with the Notification.
   *
   * Examples may include:
   *
   * - JOURNEY
   * - BOOKING
   * - PAYMENT
   * - WALLET
   *
   * The value is intentionally represented as a string at the transport
   * boundary because Notification does not own the referenced aggregate.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly referenceType?: string;

  /**
   * Optional public identifier of the domain resource associated with the
   * Notification.
   *
   * This remains an opaque cross-domain reference.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly referencePublicId?: string;

  // ---------------------------------------------------------------------------
  // Source Event
  // ---------------------------------------------------------------------------

  /**
   * Optional source domain-event type that caused the Notification.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly eventType?: string;

  /**
   * Optional public identifier of the source event that caused the
   * Notification.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly eventPublicId?: string;
}
