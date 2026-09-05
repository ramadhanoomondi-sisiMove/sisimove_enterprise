// -----------------------------------------------------------------------------
// Messaging — Get Messaging Message Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving one Messaging Message aggregate
// by its public identifier.
//
// Query:
// - GetMessagingMessageQuery
//
// Repository:
// - MessagingMessageRepository.findByPublicId()
//
// Responsibilities:
//
// - load the Messaging Message aggregate by public identity;
// - fail when the requested aggregate does not exist;
// - return the aggregate to the application/query boundary.
//
// This handler does NOT:
//
// - modify the aggregate;
// - persist anything;
// - access Prisma directly;
// - perform authorization;
// - publish domain events;
// - load the Messaging Conversation aggregate;
// - validate conversation membership;
// - load Identity aggregates;
// - load Asset aggregates;
// - perform message lifecycle operations.
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
// Messaging
// -----------------------------------------------------------------------------

import { MESSAGING_TOKENS } from '../messaging.tokens';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type GetMessagingMessageQuery from '../queries/get-messaging-message.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { MessagingMessageAggregate } from '../../domain/aggregates/messaging-message.aggregate';

import type { MessagingMessageRepository } from '../../domain/repositories/messaging-message.repository';

import { MessagingMessageNotFoundException } from '../../domain/exceptions/messaging-message-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetMessagingMessageHandler implements QueryHandler<
  GetMessagingMessageQuery,
  MessagingMessageAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(MESSAGING_TOKENS.REPOSITORIES.MESSAGING_MESSAGE)
    private readonly messagingMessageRepository: MessagingMessageRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Retrieves a Messaging Message aggregate by public identifier.
   */
  public async execute(
    query: GetMessagingMessageQuery,
  ): Promise<MessagingMessageAggregate> {
    const aggregate = await this.messagingMessageRepository.findByPublicId(
      query.publicId,
    );

    if (aggregate === null) {
      throw new MessagingMessageNotFoundException(query.publicId.value);
    }

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMessagingMessageHandler;
