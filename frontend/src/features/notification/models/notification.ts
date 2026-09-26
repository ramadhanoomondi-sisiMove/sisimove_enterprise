// -----------------------------------------------------------------------------
// sisiMove — Notification Model
// -----------------------------------------------------------------------------
//
// Frontend representation of the backend NotificationResponse.
//
// Backend aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// The frontend does NOT reproduce this aggregate.
//
// This model represents the application-facing response produced by
// NotificationResponseMapper.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - represent Notification identity;
// - represent recipient reference;
// - represent Notification type, priority, and status;
// - represent backend-authored content;
// - represent optional reference metadata;
// - represent optional source-event metadata;
// - represent Notification lifecycle timestamps;
// - represent Notification failure information;
// - represent aggregate-owned delivery state;
// - represent delivery response objects safely.
//
// -----------------------------------------------------------------------------
//
// The frontend does NOT:
//
// - orchestrate Notification lifecycle;
// - create Notifications;
// - send Notifications;
// - fail Notifications;
// - cancel Notifications;
// - send deliveries;
// - deliver deliveries;
// - fail deliveries;
// - cancel deliveries;
// - communicate with delivery providers;
// - resolve Identity references;
// - resolve source events;
// - resolve arbitrary referenced domains.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// NotificationDelivery is included in the model because the backend
// NotificationResponse exposes it.
//
// This does NOT mean delivery operations belong in the normal member-facing
// UI. Delivery state is response data; delivery lifecycle operations remain
// backend/infrastructure concerns.
// -----------------------------------------------------------------------------

import type { NotificationPriority } from './notification-priority';
import type { NotificationStatus } from './notification-status';
import type { NotificationType } from './notification-type';

// =============================================================================
// Notification Delivery
// =============================================================================

export interface NotificationDelivery {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Notification Delivery.
   *
   * The internal delivery identity is never exposed to the frontend.
   */
  publicId: string;

  // ---------------------------------------------------------------------------
  // Delivery
  // ---------------------------------------------------------------------------

  /**
   * Delivery channel.
   *
   * The backend currently exposes:
   *
   * - IN_APP
   * - PUSH
   * - EMAIL
   * - SMS
   *
   * The transport/application response currently represents this as a string.
   */
  channel: string;

  /**
   * Current delivery lifecycle status.
   *
   * The backend currently exposes:
   *
   * - PENDING
   * - SENT
   * - DELIVERED
   * - FAILED
   * - CANCELLED
   */
  status: string;

  /**
   * Opaque reference assigned by an external delivery provider.
   *
   * This is not normally rendered in member-facing UI.
   */
  providerReference?: string;

  // ---------------------------------------------------------------------------
  // Delivery Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the delivery was sent.
   */
  sentAt?: string;

  /**
   * Timestamp at which the delivery was confirmed as delivered.
   */
  deliveredAt?: string;

  /**
   * Timestamp at which the delivery failed.
   */
  failedAt?: string;

  /**
   * Timestamp at which the delivery was cancelled.
   */
  cancelledAt?: string;

  /**
   * Backend-provided delivery failure reason.
   */
  failureReason?: string;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Delivery creation timestamp.
   */
  createdAt: string;

  /**
   * Delivery last-update timestamp.
   */
  updatedAt: string;
}

// =============================================================================
// Notification
// =============================================================================

export interface Notification {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Notification aggregate.
   */
  publicId: string;

  /**
   * Opaque public identity reference of the notification recipient.
   *
   * This belongs to the Identity domain.
   */
  recipientPublicId: string;

  // ---------------------------------------------------------------------------
  // Notification
  // ---------------------------------------------------------------------------

  /**
   * Notification category.
   */
  type: NotificationType;

  /**
   * Notification presentation priority.
   */
  priority: NotificationPriority;

  /**
   * Backend-owned Notification lifecycle status.
   */
  status: NotificationStatus;

  /**
   * Backend-authored Notification title.
   *
   * The frontend renders this value and does not generate notification copy.
   */
  title: string;

  /**
   * Backend-authored Notification body.
   *
   * The frontend renders this value and does not generate notification copy.
   */
  body: string;

  // ---------------------------------------------------------------------------
  // Reference
  // ---------------------------------------------------------------------------

  /**
   * Optional type of the domain object referenced by the Notification.
   *
   * This is opaque metadata and must not be converted directly into a URL.
   */
  referenceType?: string;

  /**
   * Optional public identifier of the referenced domain object.
   */
  referencePublicId?: string;

  // ---------------------------------------------------------------------------
  // Source Event
  // ---------------------------------------------------------------------------

  /**
   * Optional type of the source event that generated the Notification.
   *
   * This is event metadata, not automatically a navigation target.
   */
  eventType?: string;

  /**
   * Optional public identifier of the source event.
   */
  eventPublicId?: string;

  // ---------------------------------------------------------------------------
  // Notification Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Notification entered SENT state.
   */
  sentAt?: string;

  /**
   * Timestamp at which the Notification entered READ state.
   */
  readAt?: string;

  /**
   * Timestamp at which the Notification entered FAILED state.
   */
  failedAt?: string;

  /**
   * Timestamp at which the Notification entered CANCELLED state.
   */
  cancelledAt?: string;

  /**
   * Backend-provided Notification failure reason.
   */
  failureReason?: string;

  // ---------------------------------------------------------------------------
  // Delivery State
  // ---------------------------------------------------------------------------

  /**
   * Number of delivery records owned by the Notification aggregate.
   *
   * This is a backend-projected aggregate value.
   */
  deliveryCount: number;

  /**
   * Indicates whether the aggregate contains delivery records.
   */
  hasDeliveries: boolean;

  /**
   * Delivery records projected by the backend aggregate response.
   */
  deliveries: NotificationDelivery[];

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Notification creation timestamp.
   */
  createdAt: string;

  /**
   * Notification last-update timestamp.
   */
  updatedAt: string;
}