// -----------------------------------------------------------------------------
// Notification — Get Notifications By Reference Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for retrieving Notification aggregates associated with
// a referenced domain resource.
//
// The reference is represented by:
//
//     referenceType
//     referencePublicId
//
// These are opaque cross-domain references.
//
// The repository performs persistence filtering only.
//
// This handler does NOT:
//
// - load the referenced aggregate;
// - validate the referenced resource;
// - dereference the resource;
// - modify Notification aggregates;
// - modify NotificationEntity;
// - modify NotificationDeliveryEntity;
// - access Prisma;
// - perform authorization;
// - publish domain events;
// - apply notification policy.
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

import { GetNotificationsByReferenceQuery } from '../queries/get-notifications-by-reference.query';

// -----------------------------------------------------------------------------
// Notification — Aggregate
// -----------------------------------------------------------------------------

import { NotificationAggregate } from '../../domain/aggregates/notification.aggregate';

// -----------------------------------------------------------------------------
// Notification — Repository
// -----------------------------------------------------------------------------

import type { NotificationRepository } from '../../domain/repositories/notification.repository';

// -----------------------------------------------------------------------------
// Notification — Tokens
// -----------------------------------------------------------------------------

import { NOTIFICATION_TOKENS } from '../notification.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetNotificationsByReferenceHandler implements QueryHandler<
  GetNotificationsByReferenceQuery,
  NotificationAggregate[]
> {
  public constructor(
    @Inject(NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(
    query: GetNotificationsByReferenceQuery,
  ): Promise<NotificationAggregate[]> {
    return this.notificationRepository.findByReferenceTypeAndReferencePublicId(
      query.referenceType,
      query.referencePublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationsByReferenceHandler;
