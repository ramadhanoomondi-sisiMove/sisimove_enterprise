// src/domains/identity/infrastructure/persistence/verification.prisma.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

import type { VerificationAggregate } from '../../domain/aggregates/verification.aggregate';
import type { VerificationRequestEntity } from '../../domain/entities/verification-request.entity';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import type { IdentityId } from '../../domain/value-objects/identity-id.vo';
import type { VerificationId } from '../../domain/value-objects/verification-id.vo';
import type { VerificationRequestId } from '../../domain/value-objects/verification-request-id.vo';

import { VerificationPersistenceMapper } from '../mappers/verification.persistence.mapper';

@Injectable()
export class VerificationPrismaRepository implements VerificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(verification: VerificationAggregate): Promise<void> {
    const verificationData =
      VerificationPersistenceMapper.toPersistence(verification);

    const requestData = verification.requests.map((request) =>
      VerificationPersistenceMapper.requestToPersistence(request),
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.verification.upsert({
        where: {
          id: verification.id.value,
        },
        create: verificationData,
        update: verificationData,
      });

      await tx.verificationRequest.deleteMany({
        where: {
          verificationId: verification.id.value,
        },
      });

      if (requestData.length > 0) {
        await tx.verificationRequest.createMany({
          data: requestData,
        });
      }
    });
  }

  async update(verification: VerificationAggregate): Promise<void> {
    await this.save(verification);
  }

  async findById(id: string): Promise<VerificationAggregate | null> {
    const verification = await this.prisma.verification.findUnique({
      where: {
        id,
      },
      include: {
        requests: true,
      },
    });

    return verification
      ? VerificationPersistenceMapper.toDomain(verification)
      : null;
  }

  async findByPublicId(
    publicId: VerificationId,
  ): Promise<VerificationAggregate | null> {
    const verification = await this.prisma.verification.findUnique({
      where: {
        publicId: publicId.value,
      },
      include: {
        requests: true,
      },
    });

    return verification
      ? VerificationPersistenceMapper.toDomain(verification)
      : null;
  }

  async findByIdentityId(
    identityId: IdentityId,
  ): Promise<VerificationAggregate | null> {
    const verification = await this.prisma.verification.findUnique({
      where: {
        identityId: identityId.value,
      },
      include: {
        requests: true,
      },
    });

    return verification
      ? VerificationPersistenceMapper.toDomain(verification)
      : null;
  }

  async findRequestById(id: string): Promise<VerificationRequestEntity | null> {
    const request = await this.prisma.verificationRequest.findUnique({
      where: {
        id,
      },
    });

    return request
      ? VerificationPersistenceMapper.requestToEntity(request)
      : null;
  }

  async findRequestByPublicId(
    publicId: VerificationRequestId,
  ): Promise<VerificationRequestEntity | null> {
    const request = await this.prisma.verificationRequest.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return request
      ? VerificationPersistenceMapper.requestToEntity(request)
      : null;
  }

  async existsByIdentityId(identityId: IdentityId): Promise<boolean> {
    const count = await this.prisma.verification.count({
      where: {
        identityId: identityId.value,
      },
    });

    return count > 0;
  }
}
