// -----------------------------------------------------------------------------
// Notification — Fail Notification Delivery Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for marking a Notification Delivery as FAILED.
//
// Physical-world request:
//
// - provide the reason why the Notification Delivery failed.
//
// The delivery is identified by the route:
//
//   POST /notifications/:notificationPublicId/deliveries/:deliveryPublicId/fail
//
// The caller does NOT provide:
//
// - internal Notification ID;
// - internal Notification Delivery ID;
// - Notification public ID in the request body;
// - Notification Delivery public ID in the request body;
// - delivery status;
// - failure timestamp;
// - correlation ID;
// - causation ID.
//
// The application workflow establishes the failure timestamp and event
// correlation metadata.
//
// Delivery failure is intentionally independent from Notification failure.
// The NotificationAggregate.failDelivery() operation does not automatically
// fail the Notification itself.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class FailNotificationDeliveryRequestDto {
  // ---------------------------------------------------------------------------
  // Failure Reason
  // ---------------------------------------------------------------------------

  /**
   * Explanation of why the Notification Delivery failed.
   *
   * This value is passed to the Notification aggregate, which delegates the
   * delivery lifecycle transition to NotificationDeliveryEntity.
   */
  @IsString()
  @IsNotEmpty()
  public readonly failureReason!: string;
}
