// -----------------------------------------------------------------------------
// Notification — Create Notification Delivery Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for creating a Notification Delivery.
//
// Physical-world request:
//
// - identify the Notification to which the delivery belongs;
// - specify the delivery channel.
//
// The Notification Delivery is created as a child of the Notification
// aggregate.
//
// The caller does NOT provide:
//
// - internal Notification ID;
// - Notification Delivery internal ID;
// - Notification Delivery public ID;
// - delivery status;
// - provider reference;
// - sent timestamp;
// - delivered timestamp;
// - failed timestamp;
// - cancelled timestamp;
// - failure reason;
// - correlation ID;
// - causation ID;
// - creation timestamp.
//
// The Notification aggregate establishes delivery ownership, initial
// lifecycle state, delivery identity, and aggregate invariants.
//
// -----------------------------------------------------------------------------
//
// Route:
//
// The Notification may be identified by the route:
//
//   POST /notifications/:notificationPublicId/deliveries
//
// Therefore notificationPublicId should normally be obtained from the route
// rather than duplicated in the request body.
//
// If the application command is designed to receive the Notification public
// identity as command data, the controller/application layer may construct
// that command from the route parameter.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class CreateNotificationDeliveryRequestDto {
  // ---------------------------------------------------------------------------
  // Channel
  // ---------------------------------------------------------------------------

  /**
   * Delivery channel for the Notification.
   *
   * Supported channels are defined by the Notification domain.
   *
   * Examples:
   *
   * - IN_APP
   * - PUSH
   * - EMAIL
   * - SMS
   */
  @IsString()
  @IsNotEmpty()
  public readonly channel!: string;
}
