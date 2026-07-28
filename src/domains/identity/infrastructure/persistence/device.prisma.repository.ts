// src/domains/identity/infrastructure/persistence/prisma-device.repository.ts

import { Injectable } from '@nestjs/common';
import { DeviceStatus as PrismaDeviceStatus } from '@prisma/client';

import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

import type { DeviceAggregate } from '../../domain/aggregates/device.aggregate';
import type { DeviceEntity } from '../../domain/entities/device.entity';
import type { DeviceRepository } from '../../domain/repositories/device.repository';
import type { DeviceFingerprint } from '../../domain/value-objects/device-fingerprint.vo';
import type { DeviceId } from '../../domain/value-objects/device-id.vo';
import { DevicePersistenceMapper } from '../mappers/device.persistence.mapper';

@Injectable()
export class DevicePrismaRepository implements DeviceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(device: DeviceAggregate): Promise<void> {
    const data = DevicePersistenceMapper.toPersistence(device);

    await this.prisma.device.upsert({
      where: {
        id: data.id,
      },
      create: data,
      update: data,
    });
  }

  async delete(device: DeviceAggregate): Promise<void> {
    await this.prisma.device.delete({
      where: {
        id: device.id.value,
      },
    });
  }

  async findById(id: string): Promise<DeviceAggregate | null> {
    const device = await this.prisma.device.findUnique({
      where: {
        id,
      },
    });

    return device ? DevicePersistenceMapper.toDomain(device) : null;
  }

  async findByPublicId(publicId: DeviceId): Promise<DeviceAggregate | null> {
    const device = await this.prisma.device.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return device ? DevicePersistenceMapper.toDomain(device) : null;
  }

  async findByFingerprint(
    fingerprint: DeviceFingerprint,
  ): Promise<DeviceAggregate | null> {
    const device = await this.prisma.device.findUnique({
      where: {
        fingerprint: fingerprint.value,
      },
    });

    return device ? DevicePersistenceMapper.toDomain(device) : null;
  }

  async findEntityByPublicId(publicId: DeviceId): Promise<DeviceEntity | null> {
    const device = await this.prisma.device.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return device ? DevicePersistenceMapper.toEntity(device) : null;
  }

  async findByIdentityId(identityId: string): Promise<DeviceEntity[]> {
    const devices = await this.prisma.device.findMany({
      where: {
        identityId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return devices.map((device) => DevicePersistenceMapper.toEntity(device));
  }

  async findTrustedByIdentityId(identityId: string): Promise<DeviceEntity[]> {
    const devices = await this.prisma.device.findMany({
      where: {
        identityId,
        status: PrismaDeviceStatus.TRUSTED,
      },
      orderBy: {
        trustedAt: 'desc',
      },
    });

    return devices.map((device) => DevicePersistenceMapper.toEntity(device));
  }

  async findPendingByIdentityId(identityId: string): Promise<DeviceEntity[]> {
    const devices = await this.prisma.device.findMany({
      where: {
        identityId,
        status: PrismaDeviceStatus.PENDING,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return devices.map((device) => DevicePersistenceMapper.toEntity(device));
  }

  async existsByFingerprint(fingerprint: DeviceFingerprint): Promise<boolean> {
    const count = await this.prisma.device.count({
      where: {
        fingerprint: fingerprint.value,
      },
    });

    return count > 0;
  }
}
