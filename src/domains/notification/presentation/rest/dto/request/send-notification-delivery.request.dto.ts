// -----------------------------------------------------------------------------
// Notification — Send Notification Delivery Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for marking a Notification Delivery as SENT.
//
// Physical-world action:
//
// - request that a pending Notification Delivery be marked as SENT;
// - optionally provide the external provider reference returned by the
//   delivery provider.
//
// The delivery is identified by the route:
//
//   POST /notifications/:notificationPublicId/deliveries/:deliveryPublicId/send
//
// The caller does NOT provide:
//
// - internal Notification ID;
// - internal Notification Delivery ID;
// - Notification public ID in the request body;
// - Notification Delivery public ID in the request body;
// - delivery status;
// - sent timestamp;
// - correlation ID;
// - causation ID.
//
// Provider communication occurs outside the domain aggregate.
//
// providerReference is an opaque domain value supplied when the external
// delivery provider has assigned an identifier to the delivery.
//
// The application layer is responsible for converting the external primitive
// into NotificationProviderReference before invoking the aggregate.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class SendNotificationDeliveryRequestDto {
  // ---------------------------------------------------------------------------
  // Provider Reference
  // ---------------------------------------------------------------------------

  /**
   * Optional provider-assigned reference for the Notification Delivery.
   *
   * Examples may include an external message ID, push notification ID, email
   * provider ID, or SMS provider ID.
   *
   * This remains an opaque provider reference at the transport boundary.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly providerReference?: string;
}
