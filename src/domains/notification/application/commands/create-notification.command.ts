// -----------------------------------------------------------------------------
// Notification — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating a Notification aggregate.
//
// The command expresses the intent to create a new Notification.
//
// Responsibilities:
//
// - carry the Notification recipient;
// - carry the Notification type;
// - carry the Notification priority;
// - carry the Notification title;
// - carry the Notification body;
// - optionally carry a Notification reference type;
// - optionally carry a Notification reference public identity;
// - optionally carry a Notification event type;
// - optionally carry a Notification event public identity;
// - carry correlation/causation metadata.
//
// This command does NOT:
//
// - create NotificationEntity;
// - create NotificationAggregate;
// - create NotificationDeliveryEntity;
// - access repositories;
// - access Prisma;
// - validate external aggregate existence;
// - authorize the caller;
// - publish domain events.
//
// Domain-owned Notification fields are represented by Notification value
// objects.
//
// Cross-domain references remain opaque to Notification. Their identities are
// represented by Notification-specific value objects rather than external
// domain entities or aggregates.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { NotificationMemberPublicId } from '../../domain/value-objects/notification-member-public-id.vo';
import type { NotificationType } from '../../domain/value-objects/notification-type.vo';
import type { NotificationPriority } from '../../domain/value-objects/notification-priority.vo';
import type { NotificationTitle } from '../../domain/value-objects/notification-title.vo';
import type { NotificationBody } from '../../domain/value-objects/notification-body.vo';
import type { NotificationReferenceType } from '../../domain/value-objects/notification-reference-type.vo';
import type { NotificationReferencePublicId } from '../../domain/value-objects/notification-reference-public-id.vo';
import type { NotificationEventType } from '../../domain/value-objects/notification-event-type.vo';
import type { NotificationEventPublicId } from '../../domain/value-objects/notification-event-public-id.vo';

export class CreateNotificationCommand implements Command {
  public constructor(
    public readonly recipientPublicId: NotificationMemberPublicId,
    public readonly type: NotificationType,
    public readonly priority: NotificationPriority,
    public readonly title: NotificationTitle,
    public readonly body: NotificationBody,
    public readonly referenceType:
      NotificationReferenceType | undefined = undefined,
    public readonly referencePublicId:
      NotificationReferencePublicId | undefined = undefined,
    public readonly eventType: NotificationEventType | undefined = undefined,
    public readonly eventPublicId:
      NotificationEventPublicId | undefined = undefined,
    public readonly correlationId: string,
    public readonly createdAt: Date | undefined = undefined,
    public readonly causationId?: string,
  ) {}
}

export default CreateNotificationCommand;
