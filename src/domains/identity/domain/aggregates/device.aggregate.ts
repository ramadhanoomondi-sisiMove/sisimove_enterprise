// src/domains/identity/domain/aggregates/device.aggregate.ts

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { DeviceAlreadyRevokedException } from '../exceptions/device-already-revoked.exception';
import { DeviceAlreadyTrustedException } from '../exceptions/device-already-trusted.exception';
import { DeviceNotPendingException } from '../exceptions/device-not-pending.exception';
import { DeviceRegisteredEvent } from '../events/device-registered.event';
import { DeviceRevokedEvent } from '../events/device-revoked.event';
import { DeviceTrustedEvent } from '../events/device-trusted.event';
import type { DeviceFingerprint } from '../value-objects/device-fingerprint.vo';
import { DeviceId } from '../value-objects/device-id.vo';
import { DeviceStatus } from '../value-objects/device-status.enum';
import { DeviceTrustLevel } from '../value-objects/device-trust-level.enum';
import type { DeviceType } from '../value-objects/device-type.enum';

interface DeviceMetadata {
  name: string | undefined;
  platform: string | undefined;
  operatingSystem: string | undefined;
  operatingSystemVersion: string | undefined;
  browser: string | undefined;
  browserVersion: string | undefined;
}

interface DeviceProps extends DeviceMetadata {
  identityId: string;

  fingerprint: DeviceFingerprint;

  status: DeviceStatus;
  trustLevel: DeviceTrustLevel;

  deviceType: DeviceType;

  trustedAt: Date | undefined;
  lastSeenAt: Date | undefined;
  revokedAt: Date | undefined;

  createdAt: Date;
  updatedAt: Date;
}

export class DeviceAggregate extends AggregateRoot<DeviceProps> {
  public constructor(
    props: DeviceProps,
    id?: UniqueEntityId,
    publicId?: DeviceId,
  ) {
    super(props, id, publicId);
  }

  static register(
    identityId: string,
    fingerprint: DeviceFingerprint,
    deviceType: DeviceType,
    correlationId: string,
    metadata?: Partial<DeviceMetadata>,
  ): DeviceAggregate {
    const now = new Date();

    const device = new DeviceAggregate(
      {
        identityId,
        fingerprint,

        status: DeviceStatus.PENDING,
        trustLevel: DeviceTrustLevel.LOW,

        deviceType,

        name: metadata?.name,
        platform: metadata?.platform,
        operatingSystem: metadata?.operatingSystem,
        operatingSystemVersion: metadata?.operatingSystemVersion,
        browser: metadata?.browser,
        browserVersion: metadata?.browserVersion,

        trustedAt: undefined,
        lastSeenAt: now,
        revokedAt: undefined,

        createdAt: now,
        updatedAt: now,
      },
      new UniqueEntityId(),
      new DeviceId(),
    );

    device.addDomainEvent(
      new DeviceRegisteredEvent(
        device.id.value,
        device.publicId.value,
        device.identityId,
        device.fingerprint.value,
        correlationId,
      ),
    );

    return device;
  }

  get identityId(): string {
    return this.props.identityId;
  }

  get fingerprint(): DeviceFingerprint {
    return this.props.fingerprint;
  }

  get status(): DeviceStatus {
    return this.props.status;
  }

  get trustLevel(): DeviceTrustLevel {
    return this.props.trustLevel;
  }

  get name(): string | undefined {
    return this.props.name;
  }

  get platform(): string | undefined {
    return this.props.platform;
  }

  get operatingSystem(): string | undefined {
    return this.props.operatingSystem;
  }

  get operatingSystemVersion(): string | undefined {
    return this.props.operatingSystemVersion;
  }

  get browser(): string | undefined {
    return this.props.browser;
  }

  get browserVersion(): string | undefined {
    return this.props.browserVersion;
  }

  get deviceType(): DeviceType {
    return this.props.deviceType;
  }

  get trustedAt(): Date | undefined {
    return this.props.trustedAt;
  }

  get lastSeenAt(): Date | undefined {
    return this.props.lastSeenAt;
  }

  get revokedAt(): Date | undefined {
    return this.props.revokedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  trust(correlationId: string): void {
    if (this.status === DeviceStatus.TRUSTED) {
      throw new DeviceAlreadyTrustedException();
    }

    if (this.status !== DeviceStatus.PENDING) {
      throw new DeviceNotPendingException();
    }

    const now = new Date();

    this.props.status = DeviceStatus.TRUSTED;
    this.props.trustLevel = DeviceTrustLevel.HIGH;
    this.props.trustedAt = now;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new DeviceTrustedEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        correlationId,
      ),
    );
  }

  revoke(correlationId: string): void {
    if (this.status === DeviceStatus.REVOKED) {
      throw new DeviceAlreadyRevokedException();
    }

    const now = new Date();

    this.props.status = DeviceStatus.REVOKED;
    this.props.revokedAt = now;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new DeviceRevokedEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        correlationId,
      ),
    );
  }

  markSeen(): void {
    const now = new Date();

    this.props.lastSeenAt = now;
    this.props.updatedAt = now;
  }
}
