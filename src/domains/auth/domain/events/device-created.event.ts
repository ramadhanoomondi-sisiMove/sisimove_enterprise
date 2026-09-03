// -----------------------------------------------------------------------------
// Device — Created Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Device aggregate is created.
//
// The event records the establishment of a new Device associated with an
// Identity.
//
// Security-sensitive device material is intentionally excluded from the
// event payload.
//
// In particular:
//
// - device secrets are never published;
// - push-notification tokens are never published;
// - cryptographic keys are never published;
// - authentication credentials are never published;
// - other security-sensitive device material is never published.
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
// - Device lifecycle status;
// - device platform;
// - device type;
// - device name, when present;
// - creation timestamp.
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
 * Raised when a Device aggregate is created.
 *
 * The event records the creation of a Device without exposing device secrets,
 * push tokens, credentials, cryptographic material, or other security-sensitive
 * device data.
 */
export class DeviceCreatedEvent extends DeviceDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    deviceId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly status: string,
    public readonly platform: string,
    public readonly type: string,
    public readonly name: string | undefined,
    public readonly createdAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(deviceId, 'Device', 'DeviceCreated', correlationId, causationId);

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
   * Security-sensitive device material is intentionally excluded.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      identityPublicId: this.identityPublicId,
      status: this.status,
      platform: this.platform,
      type: this.type,
      name: this.name,
      createdAt: this.createdAt,
    };
  }
}
