// -----------------------------------------------------------------------------
// Messaging — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Messaging Conversation aggregate operations.
//
// Aggregate:
//
// MessagingConversationAggregate
// ├── MessagingConversationEntity
// ├── MessagingConversationParticipantEntity[]
// └── MessagingMessageEntity[]
//
// -----------------------------------------------------------------------------
//
// Conversation operations:
//
// 1. POST   /messaging/conversations
//    Create a Messaging Conversation.
//
// 2. GET    /messaging/conversations
//    List Messaging Conversations.
//
// 3. GET    /messaging/conversations/journey/:journeyPublicId
//    Get Messaging Conversations by Journey.
//
// 4. GET    /messaging/conversations/booking/:bookingPublicId
//    Get Messaging Conversations by Booking.
//
// 5. GET    /messaging/conversations/:publicId
//    Get a Messaging Conversation by public identity.
//
// 6. POST   /messaging/conversations/:publicId/participants
//    Add a participant.
//
// 7. PATCH  /messaging/conversations/:publicId/participants/:participantPublicId/leave
//    Leave a conversation.
//
// 8. PATCH  /messaging/conversations/:publicId/participants/:participantPublicId/remove
//    Remove a participant.
//
// 9. PATCH  /messaging/conversations/:publicId/participants/:participantPublicId/read
//    Mark a conversation as read.
//
// 10. PATCH /messaging/conversations/:publicId/close
//     Close a Messaging Conversation.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - conversion from transport primitives to domain value objects;
// - resolution of participant public identities into internal identities;
// - generation of application correlation identifiers;
// - dispatching Messaging commands and queries;
// - mapping application/domain results to transport responses.
//
// The controller contains NO business rules.
//
// Domain behavior remains inside:
//
// - MessagingConversationAggregate;
// - MessagingConversationEntity;
// - MessagingConversationParticipantEntity;
// - MessagingMessageEntity.
//
// Application orchestration remains inside:
//
// - command handlers;
// - query handlers.
//
// Persistence remains behind:
//
// - MessagingConversationRepository.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// - Internal entity identifiers are never returned to clients.
// - Internal conversation and participant identities are resolved through the
//   query boundary when required by application commands.
// - The controller never accesses Prisma or repositories directly.
// - Cross-domain references remain opaque public identities.
// - Lifecycle transitions are delegated entirely to command handlers/domain.
// - Correlation identifiers are generated at the transport boundary.
// - Creation-event recording remains the responsibility of the create handler.
// - The route conversation publicId is authoritative for conversation commands.
// - The route participant publicId is authoritative for participant commands.
// - Response mapping is centralized in MessagingConversationResponseMapper.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Node.js
// -----------------------------------------------------------------------------

import { randomUUID } from 'node:crypto';

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Foundation — Security
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { MESSAGING_TOKENS } from '../../../application/messaging.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  AddMessagingParticipantCommand,
  CloseMessagingConversationCommand,
  CreateMessagingConversationCommand,
  LeaveMessagingConversationCommand,
  MarkMessagingConversationReadCommand,
  RemoveMessagingParticipantCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetMessagingConversationByBookingQuery,
  GetMessagingConversationByJourneyQuery,
  GetMessagingConversationQuery,
  GetMessagingConversationsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { MessagingConversationAggregate } from '../../../domain/aggregates/messaging-conversation.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entities
// -----------------------------------------------------------------------------

import type { MessagingConversationParticipantEntity } from '../../../domain/entities/messaging-conversation-participant.entity';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  MessagingBookingPublicId,
  MessagingConversationParticipantPublicId,
  MessagingConversationPublicId,
  MessagingConversationStatus,
  MessagingConversationType,
  MessagingJourneyPublicId,
  MessagingMemberPublicId,
  MessagingParticipantRole,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  AddMessagingParticipantRequestDto,
  CreateMessagingConversationRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTO
// -----------------------------------------------------------------------------
//
// Import the concrete DTO directly rather than through the query barrel.
// This ensures TypeScript and typescript-eslint resolve the DTO's declared
// properties instead of treating the imported type as unresolved/unsafe.
//

import { GetMessagingConversationsQueryDto } from '../dto/queries/get-messaging-conversations.query.dto';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import {
  MessagingConversationResponseMapper,
  type MessagingConversationResponse,
} from '../mappers/messaging-conversation.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Messaging Conversations')
@ApiBearerAuth('access-token')
@Controller('messaging/conversations')
export class MessagingConversationsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(MESSAGING_TOKENS.COMMAND_HANDLERS.CREATE_MESSAGING_CONVERSATION)
    private readonly createMessagingConversationHandler: CommandHandler<
      CreateMessagingConversationCommand,
      MessagingConversationAggregate
    >,

    @Inject(MESSAGING_TOKENS.COMMAND_HANDLERS.ADD_MESSAGING_PARTICIPANT)
    private readonly addMessagingParticipantHandler: CommandHandler<
      AddMessagingParticipantCommand,
      MessagingConversationAggregate
    >,

    @Inject(MESSAGING_TOKENS.COMMAND_HANDLERS.LEAVE_MESSAGING_CONVERSATION)
    private readonly leaveMessagingConversationHandler: CommandHandler<
      LeaveMessagingConversationCommand,
      MessagingConversationAggregate
    >,

    @Inject(MESSAGING_TOKENS.COMMAND_HANDLERS.REMOVE_MESSAGING_PARTICIPANT)
    private readonly removeMessagingParticipantHandler: CommandHandler<
      RemoveMessagingParticipantCommand,
      MessagingConversationAggregate
    >,

    @Inject(MESSAGING_TOKENS.COMMAND_HANDLERS.MARK_MESSAGING_CONVERSATION_READ)
    private readonly markMessagingConversationReadHandler: CommandHandler<
      MarkMessagingConversationReadCommand,
      MessagingConversationAggregate
    >,

    @Inject(MESSAGING_TOKENS.COMMAND_HANDLERS.CLOSE_MESSAGING_CONVERSATION)
    private readonly closeMessagingConversationHandler: CommandHandler<
      CloseMessagingConversationCommand,
      MessagingConversationAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_CONVERSATION)
    private readonly getMessagingConversationHandler: QueryHandler<
      GetMessagingConversationQuery,
      MessagingConversationAggregate | null
    >,

    @Inject(MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_CONVERSATIONS)
    private readonly getMessagingConversationsHandler: QueryHandler<
      GetMessagingConversationsQuery,
      readonly MessagingConversationAggregate[]
    >,

    @Inject(
      MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_CONVERSATION_BY_JOURNEY,
    )
    private readonly getMessagingConversationByJourneyHandler: QueryHandler<
      GetMessagingConversationByJourneyQuery,
      readonly MessagingConversationAggregate[]
    >,

    @Inject(
      MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_CONVERSATION_BY_BOOKING,
    )
    private readonly getMessagingConversationByBookingHandler: QueryHandler<
      GetMessagingConversationByBookingQuery,
      readonly MessagingConversationAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Messaging Conversations
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'List messaging conversations',
    description:
      'Returns Messaging Conversations optionally filtered by conversation type and lifecycle status.',
  })
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-conversation:read')
  public async getConversations(
    @Query() dto: GetMessagingConversationsQueryDto,
  ): Promise<MessagingConversationResponse[]> {
    const type =
      dto.type === undefined
        ? undefined
        : MessagingConversationType.create(dto.type);

    const status =
      dto.status === undefined
        ? undefined
        : MessagingConversationStatus.create(dto.status);

    const query = new GetMessagingConversationsQuery(type, status);

    const conversations =
      await this.getMessagingConversationsHandler.execute(query);

    return conversations.map((conversation) =>
      MessagingConversationResponseMapper.toResponse(conversation),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Messaging Conversations By Journey
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get messaging conversations by journey',
    description:
      'Returns Messaging Conversations associated with the specified Journey public identity.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the associated Journey.',
    example: 'JNY_550e8400-e29b-41d4-a716-446655440000',
  })
  @Get('journey/:journeyPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-conversation:read')
  public async getByJourney(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<MessagingConversationResponse[]> {
    const query = new GetMessagingConversationByJourneyQuery(
      MessagingJourneyPublicId.create(journeyPublicId),
    );

    const conversations =
      await this.getMessagingConversationByJourneyHandler.execute(query);

    return conversations.map((conversation) =>
      MessagingConversationResponseMapper.toResponse(conversation),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Messaging Conversations By Booking
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get messaging conversations by booking',
    description:
      'Returns Messaging Conversations associated with the specified Booking public identity.',
  })
  @ApiParam({
    name: 'bookingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the associated Booking.',
    example: 'BKG_550e8400-e29b-41d4-a716-446655440000',
  })
  @Get('booking/:bookingPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-conversation:read')
  public async getByBooking(
    @Param('bookingPublicId') bookingPublicId: string,
  ): Promise<MessagingConversationResponse[]> {
    const query = new GetMessagingConversationByBookingQuery(
      MessagingBookingPublicId.create(bookingPublicId),
    );

    const conversations =
      await this.getMessagingConversationByBookingHandler.execute(query);

    return conversations.map((conversation) =>
      MessagingConversationResponseMapper.toResponse(conversation),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Messaging Conversation
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get a messaging conversation',
    description:
      'Returns a Messaging Conversation identified by its public identity.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the Messaging Conversation.',
    example: 'MSG_CON_550e8400-e29b-41d4-a716-446655440000',
  })
  @Get(':publicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-conversation:read')
  public async get(
    @Param('publicId') publicId: string,
  ): Promise<MessagingConversationResponse | null> {
    const conversation = await this.getMessagingConversationHandler.execute(
      new GetMessagingConversationQuery(
        new MessagingConversationPublicId(publicId),
      ),
    );

    if (conversation === null) {
      return null;
    }

    return MessagingConversationResponseMapper.toResponse(conversation);
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Messaging Conversation
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Create a messaging conversation',
    description:
      'Creates a new Messaging Conversation associated with a Journey and optionally a Booking.',
  })
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-conversation:create')
  public async create(
    @Body() dto: CreateMessagingConversationRequestDto,
  ): Promise<MessagingConversationResponse> {
    const command = new CreateMessagingConversationCommand(
      MessagingConversationType.create(dto.type),

      MessagingJourneyPublicId.create(dto.journeyPublicId),

      dto.bookingPublicId === undefined
        ? undefined
        : MessagingBookingPublicId.create(dto.bookingPublicId),

      randomUUID(),
    );

    const conversation =
      await this.createMessagingConversationHandler.execute(command);

    return MessagingConversationResponseMapper.toResponse(conversation);
  }

  // ---------------------------------------------------------------------------
  // Add Messaging Participant
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Add a messaging conversation participant',
    description:
      'Adds a member as an active participant to the specified Messaging Conversation.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the Messaging Conversation.',
    example: 'MSG_CON_550e8400-e29b-41d4-a716-446655440000',
  })
  @Post(':publicId/participants')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-conversation-participant:create')
  public async addParticipant(
    @Param('publicId') publicId: string,
    @Body() dto: AddMessagingParticipantRequestDto,
  ): Promise<MessagingConversationResponse> {
    const conversation = await this.resolveConversation(publicId);

    const command = new AddMessagingParticipantCommand(
      conversation.id,

      conversation.publicId,

      MessagingMemberPublicId.create(dto.memberPublicId),

      MessagingParticipantRole.create(dto.role),

      randomUUID(),
    );

    const updatedConversation =
      await this.addMessagingParticipantHandler.execute(command);

    return MessagingConversationResponseMapper.toResponse(updatedConversation);
  }

  // ---------------------------------------------------------------------------
  // Leave Messaging Conversation
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Leave a messaging conversation',
    description:
      'Transitions the specified participant from active participation to left.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the Messaging Conversation.',
    example: 'MSG_CON_550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'participantPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Messaging Conversation participant.',
    example: 'MSG_PART_550e8400-e29b-41d4-a716-446655440000',
  })
  @Patch(':publicId/participants/:participantPublicId/leave')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-conversation-participant:leave')
  public async leaveParticipant(
    @Param('publicId') publicId: string,
    @Param('participantPublicId') participantPublicId: string,
  ): Promise<MessagingConversationResponse> {
    const conversation = await this.resolveConversation(publicId);

    const participant = this.resolveParticipant(
      conversation,
      participantPublicId,
    );

    const command = new LeaveMessagingConversationCommand(
      conversation.id,

      conversation.publicId,

      participant.id,

      participant.publicId,

      randomUUID(),
    );

    const updatedConversation =
      await this.leaveMessagingConversationHandler.execute(command);

    return MessagingConversationResponseMapper.toResponse(updatedConversation);
  }

  // ---------------------------------------------------------------------------
  // Remove Messaging Participant
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Remove a messaging conversation participant',
    description:
      'Removes the specified participant from active participation in the Messaging Conversation.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the Messaging Conversation.',
    example: 'MSG_CON_550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'participantPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Messaging Conversation participant.',
    example: 'MSG_PART_550e8400-e29b-41d4-a716-446655440000',
  })
  @Patch(':publicId/participants/:participantPublicId/remove')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-conversation-participant:remove')
  public async removeParticipant(
    @Param('publicId') publicId: string,
    @Param('participantPublicId') participantPublicId: string,
  ): Promise<MessagingConversationResponse> {
    const conversation = await this.resolveConversation(publicId);

    const participant = this.resolveParticipant(
      conversation,
      participantPublicId,
    );

    const command = new RemoveMessagingParticipantCommand(
      conversation.id,

      conversation.publicId,

      participant.id,

      participant.publicId,

      randomUUID(),
    );

    const updatedConversation =
      await this.removeMessagingParticipantHandler.execute(command);

    return MessagingConversationResponseMapper.toResponse(updatedConversation);
  }

  // ---------------------------------------------------------------------------
  // Mark Messaging Conversation Read
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Mark a messaging conversation as read',
    description:
      'Records that the specified participant has read the Messaging Conversation up to the current timestamp.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the Messaging Conversation.',
    example: 'MSG_CON_550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'participantPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Messaging Conversation participant.',
    example: 'MSG_PART_550e8400-e29b-41d4-a716-446655440000',
  })
  @Patch(':publicId/participants/:participantPublicId/read')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-conversation-participant:read')
  public async markRead(
    @Param('publicId') publicId: string,
    @Param('participantPublicId') participantPublicId: string,
  ): Promise<MessagingConversationResponse> {
    const conversation = await this.resolveConversation(publicId);

    const participant = this.resolveParticipant(
      conversation,
      participantPublicId,
    );

    const command = new MarkMessagingConversationReadCommand(
      conversation.id,

      conversation.publicId,

      participant.id,

      participant.publicId,

      new Date(),

      randomUUID(),
    );

    const updatedConversation =
      await this.markMessagingConversationReadHandler.execute(command);

    return MessagingConversationResponseMapper.toResponse(updatedConversation);
  }

  // ---------------------------------------------------------------------------
  // Close Messaging Conversation
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Close a messaging conversation',
    description:
      'Closes a Messaging Conversation according to its domain lifecycle rules.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the Messaging Conversation.',
    example: 'MSG_CON_550e8400-e29b-41d4-a716-446655440000',
  })
  @Patch(':publicId/close')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-conversation:close')
  public async close(
    @Param('publicId') publicId: string,
  ): Promise<MessagingConversationResponse> {
    const conversation = await this.resolveConversation(publicId);

    const command = new CloseMessagingConversationCommand(
      conversation.id,

      conversation.publicId,

      randomUUID(),
    );

    const updatedConversation =
      await this.closeMessagingConversationHandler.execute(command);

    return MessagingConversationResponseMapper.toResponse(updatedConversation);
  }

  // ===========================================================================
  // Internal Transport Resolution
  // ===========================================================================

  /**
   * Resolves a Messaging Conversation public identity into the aggregate
   * required by commands that need the internal conversation identity.
   *
   * The query handler owns aggregate retrieval.
   *
   * The controller does not:
   *
   * - access repositories;
   * - access Prisma;
   * - inspect persistence models;
   * - validate conversation business rules.
   */
  private async resolveConversation(
    publicId: string,
  ): Promise<MessagingConversationAggregate> {
    const conversation = await this.getMessagingConversationHandler.execute(
      new GetMessagingConversationQuery(
        new MessagingConversationPublicId(publicId),
      ),
    );

    if (conversation === null) {
      throw new NotFoundException('Messaging Conversation was not found.');
    }

    return conversation;
  }

  /**
   * Resolves a participant public identity from within the already loaded
   * Messaging Conversation aggregate.
   *
   * This does not access persistence or another aggregate boundary.
   *
   * The participant belongs to the Messaging Conversation aggregate and is
   * therefore resolved from the aggregate already loaded through the query
   * boundary.
   */
  private resolveParticipant(
    conversation: MessagingConversationAggregate,
    participantPublicId: string,
  ): MessagingConversationParticipantEntity {
    const publicIdentity = new MessagingConversationParticipantPublicId(
      participantPublicId,
    );

    const participant = conversation.participants.find((candidate) =>
      candidate.publicId.equals(publicIdentity),
    );

    if (participant === undefined) {
      throw new NotFoundException(
        'Messaging Conversation participant was not found.',
      );
    }

    return participant;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default MessagingConversationsController;
