// -----------------------------------------------------------------------------
// Notification — Get Notification Preference By Member Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a Notification Preference aggregate by the
// public identity of its owning member.
//
// Aggregate:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// Responsibilities:
//
// - identify the member whose Notification Preference should be retrieved;
// - carry the member public identity into the application query pipeline.
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
import type { NotificationMemberPublicId } from '../../domain/value-objects/notification-member-public-id.vo';

export class GetNotificationPreferenceByMemberQuery implements Query {
  public constructor(
    public readonly memberPublicId: NotificationMemberPublicId,
  ) {}
}

export default GetNotificationPreferenceByMemberQuery;
