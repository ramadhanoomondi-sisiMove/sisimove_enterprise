// -----------------------------------------------------------------------------
// Messaging Conversation — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating a Messaging Conversation aggregate.
//
// The command expresses the intent to create a new Messaging Conversation.
//
// Responsibilities:
//
// - carry the conversation type;
// - carry the Journey public identity;
// - optionally carry the Booking public identity;
// - carry correlation/causation metadata.
//
// This command does NOT:
//
// - create entities;
// - create aggregates;
// - access repositories;
// - access Prisma;
// - validate Journey existence;
// - validate Booking existence;
// - authorize the caller;
// - publish domain events.
//
// Entity construction and aggregate creation belong to the application
// handler and domain model.
//
// Cross-domain references remain opaque to this command. Cross-aggregate
// validation belongs to the application/domain workflow.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Messaging
// -----------------------------------------------------------------------------

import type { MessagingConversationType } from '../../domain/value-objects/messaging-conversation-type.vo';

import type { MessagingJourneyPublicId } from '../../domain/value-objects/messaging-journey-public-id.vo';

import type { MessagingBookingPublicId } from '../../domain/value-objects/messaging-booking-public-id.vo';

// =============================================================================
// Command
// =============================================================================

export class CreateMessagingConversationCommand implements Command {
  public constructor(
    public readonly type: MessagingConversationType,
    public readonly journeyPublicId: MessagingJourneyPublicId,
    public readonly bookingPublicId:
      MessagingBookingPublicId | undefined = undefined,
    public readonly correlationId: string,
    public readonly createdAt: Date | undefined = undefined,
    public readonly causationId?: string,
  ) {}
}

export default CreateMessagingConversationCommand;
