// -----------------------------------------------------------------------------
// Messaging — Get Messaging Messages Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Messaging Message aggregates.
//
// The query supports persistence-oriented message filtering.
//
// Cross-domain references remain opaque:
//
// - conversationPublicId references MessagingConversation.publicId;
// - senderPublicId references Identity.publicId;
// - assetPublicId references Asset.publicId.
//
// This query does NOT:
//
// - modify Messaging Message aggregates;
// - load the Messaging Conversation aggregate;
// - validate conversation membership;
// - validate Identity state;
// - validate Asset state;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization checks;
// - publish domain events.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Messaging
// -----------------------------------------------------------------------------

import type { MessagingConversationPublicId } from '../../domain/value-objects/messaging-conversation-public-id.vo';

import type { MessagingMemberPublicId } from '../../domain/value-objects/messaging-member-public-id.vo';

import type { MessagingMessageStatus } from '../../domain/value-objects/messaging-message-status.vo';

import type { MessagingMessageType } from '../../domain/value-objects/messaging-message-type.vo';

import type { MessagingAssetPublicId } from '../../domain/value-objects/messaging-asset-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetMessagingMessagesQuery implements Query {
  public constructor(
    /**
     * Optional conversation public identity filter.
     */
    public readonly conversationPublicId?: MessagingConversationPublicId,

    /**
     * Optional sender public identity filter.
     */
    public readonly senderPublicId?: MessagingMemberPublicId,

    /**
     * Optional message lifecycle status filter.
     */
    public readonly status?: MessagingMessageStatus,

    /**
     * Optional message type filter.
     */
    public readonly type?: MessagingMessageType,

    /**
     * Optional Asset public identity filter.
     */
    public readonly assetPublicId?: MessagingAssetPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMessagingMessagesQuery;
