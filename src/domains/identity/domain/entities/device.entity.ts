// src/domains/identity/domain/entities/device.entity.ts

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import type { DeviceId } from '../value-objects/device-id.vo';
import type { DeviceStatus } from '../value-objects/device-status.enum';
import type { DeviceTrustLevel } from '../value-objects/device-trust-level.enum';
import type { DeviceType } from '../value-objects/device-type.enum';

interface DeviceProps {
  publicId: DeviceId;

  identityId: string;

  status: DeviceStatus;
  trustLevel: DeviceTrustLevel;

  fingerprint: string;

  name?: string;
  platform?: string;
  operatingSystem?: string;
  operatingSystemVersion?: string;
  browser?: string;
  browserVersion?: string;

  deviceType: DeviceType;

  trustedAt?: Date;
  lastSeenAt?: Date;
  revokedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export class DeviceEntity extends Entity<DeviceProps> {
  constructor(props: DeviceProps, id?: UniqueEntityId) {
    super(props, id);
  }

  override get publicId(): DeviceId {
    return this.props.publicId;
  }

  get identityId(): string {
    return this.props.identityId;
  }

  get status(): DeviceStatus {
    return this.props.status;
  }

  get trustLevel(): DeviceTrustLevel {
    return this.props.trustLevel;
  }

  get fingerprint(): string {
    return this.props.fingerprint;
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
}
