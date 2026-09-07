// -----------------------------------------------------------------------------
// Notification — Get Notification Preference Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a Notification Preference aggregate by its
// public identity.
//
// Aggregate:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// Responsibilities:
//
// - identify the Notification Preference to retrieve;
// - carry the Notification Preference public identity into the application
//   query pipeline.
//
// This query does NOT:
//
// - access repositories;
// - access Prisma;
// - contain business rules;
// - perform authorization;
// - mutate the Notification Preference aggregate.
//
// The query handler is responsible for retrieving the aggregate through the
// NotificationPreferenceRepository.
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';
import type { NotificationPreferencePublicId } from '../../domain/value-objects/notification-preference-public-id.vo';

export class GetNotificationPreferenceQuery implements Query {
  public constructor(
    public readonly publicId: NotificationPreferencePublicId,
  ) {}
}

export default GetNotificationPreferenceQuery;
