// -----------------------------------------------------------------------------
// Notification — Fail Notification Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for failing a Notification.
//
// Physical-world request:
//
// - provide the reason why the Notification failed.
//
// The Notification public ID is supplied through the HTTP route and is NOT
// duplicated in this DTO.
//
// The DTO contains ONLY information that an external caller can legitimately
// provide when requesting the Notification failure operation.
//
// It does NOT contain:
//
// - internal Notification ID;
// - Notification public ID;
// - correlation ID;
// - causation ID;
// - Notification status;
// - lifecycle timestamps;
// - failedAt;
// - sentAt;
// - readAt;
// - cancelledAt;
// - delivery records;
// - provider references.
//
// Notification lifecycle state and transition validation remain owned by the
// NotificationAggregate.
//
// -----------------------------------------------------------------------------
//
// Failure semantics:
//
// This DTO requests failure of the Notification aggregate itself.
//
// It does NOT:
//
// - fail NotificationDeliveryEntity instances;
// - communicate with external notification providers;
// - determine provider failure reasons;
// - publish domain events;
// - access repositories or Prisma.
//
// Delivery failure is a separate operation and must be explicitly requested
// through FailNotificationDeliveryRequestDto.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class FailNotificationRequestDto {
  // ---------------------------------------------------------------------------
  // Failure Reason
  // ---------------------------------------------------------------------------

  /**
   * Human-readable reason explaining why the Notification failed.
   *
   * The application layer passes this value to FailNotificationCommand,
   * which ultimately delegates the lifecycle transition to:
   *
   * NotificationAggregate.fail()
   */
  @IsString()
  @IsNotEmpty()
  public readonly failureReason!: string;
}
