// -----------------------------------------------------------------------------
// Device — Seen Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Device aggregate is observed or encountered again.
//
// The event records a security-safe observation of the Device and updates the
// domain history associated with the Device without exposing authentication
// credentials, secrets, or sensitive device material.
//
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// DeviceAggregate
// └── DeviceEntity
//
// -----------------------------------------------------------------------------
//
// Security boundary:
//
// This event intentionally excludes:
//
// - raw refresh tokens;
// - refresh-token hashes;
// - access tokens;
// - passwords;
// - password hashes;
// - OTP values;
// - OTP hashes;
// - recovery tokens;
// - authentication credentials;
// - device secrets;
// - cryptographic material;
// - other authentication secrets.
//
// Device context is included only when explicitly represented by safe,
// approved event fields.
//
// -----------------------------------------------------------------------------
//
// Event data:
//
// - Device public identity;
// - Identity public identity;
// - Device status;
// - observation timestamp.
//
// Aggregate internal identity remains in DomainEvent.metadata.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Device
// -----------------------------------------------------------------------------

import { DeviceDomainEvent } from './device-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Raised when a Device aggregate is observed.
 *
 * The event records a security-safe Device observation without exposing
 * authentication credentials, secrets, or sensitive device material.
 */
export class DeviceSeenEvent extends DeviceDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    deviceId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly status: string,
    public readonly seenAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(deviceId, 'Device', 'DeviceSeen', correlationId, causationId);

    Object.freeze(this);
  }

  // ===========================================================================
  // Payload
  // ===========================================================================

  /**
   * Returns the event-specific payload.
   *
   * Device aggregate identity remains in DomainEvent.metadata and is therefore
   * not duplicated in the event payload.
   *
   * Authentication credentials, device secrets, and other sensitive security
   * material are intentionally excluded.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      identityPublicId: this.identityPublicId,
      status: this.status,
      seenAt: this.seenAt,
    };
  }
}
