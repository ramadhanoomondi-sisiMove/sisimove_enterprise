// -----------------------------------------------------------------------------
// Notification Preference — Get Notification Preference By Member Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for retrieving the Notification Preference aggregate
// belonging to a specific member.
//
// Aggregate:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// NotificationPreferenceEntity is the aggregate root entity.
//
// The member public identifier is an opaque reference to:
//
//     Identity.publicId
//
// Because NotificationPreference.memberPublicId is unique in persistence,
// this query returns at most one Notification Preference aggregate.
//
// Responsibilities:
//
// - receive the GetNotificationPreferenceByMemberQuery;
// - retrieve the Notification Preference aggregate through the repository;
// - return the aggregate to the caller.
//
// This handler does NOT:
//
// - load the Identity aggregate;
// - validate that the member exists;
// - validate member state;
// - perform authorization;
// - modify the Notification Preference aggregate;
// - modify NotificationPreferenceEntity;
// - access Prisma;
// - access infrastructure directly;
// - publish domain events;
// - perform application orchestration;
// - send notifications;
// - deliver notifications.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import { GetNotificationPreferenceByMemberQuery } from '../queries/get-notification-preference-by-member.query';

// -----------------------------------------------------------------------------
// Notification Preference — Aggregate
// -----------------------------------------------------------------------------

import { NotificationPreferenceAggregate } from '../../domain/aggregates/notification-preference.aggregate';

// -----------------------------------------------------------------------------
// Notification Preference — Repository
// -----------------------------------------------------------------------------

import type { NotificationPreferenceRepository } from '../../domain/repositories/notification-preference.repository';

// -----------------------------------------------------------------------------
// Notification — Exception
// -----------------------------------------------------------------------------

import { NotificationException } from '../../domain/exceptions/notification.exception';

// -----------------------------------------------------------------------------
// Notification — Tokens
// -----------------------------------------------------------------------------

import { NOTIFICATION_TOKENS } from '../notification.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetNotificationPreferenceByMemberHandler implements QueryHandler<
  GetNotificationPreferenceByMemberQuery,
  NotificationPreferenceAggregate
> {
  public constructor(
    @Inject(NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION_PREFERENCE)
    private readonly notificationPreferenceRepository: NotificationPreferenceRepository,
  ) {}

  public async execute(
    query: GetNotificationPreferenceByMemberQuery,
  ): Promise<NotificationPreferenceAggregate> {
    const aggregate =
      await this.notificationPreferenceRepository.findByMemberPublicId(
        query.memberPublicId,
      );

    if (aggregate === null) {
      throw new NotificationException(
        `Notification preference for member '${query.memberPublicId.value}' was not found.`,
      );
    }

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationPreferenceByMemberHandler;
