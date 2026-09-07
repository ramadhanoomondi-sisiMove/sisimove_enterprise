// -----------------------------------------------------------------------------
// Notification Preference — Get Notification Preference Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for retrieving a single Notification Preference
// aggregate by its public identifier.
//
// Aggregate:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// NotificationPreferenceEntity is the aggregate root entity.
//
// Responsibilities:
//
// - receive the GetNotificationPreferenceQuery;
// - retrieve the complete Notification Preference aggregate through the
//   repository;
// - return the aggregate when it exists;
// - return null when the aggregate does not exist.
//
// This handler does NOT:
//
// - modify the Notification Preference aggregate;
// - modify NotificationPreferenceEntity;
// - load Identity;
// - validate member existence;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization;
// - translate absence into an HTTP exception;
// - publish domain events;
// - perform application orchestration;
// - send notifications;
// - deliver notifications.
//
// -----------------------------------------------------------------------------
//
// Not-found boundary:
//
// Repository
//     ↓
// NotificationPreferenceAggregate | null
//     ↓
// Query Handler
//     ↓
// NotificationPreferenceAggregate | null
//     ↓
// HTTP Controller
//     ↓
// NotFoundException (404)
//
// The application layer does not translate a missing aggregate into an HTTP
// exception. HTTP-specific error translation remains the responsibility of
// the presentation layer.
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

import { GetNotificationPreferenceQuery } from '../queries/get-notification-preference.query';

// -----------------------------------------------------------------------------
// Notification Preference — Aggregate
// -----------------------------------------------------------------------------

import type { NotificationPreferenceAggregate } from '../../domain/aggregates/notification-preference.aggregate';

// -----------------------------------------------------------------------------
// Notification Preference — Repository
// -----------------------------------------------------------------------------

import type { NotificationPreferenceRepository } from '../../domain/repositories/notification-preference.repository';

// -----------------------------------------------------------------------------
// Notification — Tokens
// -----------------------------------------------------------------------------

import { NOTIFICATION_TOKENS } from '../notification.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetNotificationPreferenceHandler implements QueryHandler<
  GetNotificationPreferenceQuery,
  NotificationPreferenceAggregate | null
> {
  public constructor(
    @Inject(NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION_PREFERENCE)
    private readonly notificationPreferenceRepository: NotificationPreferenceRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetNotificationPreferenceQuery,
  ): Promise<NotificationPreferenceAggregate | null> {
    // -------------------------------------------------------------------------
    // Retrieve Aggregate
    // -------------------------------------------------------------------------
    //
    // The repository owns persistence access.
    //
    // The handler does not access Prisma directly and does not reconstruct the
    // aggregate itself.
    //

    const aggregate =
      await this.notificationPreferenceRepository.findByPublicId(
        query.publicId,
      );

    // -------------------------------------------------------------------------
    // Not Found
    // -------------------------------------------------------------------------
    //
    // Absence is a valid query result.
    //
    // Do not throw NotificationException here. The application layer should
    // remain independent of HTTP transport concerns.
    //
    // The HTTP controller translates null into NotFoundException (404).
    //

    if (aggregate === null) {
      return null;
    }

    // -------------------------------------------------------------------------
    // Return Aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationPreferenceHandler;
