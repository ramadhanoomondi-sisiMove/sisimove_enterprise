// -----------------------------------------------------------------------------
// Device — Revoked Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Device aggregate is revoked.
//
// The event records the Device lifecycle transition to REVOKED together with
// the revocation timestamp.
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
// - device fingerprint;
// - authentication credentials;
// - refresh tokens;
// - refresh-token hashes;
// - access tokens;
// - session tokens;
// - other authentication secrets.
//
// The event exposes only safe public identifiers, lifecycle state, and
// revocation metadata.
//
// -----------------------------------------------------------------------------
//
// Event data:
//
// - Device public identity;
// - Identity public identity;
// - Device status;
// - revokedAt.
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
 * Raised when a Device aggregate is revoked.
 *
 * The event records the Device revocation transition without exposing the
 * device fingerprint or any authentication-sensitive material.
 */
export class DeviceRevokedEvent extends DeviceDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    deviceId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly status: string,
    public readonly revokedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(deviceId, 'Device', 'DeviceRevoked', correlationId, causationId);

    Object.freeze(this);
  }

  // ===========================================================================
  // Payload
  // ===========================================================================

  /**
   * Returns the event-specific payload.
   *
   * Device aggregate identity remains in DomainEvent.metadata and is
   * therefore not duplicated in the event payload.
   *
   * Security-sensitive Device and authentication material is intentionally
   * excluded.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      identityPublicId: this.identityPublicId,
      status: this.status,
      revokedAt: this.revokedAt,
    };
  }
}
