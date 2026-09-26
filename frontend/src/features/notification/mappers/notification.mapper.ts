// -----------------------------------------------------------------------------
// sisiMove — Notification Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend NotificationResponse HTTP representation into the
// frontend Notification feature model.
//
// Backend response:
//
// NotificationResponse
// ├── Notification state
// ├── Reference metadata
// ├── Source-event metadata
// └── Delivery projection
//     ├── deliveryCount
//     ├── hasDeliveries
//     └── deliveries[]
//
// Frontend model:
//
// Notification
// └── NotificationDelivery[]
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - convert the backend Notification response into the frontend model;
// - preserve backend-authoritative Notification state;
// - preserve backend-authoritative delivery state;
// - preserve optional metadata;
// - normalize nullable/optional transport values;
// - convert ISO date strings into frontend date strings without mutation.
//
// Non-responsibilities:
//
// - lifecycle validation;
// - determining whether a Notification is unread;
// - calculating deliveryCount;
// - calculating hasDeliveries;
// - generating notification content;
// - resolving references;
// - resolving source events;
// - authorization;
// - navigation;
// - API calls;
// - React Query caching;
// - domain orchestration.
//
// IMPORTANT:
//
// The backend NotificationResponse is authoritative for:
//
// - deliveryCount;
// - hasDeliveries;
// - deliveries.
//
// These values are NOT recomputed by this mapper.
//
// The backend aggregate already owns that state.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Frontend Models
// -----------------------------------------------------------------------------

import type {
  Notification,
  NotificationDelivery,
} from '../models';

// =============================================================================
// Backend Response Contracts
// =============================================================================
//
// These interfaces intentionally describe the HTTP/application response
// contract rather than importing backend TypeScript/domain classes.
//
// The frontend must remain independent from the NestJS backend source tree.
// =============================================================================

interface NotificationDeliveryResponse {
  publicId: string;
  channel: string;
  status: string;
  providerReference?: string;

  sentAt?: string | null;
  deliveredAt?: string | null;
  failedAt?: string | null;
  cancelledAt?: string | null;

  failureReason?: string | null;

  createdAt: string;
  updatedAt: string;
}

interface NotificationResponse {
  publicId: string;
  recipientPublicId: string;

  type: string;
  priority: string;
  status: string;

  title: string;
  body: string;

  referenceType?: string | null;
  referencePublicId?: string | null;

  eventType?: string | null;
  eventPublicId?: string | null;

  sentAt?: string | null;
  readAt?: string | null;
  failedAt?: string | null;
  cancelledAt?: string | null;

  failureReason?: string | null;

  deliveryCount: number;
  hasDeliveries: boolean;
  deliveries: NotificationDeliveryResponse[];

  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Converts nullable transport values into the optional representation used
 * by the frontend model.
 *
 * The backend mapper currently exposes undefined for absent optional values,
 * while JSON transport can also represent nullable values depending on the
 * serialization path.
 *
 * The frontend model intentionally uses optional properties.
 */
function optionalString(
  value: string | null | undefined,
): string | undefined {
  return value ?? undefined;
}

// =============================================================================
// Delivery Mapping
// =============================================================================

/**
 * Maps one backend NotificationDeliveryResponse into the frontend
 * NotificationDelivery model.
 *
 * No delivery lifecycle logic belongs here.
 */
function mapDelivery(
  delivery: NotificationDeliveryResponse,
): NotificationDelivery {
  return {
    // -------------------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------------------

    publicId: delivery.publicId,

    // -------------------------------------------------------------------------
    // Delivery
    // -------------------------------------------------------------------------

    channel: delivery.channel,

    status: delivery.status,

    providerReference:
      optionalString(delivery.providerReference),

    // -------------------------------------------------------------------------
    // Lifecycle
    // -------------------------------------------------------------------------

    sentAt:
      optionalString(delivery.sentAt),

    deliveredAt:
      optionalString(delivery.deliveredAt),

    failedAt:
      optionalString(delivery.failedAt),

    cancelledAt:
      optionalString(delivery.cancelledAt),

    failureReason:
      optionalString(delivery.failureReason),

    // -------------------------------------------------------------------------
    // Audit
    // -------------------------------------------------------------------------

    createdAt: delivery.createdAt,

    updatedAt: delivery.updatedAt,
  };
}

// =============================================================================
// Notification Mapping
// =============================================================================

/**
 * Maps the complete backend NotificationResponse into the frontend
 * Notification model.
 *
 * The backend's aggregate-projected delivery values are preserved exactly.
 */
export function mapNotification(
  response: NotificationResponse,
): Notification {
  return {
    // -------------------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------------------

    publicId: response.publicId,

    recipientPublicId:
      response.recipientPublicId,

    // -------------------------------------------------------------------------
    // Notification
    // -------------------------------------------------------------------------

    type: response.type as Notification['type'],

    priority:
      response.priority as Notification['priority'],

    status:
      response.status as Notification['status'],

    title: response.title,

    body: response.body,

    // -------------------------------------------------------------------------
    // Reference
    // -------------------------------------------------------------------------

    referenceType:
      optionalString(response.referenceType),

    referencePublicId:
      optionalString(response.referencePublicId),

    // -------------------------------------------------------------------------
    // Source Event
    // -------------------------------------------------------------------------

    eventType:
      optionalString(response.eventType),

    eventPublicId:
      optionalString(response.eventPublicId),

    // -------------------------------------------------------------------------
    // Notification Lifecycle
    // -------------------------------------------------------------------------

    sentAt:
      optionalString(response.sentAt),

    readAt:
      optionalString(response.readAt),

    failedAt:
      optionalString(response.failedAt),

    cancelledAt:
      optionalString(response.cancelledAt),

    failureReason:
      optionalString(response.failureReason),

    // -------------------------------------------------------------------------
    // Delivery State
    // -------------------------------------------------------------------------

    /**
     * These are backend-projected aggregate values.
     *
     * Do not replace them with:
     *
     *     response.deliveries.length
     *
     * or another locally calculated representation.
     */
    deliveryCount:
      response.deliveryCount,

    hasDeliveries:
      response.hasDeliveries,

    deliveries:
      response.deliveries.map(mapDelivery),

    // -------------------------------------------------------------------------
    // Audit
    // -------------------------------------------------------------------------

    createdAt: response.createdAt,

    updatedAt: response.updatedAt,
  };
}

/**
 * Maps a collection of backend NotificationResponse objects.
 *
 * Collection mapping is deliberately a thin composition of the canonical
 * single-resource mapper.
 */
export function mapNotifications(
  responses: NotificationResponse[],
): Notification[] {
  return responses.map(mapNotification);
}