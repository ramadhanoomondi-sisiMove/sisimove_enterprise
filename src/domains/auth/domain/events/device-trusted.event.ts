// -----------------------------------------------------------------------------
// Device — Trusted Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Device aggregate is marked as trusted.
//
// The event records the trust-state transition for a Device associated with an
// Identity.
//
// Security-sensitive authentication material is intentionally excluded from
// the event payload.
//
// In particular:
//
// - device secrets are never published;
// - authentication credentials are never published;
// - refresh tokens are never published;
// - refresh-token hashes are never published;
// - access tokens are never published;
// - OTP values are never published;
// - OTP hashes are never published;
// - recovery tokens are never published;
// - recovery-token hashes are never published.
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
// Safe event data:
//
// - Device public identity;
// - Identity public identity;
// - Device trust state;
// - trustedAt timestamp.
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
 * Raised when a Device aggregate is marked as trusted.
 *
 * The event records the Device trust-state transition without exposing
 * authentication credentials, device secrets, or other security-sensitive
 * material.
 */
export class DeviceTrustedEvent extends DeviceDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    deviceId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly trusted: boolean,
    public readonly trustedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(deviceId, 'Device', 'DeviceTrusted', correlationId, causationId);

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
   * Security-sensitive authentication material is intentionally excluded.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      identityPublicId: this.identityPublicId,
      trusted: this.trusted,
      trustedAt: this.trustedAt,
    };
  }
}
