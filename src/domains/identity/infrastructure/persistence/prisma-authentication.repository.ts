// src/domains/identity/infrastructure/persistence/prisma-authentication.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

import type { AuthenticationAggregate } from '../../domain/aggregates/authentication.aggregate';
import type { AuthenticationEntity } from '../../domain/entities/authentication.entity';
import type { PasswordHistoryEntity } from '../../domain/entities/password-history.entity';
import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

import type { AuthenticationId } from '../../domain/value-objects/authentication-id.vo';
import type { IdentityId } from '../../domain/value-objects/identity-id.vo';

import { AuthenticationPersistenceMapper } from '../../presentation/rest/mappers/authentication-persistence.mapper';

@Injectable()
export class AuthenticationPrismaRepository implements AuthenticationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(aggregate: AuthenticationAggregate): Promise<void> {
    const authentication =
      AuthenticationPersistenceMapper.toPersistence(aggregate);

    const passwordHistories = aggregate.passwordHistory.map((history) =>
      AuthenticationPersistenceMapper.passwordHistoryToPersistence(history),
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.authentication.upsert({
        where: {
          id: authentication.id,
        },
        create: authentication,
        update: authentication,
      });

      await tx.passwordHistory.deleteMany({
        where: {
          authenticationId: aggregate.id.value,
        },
      });

      if (passwordHistories.length > 0) {
        await tx.passwordHistory.createMany({
          data: passwordHistories,
        });
      }
    });
  }

  async delete(aggregate: AuthenticationAggregate): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.passwordHistory.deleteMany({
        where: {
          authenticationId: aggregate.id.value,
        },
      });

      await tx.authentication.delete({
        where: {
          id: aggregate.id.value,
        },
      });
    });
  }

  async findByPublicId(
    publicId: AuthenticationId,
  ): Promise<AuthenticationAggregate | null> {
    const authentication = await this.prisma.authentication.findUnique({
      where: {
        publicId: publicId.value,
      },
      include: {
        passwordHistories: {
          orderBy: {
            version: 'asc',
          },
        },
      },
    });

    if (!authentication) {
      return null;
    }

    return AuthenticationPersistenceMapper.toDomain(
      authentication,
      authentication.passwordHistories,
    );
  }

  async findByIdentityId(
    identityId: IdentityId,
  ): Promise<AuthenticationAggregate | null> {
    const authentication = await this.prisma.authentication.findUnique({
      where: {
        identityId: identityId.value,
      },
      include: {
        passwordHistories: {
          orderBy: {
            version: 'asc',
          },
        },
      },
    });

    if (!authentication) {
      return null;
    }

    return AuthenticationPersistenceMapper.toDomain(
      authentication,
      authentication.passwordHistories,
    );
  }

  async findEntityByPublicId(
    publicId: AuthenticationId,
  ): Promise<AuthenticationEntity | null> {
    const authentication = await this.prisma.authentication.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return authentication
      ? AuthenticationPersistenceMapper.toEntity(authentication)
      : null;
  }

  async findEntityByIdentityId(
    identityId: IdentityId,
  ): Promise<AuthenticationEntity | null> {
    const authentication = await this.prisma.authentication.findUnique({
      where: {
        identityId: identityId.value,
      },
    });

    return authentication
      ? AuthenticationPersistenceMapper.toEntity(authentication)
      : null;
  }

  async findPasswordHistory(
    authenticationId: string,
  ): Promise<PasswordHistoryEntity[]> {
    const histories = await this.prisma.passwordHistory.findMany({
      where: {
        authenticationId,
      },
      orderBy: {
        version: 'asc',
      },
    });

    return histories.map((history) =>
      AuthenticationPersistenceMapper.toPasswordHistoryEntity(history),
    );
  }

  async findLatestPasswordHistory(
    authenticationId: string,
  ): Promise<PasswordHistoryEntity | null> {
    const history = await this.prisma.passwordHistory.findFirst({
      where: {
        authenticationId,
      },
      orderBy: {
        version: 'desc',
      },
    });

    return history
      ? AuthenticationPersistenceMapper.toPasswordHistoryEntity(history)
      : null;
  }

  async existsByIdentityId(identityId: IdentityId): Promise<boolean> {
    const count = await this.prisma.authentication.count({
      where: {
        identityId: identityId.value,
      },
    });

    return count > 0;
  }

  async existsByPublicId(publicId: AuthenticationId): Promise<boolean> {
    const count = await this.prisma.authentication.count({
      where: {
        publicId: publicId.value,
      },
    });

    return count > 0;
  }
}
