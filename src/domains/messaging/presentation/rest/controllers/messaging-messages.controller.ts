// -----------------------------------------------------------------------------
// Messaging — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Messaging Message aggregate operations.
//
// Aggregate:
//
//     MessagingMessageAggregate
//     └── MessagingMessageEntity
//
// -----------------------------------------------------------------------------
//
// Message operations:
//
// 1. POST   /messaging/conversations/:conversationPublicId/messages
//    Send a Messaging Message.
//
// 2. GET    /messaging/messages
//    List Messaging Messages.
//
// 3. GET    /messaging/messages/:publicId
//    Get a Messaging Message by public identity.
//
// 4. PATCH  /messaging/conversations/:conversationPublicId/messages/:publicId
//    Edit a Messaging Message.
//
// 5. PATCH  /messaging/conversations/:conversationPublicId/messages/:publicId/delete
//    Delete a Messaging Message.
//
// 6. PATCH  /messaging/conversations/:conversationPublicId/messages/:publicId/moderate
//    Moderate a Messaging Message.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - conversion of transport primitives into domain value objects;
// - resolution of Messaging Conversation public identity into an aggregate
//   where its internal identity is required by commands;
// - resolution of Messaging Message public identity into an aggregate
//   where its internal identity is required by commands;
// - verification that conversation-scoped message routes reference the resolved
//   message's owning conversation;
// - extraction of the authenticated Identity public identity;
// - conversion of the authenticated Identity public identity into the
//   MessagingMemberPublicId reference value object;
// - generation of application correlation identifiers;
// - dispatching Messaging commands and queries;
// - mapping application/domain results into transport responses.
//
// The controller contains NO domain business rules.
//
// Domain behavior remains inside:
//
// - MessagingConversationAggregate;
// - MessagingMessageAggregate;
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
// - MessagingConversationRepository;
// - MessagingMessageRepository.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// - Internal entity identifiers are never returned to clients.
// - Conversation and Message internal identities are resolved through the
//   application query boundary.
// - The route conversationPublicId is authoritative for conversation-scoped
//   message operations.
// - The route publicId is authoritative for message-scoped operations.
// - Conversation-scoped message operations verify that the resolved message
//   belongs to the route conversation.
// - The authenticated principal is supplied by JwtAuthGuard.
// - JwtStrategy establishes identityPublicId as the authenticated principal
//   identity.
// - The controller does NOT expect memberPublicId directly on request.user.
// - MessagingMemberPublicId is an external Identity-domain public identity
//   reference and is created from the authenticated identityPublicId.
// - Sender/member identity is never accepted from the HTTP request body.
// - Mutation timestamps are not accepted from HTTP.
// - The domain/application layer establishes lifecycle timestamps.
// - Response mapping is centralized in MessagingMessageResponseMapper.
// - The controller never accesses Prisma or repositories directly.
// - Lifecycle transitions are delegated entirely to command handlers/domain.
// - Correlation identifiers are generated at the transport boundary.
// - Authorization remains outside the controller's business logic.
// - Cross-domain identities remain opaque value objects.
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATED MEMBER
// -----------------------------------------------------------------------------
//
// The JWT strategy attaches:
//
//     request.user
//
// as:
//
//     AuthenticatedIdentity
//
// The authenticated principal contains:
//
//     identityPublicId
//     sessionPublicId
//     tokenId
//     authenticationVersion
//     roles
//     permissions
//
// It does NOT contain:
//
//     memberPublicId
//
// MessagingMemberPublicId is not a separately persisted Messaging identity.
//
// It is a Messaging-domain reference to the public identity owned by the
// Identity domain.
//
// Therefore the transport/application flow is:
//
//     request.user.identityPublicId
//                 |
//                 ▼
//     MessagingMemberPublicId.create(identityPublicId)
//                 |
//                 ▼
//     Messaging command
//
// The client does NOT provide:
//
//     senderPublicId
//     memberPublicId
//
// in the request body.
//
// This prevents a caller from selecting another Identity as the apparent
// sender.
//
// The controller extracts the authenticated Identity established by the
// authentication boundary and converts its public identity into the Messaging
// reference value object.
//
// -----------------------------------------------------------------------------
//
// MUTATION TIMESTAMPS
// -----------------------------------------------------------------------------
//
// The following are domain/application facts:
//
//     sentAt
//     editedAt
//     deletedAt
//     moderatedAt
//
// They are therefore NOT accepted from HTTP.
//
// The controller passes:
//
//     undefined
//
// where the command supports an optional timestamp.
//
// The domain/application layer establishes the effective timestamp.
//
// -----------------------------------------------------------------------------
//
// SEND MESSAGE
// -----------------------------------------------------------------------------
//
// The request contains only:
//
//     type
//     content
//     assetPublicId
//
// The following are established by the transport/application boundary:
//
//     conversation identity -> route
//     sender identity       -> authenticated principal
//     correlation ID        -> randomUUID()
//
// The following remain domain/application facts:
//
//     sentAt
//
// -----------------------------------------------------------------------------
//
// EDIT MESSAGE
// -----------------------------------------------------------------------------
//
// The request contains only:
//
//     content
//
// The following are established outside the request body:
//
//     conversation identity -> route
//     message identity      -> route
//     member identity       -> authenticated principal
//     correlation ID        -> randomUUID()
//
// The edit timestamp remains a domain/application fact.
//
// -----------------------------------------------------------------------------
//
// DELETE MESSAGE
// -----------------------------------------------------------------------------
//
// Deletion requires no client-provided data.
//
// The request body is intentionally empty.
//
// The following are established by the controller/application boundary:
//
//     conversation identity -> route
//     message identity      -> route
//     member identity       -> authenticated principal
//     correlation ID        -> randomUUID()
//
// The deletion timestamp remains a domain/application fact.
//
// -----------------------------------------------------------------------------
//
// MODERATE MESSAGE
// -----------------------------------------------------------------------------
//
// Moderation requires no client-provided data.
//
// The request body is intentionally empty.
//
// The following are established by the controller/application boundary:
//
//     conversation identity -> route
//     message identity      -> route
//     correlation ID        -> randomUUID()
//
// Authorization of the moderation operation is handled by the security and
// application authorization boundary.
//
// The moderation timestamp remains a domain/application fact.
//
// -----------------------------------------------------------------------------
//
// SECURITY
// -----------------------------------------------------------------------------
//
// Every Messaging Message endpoint is authenticated:
//
//     JwtAuthGuard
//
// Authorization is permission-based:
//
//     PermissionsGuard
//     @RequirePermissions(...)
//
// The controller does not implement authorization rules.
//
// -----------------------------------------------------------------------------
//
// NESTED RESOURCE CONSISTENCY
// -----------------------------------------------------------------------------
//
// For:
//
//     PATCH /messaging/conversations/:conversationPublicId/messages/:publicId
//
//     PATCH /messaging/conversations/:conversationPublicId/messages/:publicId/delete
//
//     PATCH /messaging/conversations/:conversationPublicId/messages/:publicId/moderate
//
// the controller resolves both:
//
//     Messaging Conversation
//     Messaging Message
//
// and verifies:
//
//     message.conversationPublicId === route.conversationPublicId
//
// This prevents a message from one conversation from being mutated through
// another conversation's nested route.
//
// This is route/resource consistency checking, not domain business logic.
//
// =============================================================================

// -----------------------------------------------------------------------------
// Node
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
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Express
// -----------------------------------------------------------------------------

import type { Request } from 'express';

// -----------------------------------------------------------------------------
// Security — Authentication & Authorization
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Security — Authenticated Principal
// -----------------------------------------------------------------------------

import type { AuthenticatedIdentity } from '../../../../../foundation/security/auth/authenticated-identity.interface';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application — Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { MESSAGING_TOKENS } from '../../../application/messaging.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  DeleteMessagingMessageCommand,
  EditMessagingMessageCommand,
  ModerateMessagingMessageCommand,
  SendMessagingMessageCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetMessagingConversationQuery,
  GetMessagingMessageQuery,
  GetMessagingMessagesQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregates
// -----------------------------------------------------------------------------

import type { MessagingConversationAggregate } from '../../../domain/aggregates/messaging-conversation.aggregate';

import type { MessagingMessageAggregate } from '../../../domain/aggregates/messaging-message.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  MessagingAssetPublicId,
  MessagingConversationPublicId,
  MessagingMemberPublicId,
  MessagingMessageContent,
  MessagingMessagePublicId,
  MessagingMessageStatus,
  MessagingMessageType,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  DeleteMessagingMessageRequestDto,
  EditMessagingMessageRequestDto,
  ModerateMessagingMessageRequestDto,
  SendMessagingMessageRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import { GetMessagingMessagesQueryDto } from '../dto/queries';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import {
  MessagingMessageResponseMapper,
  type MessagingMessageResponse,
} from '../mappers/messaging-message.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Messaging Messages')
@ApiBearerAuth('access-token')
@Controller('messaging')
export class MessagingMessagesController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(MESSAGING_TOKENS.COMMAND_HANDLERS.SEND_MESSAGING_MESSAGE)
    private readonly sendMessagingMessageHandler: CommandHandler<
      SendMessagingMessageCommand,
      MessagingMessageAggregate
    >,

    @Inject(MESSAGING_TOKENS.COMMAND_HANDLERS.EDIT_MESSAGING_MESSAGE)
    private readonly editMessagingMessageHandler: CommandHandler<
      EditMessagingMessageCommand,
      MessagingMessageAggregate
    >,

    @Inject(MESSAGING_TOKENS.COMMAND_HANDLERS.DELETE_MESSAGING_MESSAGE)
    private readonly deleteMessagingMessageHandler: CommandHandler<
      DeleteMessagingMessageCommand,
      MessagingMessageAggregate
    >,

    @Inject(MESSAGING_TOKENS.COMMAND_HANDLERS.MODERATE_MESSAGING_MESSAGE)
    private readonly moderateMessagingMessageHandler: CommandHandler<
      ModerateMessagingMessageCommand,
      MessagingMessageAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_CONVERSATION)
    private readonly getMessagingConversationHandler: QueryHandler<
      GetMessagingConversationQuery,
      MessagingConversationAggregate | null
    >,

    @Inject(MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_MESSAGE)
    private readonly getMessagingMessageHandler: QueryHandler<
      GetMessagingMessageQuery,
      MessagingMessageAggregate | null
    >,

    @Inject(MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_MESSAGES)
    private readonly getMessagingMessagesHandler: QueryHandler<
      GetMessagingMessagesQuery,
      readonly MessagingMessageAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Messaging Messages
  // ---------------------------------------------------------------------------
  //
  // GET /messaging/messages
  //
  // ---------------------------------------------------------------------------

  @Get('messages')
  @ApiOperation({
    summary: 'List messaging messages',
    description:
      'Returns Messaging Messages optionally filtered by conversation, sender, status, type, or asset.',
  })
  @ApiOkResponse({
    description: 'Messaging Messages retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated principal does not have the messaging-message:read permission.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-message:read')
  public async getMessages(
    @Query() dto: GetMessagingMessagesQueryDto,
  ): Promise<MessagingMessageResponse[]> {
    const conversationPublicId =
      dto.conversationPublicId === undefined
        ? undefined
        : new MessagingConversationPublicId(dto.conversationPublicId);

    const senderPublicId =
      dto.senderPublicId === undefined
        ? undefined
        : MessagingMemberPublicId.create(dto.senderPublicId);

    const status =
      dto.status === undefined
        ? undefined
        : MessagingMessageStatus.create(dto.status);

    const type =
      dto.type === undefined
        ? undefined
        : MessagingMessageType.create(dto.type);

    const assetPublicId =
      dto.assetPublicId === undefined
        ? undefined
        : MessagingAssetPublicId.create(dto.assetPublicId);

    const query = new GetMessagingMessagesQuery(
      conversationPublicId,
      senderPublicId,
      status,
      type,
      assetPublicId,
    );

    const messages = await this.getMessagingMessagesHandler.execute(query);

    return messages.map((message) =>
      MessagingMessageResponseMapper.toResponse(message),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Messaging Message
  // ---------------------------------------------------------------------------
  //
  // GET /messaging/messages/:publicId
  //
  // ---------------------------------------------------------------------------

  @Get('messages/:publicId')
  @ApiOperation({
    summary: 'Get a messaging message',
    description:
      'Returns a Messaging Message identified by its public identity.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public identifier of the Messaging Message.',
    example: 'MSG-5GH3MK',
  })
  @ApiOkResponse({
    description: 'Messaging Message retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated principal does not have the messaging-message:read permission.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-message:read')
  public async get(
    @Param('publicId') publicId: string,
  ): Promise<MessagingMessageResponse | null> {
    const message = await this.getMessagingMessageHandler.execute(
      new GetMessagingMessageQuery(new MessagingMessagePublicId(publicId)),
    );

    if (message === null) {
      return null;
    }

    return MessagingMessageResponseMapper.toResponse(message);
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Send Messaging Message
  // ---------------------------------------------------------------------------
  //
  // POST /messaging/conversations/:conversationPublicId/messages
  //
  // Actor:
  //
  //     request.user.identityPublicId
  //
  // MessagingMemberPublicId is a Messaging-domain reference to that Identity
  // public identity.
  //
  // Client does NOT provide senderPublicId.
  //
  // ---------------------------------------------------------------------------

  @Post('conversations/:conversationPublicId/messages')
  @ApiOperation({
    summary: 'Send a messaging message',
    description:
      'Sends a new Messaging Message into the specified Messaging Conversation. The sender is derived from the authenticated Identity.',
  })
  @ApiParam({
    name: 'conversationPublicId',
    type: String,
    required: true,
    description: 'Public identifier of the Messaging Conversation.',
    example: 'CON-5GH3MK',
  })
  @ApiBody({
    type: SendMessagingMessageRequestDto,
  })
  @ApiOkResponse({
    description: 'Messaging Message sent successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated principal does not have the messaging-message:create permission.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-message:create')
  public async send(
    @Req() request: Request,
    @Param('conversationPublicId') conversationPublicId: string,
    @Body() dto: SendMessagingMessageRequestDto,
  ): Promise<MessagingMessageResponse> {
    const conversation = await this.resolveConversation(conversationPublicId);

    const memberPublicId = this.resolveAuthenticatedMessagingMember(request);

    const command = new SendMessagingMessageCommand(
      conversation.id,
      new MessagingConversationPublicId(conversationPublicId),
      memberPublicId,
      MessagingMessageType.create(dto.type),
      dto.content === undefined
        ? undefined
        : MessagingMessageContent.create(dto.content),
      dto.assetPublicId === undefined
        ? undefined
        : MessagingAssetPublicId.create(dto.assetPublicId),
      undefined,
      randomUUID(),
    );

    const message = await this.sendMessagingMessageHandler.execute(command);

    return MessagingMessageResponseMapper.toResponse(message);
  }

  // ---------------------------------------------------------------------------
  // Edit Messaging Message
  // ---------------------------------------------------------------------------
  //
  // PATCH /messaging/conversations/:conversationPublicId/messages/:publicId
  //
  // Actor:
  //
  //     request.user.identityPublicId
  //
  // Request body:
  //
  //     content
  //
  // ---------------------------------------------------------------------------

  @Patch('conversations/:conversationPublicId/messages/:publicId')
  @ApiOperation({
    summary: 'Edit a messaging message',
    description:
      'Edits an existing Messaging Message according to its domain lifecycle rules. The editing member is derived from the authenticated Identity.',
  })
  @ApiParam({
    name: 'conversationPublicId',
    type: String,
    required: true,
    description:
      'Public identifier of the Messaging Conversation containing the message.',
    example: 'CON-5GH3MK',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public identifier of the Messaging Message.',
    example: 'MSG-5GH3MK',
  })
  @ApiBody({
    type: EditMessagingMessageRequestDto,
  })
  @ApiOkResponse({
    description: 'Messaging Message edited successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated principal does not have the messaging-message:update permission.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-message:update')
  public async edit(
    @Req() request: Request,
    @Param('conversationPublicId') conversationPublicId: string,
    @Param('publicId') publicId: string,
    @Body() dto: EditMessagingMessageRequestDto,
  ): Promise<MessagingMessageResponse> {
    const conversation = await this.resolveConversation(conversationPublicId);

    const message = await this.resolveMessage(publicId);

    this.ensureMessageBelongsToConversation(message, conversationPublicId);

    const memberPublicId = this.resolveAuthenticatedMessagingMember(request);

    const command = new EditMessagingMessageCommand(
      conversation.id,
      new MessagingConversationPublicId(conversationPublicId),
      message.id,
      new MessagingMessagePublicId(publicId),
      memberPublicId,
      MessagingMessageContent.create(dto.content),
      randomUUID(),
      undefined,
    );

    const updatedMessage =
      await this.editMessagingMessageHandler.execute(command);

    return MessagingMessageResponseMapper.toResponse(updatedMessage);
  }

  // ---------------------------------------------------------------------------
  // Delete Messaging Message
  // ---------------------------------------------------------------------------
  //
  // PATCH /messaging/conversations/:conversationPublicId/messages/:publicId/delete
  //
  // No request data is accepted.
  //
  // Actor:
  //
  //     request.user.identityPublicId
  //
  // ---------------------------------------------------------------------------

  @Patch('conversations/:conversationPublicId/messages/:publicId/delete')
  @ApiOperation({
    summary: 'Delete a messaging message',
    description:
      'Transitions a Messaging Message into its deleted lifecycle state. The deleting member is derived from the authenticated Identity.',
  })
  @ApiParam({
    name: 'conversationPublicId',
    type: String,
    required: true,
    description:
      'Public identifier of the Messaging Conversation containing the message.',
    example: 'CON-5GH3MK',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public identifier of the Messaging Message.',
    example: 'MSG-5GH3MK',
  })
  @ApiBody({
    type: DeleteMessagingMessageRequestDto,
  })
  @ApiOkResponse({
    description: 'Messaging Message deleted successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated principal does not have the messaging-message:delete permission.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-message:delete')
  public async delete(
    @Req() request: Request,
    @Param('conversationPublicId') conversationPublicId: string,
    @Param('publicId') publicId: string,
  ): Promise<MessagingMessageResponse> {
    const conversation = await this.resolveConversation(conversationPublicId);

    const message = await this.resolveMessage(publicId);

    this.ensureMessageBelongsToConversation(message, conversationPublicId);

    const memberPublicId = this.resolveAuthenticatedMessagingMember(request);

    const command = new DeleteMessagingMessageCommand(
      conversation.id,
      new MessagingConversationPublicId(conversationPublicId),
      message.id,
      new MessagingMessagePublicId(publicId),
      memberPublicId,
      randomUUID(),
      undefined,
    );

    const deletedMessage =
      await this.deleteMessagingMessageHandler.execute(command);

    return MessagingMessageResponseMapper.toResponse(deletedMessage);
  }

  // ---------------------------------------------------------------------------
  // Moderate Messaging Message
  // ---------------------------------------------------------------------------
  //
  // PATCH /messaging/conversations/:conversationPublicId/messages/:publicId/moderate
  //
  // No request data is accepted.
  //
  // The authenticated moderator is established by the security/application
  // authorization boundary.
  //
  // ---------------------------------------------------------------------------

  @Patch('conversations/:conversationPublicId/messages/:publicId/moderate')
  @ApiOperation({
    summary: 'Moderate a messaging message',
    description:
      'Transitions a Messaging Message into its moderated lifecycle state. Moderation authorization is handled by the security/application boundary.',
  })
  @ApiParam({
    name: 'conversationPublicId',
    type: String,
    required: true,
    description:
      'Public identifier of the Messaging Conversation containing the message.',
    example: 'CON-5GH3MK',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public identifier of the Messaging Message.',
    example: 'MSG-5GH3MK',
  })
  @ApiBody({
    type: ModerateMessagingMessageRequestDto,
  })
  @ApiOkResponse({
    description: 'Messaging Message moderated successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated principal does not have the messaging-message:moderate permission.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('messaging-message:moderate')
  public async moderate(
    @Param('conversationPublicId') conversationPublicId: string,
    @Param('publicId') publicId: string,
  ): Promise<MessagingMessageResponse> {
    const conversation = await this.resolveConversation(conversationPublicId);

    const message = await this.resolveMessage(publicId);

    this.ensureMessageBelongsToConversation(message, conversationPublicId);

    const command = new ModerateMessagingMessageCommand(
      conversation.id,
      new MessagingConversationPublicId(conversationPublicId),
      message.id,
      new MessagingMessagePublicId(publicId),
      randomUUID(),
      undefined,
    );

    const moderatedMessage =
      await this.moderateMessagingMessageHandler.execute(command);

    return MessagingMessageResponseMapper.toResponse(moderatedMessage);
  }

  // ===========================================================================
  // Internal Transport Resolution
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Resolve Messaging Conversation
  // ---------------------------------------------------------------------------

  /**
   * Resolves a Messaging Conversation public identity into its aggregate.
   *
   * The query handler owns aggregate retrieval.
   *
   * The controller does not:
   *
   * - access repositories;
   * - access Prisma;
   * - inspect persistence models;
   * - validate Messaging Conversation business rules.
   */
  private async resolveConversation(
    conversationPublicId: string,
  ): Promise<MessagingConversationAggregate> {
    const conversation = await this.getMessagingConversationHandler.execute(
      new GetMessagingConversationQuery(
        new MessagingConversationPublicId(conversationPublicId),
      ),
    );

    if (conversation === null) {
      throw new UnauthorizedException(
        'Messaging Conversation was not found or is not accessible.',
      );
    }

    return conversation;
  }

  // ---------------------------------------------------------------------------
  // Resolve Messaging Message
  // ---------------------------------------------------------------------------

  /**
   * Resolves a Messaging Message public identity into its aggregate.
   *
   * The query handler owns aggregate retrieval.
   *
   * The controller does not:
   *
   * - access repositories;
   * - access Prisma;
   * - inspect persistence models;
   * - validate Messaging Message business rules.
   */
  private async resolveMessage(
    messagePublicId: string,
  ): Promise<MessagingMessageAggregate> {
    const message = await this.getMessagingMessageHandler.execute(
      new GetMessagingMessageQuery(
        new MessagingMessagePublicId(messagePublicId),
      ),
    );

    if (message === null) {
      throw new UnauthorizedException(
        'Messaging Message was not found or is not accessible.',
      );
    }

    return message;
  }

  // ---------------------------------------------------------------------------
  // Ensure Message Belongs To Conversation
  // ---------------------------------------------------------------------------

  /**
   * Ensures that a message resolved by its public identity belongs to the
   * Messaging Conversation identified by the nested route.
   *
   * This is transport/application resource consistency checking.
   *
   * It does not replace:
   *
   * - domain lifecycle validation;
   * - authorization;
   * - aggregate invariants.
   */
  private ensureMessageBelongsToConversation(
    message: MessagingMessageAggregate,
    conversationPublicId: string,
  ): void {
    if (!message.belongsToConversationPublicId(conversationPublicId)) {
      throw new UnauthorizedException(
        'Messaging Message does not belong to the specified Messaging Conversation.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Get Authenticated Identity
  // ---------------------------------------------------------------------------

  /**
   * Retrieves the authenticated Identity principal established by JwtStrategy.
   *
   * JwtAuthGuard has already authenticated the request.
   *
   * This helper does NOT:
   *
   * - decode JWTs;
   * - verify JWTs;
   * - inspect Authorization headers;
   * - resolve permissions;
   * - access persistence.
   *
   * It only validates and narrows the principal shape established by the
   * authentication boundary.
   */
  private getAuthenticatedIdentity(request: Request): AuthenticatedIdentity {
    const user: unknown = request.user;

    if (user === null || typeof user !== 'object') {
      throw new UnauthorizedException('Authenticated principal is missing.');
    }

    const principal = user as Record<string, unknown>;

    // -------------------------------------------------------------------------
    // Identity Public ID
    // -------------------------------------------------------------------------

    const identityPublicId = principal.identityPublicId;

    if (
      typeof identityPublicId !== 'string' ||
      identityPublicId.trim().length === 0
    ) {
      throw new UnauthorizedException(
        'Authenticated principal does not contain identityPublicId.',
      );
    }

    // -------------------------------------------------------------------------
    // Session Public ID
    // -------------------------------------------------------------------------

    const sessionPublicId = principal.sessionPublicId;

    if (
      typeof sessionPublicId !== 'string' ||
      sessionPublicId.trim().length === 0
    ) {
      throw new UnauthorizedException(
        'Authenticated principal does not contain sessionPublicId.',
      );
    }

    // -------------------------------------------------------------------------
    // Token ID
    // -------------------------------------------------------------------------

    const tokenId = principal.tokenId;

    if (typeof tokenId !== 'string' || tokenId.trim().length === 0) {
      throw new UnauthorizedException(
        'Authenticated principal does not contain tokenId.',
      );
    }

    // -------------------------------------------------------------------------
    // Authentication Version
    // -------------------------------------------------------------------------

    const authenticationVersion = principal.authenticationVersion;

    if (
      typeof authenticationVersion !== 'number' ||
      !Number.isSafeInteger(authenticationVersion) ||
      authenticationVersion < 1
    ) {
      throw new UnauthorizedException(
        'Authenticated principal contains an invalid authentication version.',
      );
    }

    // -------------------------------------------------------------------------
    // Roles
    // -------------------------------------------------------------------------

    const rolesValue = principal.roles;

    if (!Array.isArray(rolesValue)) {
      throw new UnauthorizedException(
        'Authenticated principal roles are invalid.',
      );
    }

    const roles: string[] = [];

    for (const role of rolesValue) {
      if (typeof role !== 'string') {
        throw new UnauthorizedException(
          'Authenticated principal contains an invalid role.',
        );
      }

      roles.push(role);
    }

    // -------------------------------------------------------------------------
    // Permissions
    // -------------------------------------------------------------------------

    const permissionsValue = principal.permissions;

    if (!Array.isArray(permissionsValue)) {
      throw new UnauthorizedException(
        'Authenticated principal permissions are invalid.',
      );
    }

    const permissions: string[] = [];

    for (const permission of permissionsValue) {
      if (typeof permission !== 'string') {
        throw new UnauthorizedException(
          'Authenticated principal contains an invalid permission.',
        );
      }

      permissions.push(permission);
    }

    // -------------------------------------------------------------------------
    // Authenticated Identity
    // -------------------------------------------------------------------------

    return {
      identityPublicId: identityPublicId.trim(),
      sessionPublicId: sessionPublicId.trim(),
      tokenId: tokenId.trim(),
      authenticationVersion,
      roles: Object.freeze(roles),
      permissions: Object.freeze(permissions),
    };
  }

  // ---------------------------------------------------------------------------
  // Resolve Authenticated Messaging Member
  // ---------------------------------------------------------------------------

  /**
   * Converts the authenticated Identity public identity into the Messaging
   * domain's external identity reference.
   *
   * MessagingMemberPublicId does not represent a Messaging-owned Member
   * aggregate. It is a reference to the public identity owned by the Identity
   * domain.
   *
   * Therefore no:
   *
   * - repository;
   * - Prisma query;
   * - DI resolver;
   * - Messaging Member lookup;
   * - additional application service
   *
   * is required here.
   *
   * Authentication establishes the identity.
   *
   * Messaging wraps that identity in its own domain value object.
   */
  private resolveAuthenticatedMessagingMember(
    request: Request,
  ): MessagingMemberPublicId {
    const identity = this.getAuthenticatedIdentity(request);

    return MessagingMemberPublicId.create(identity.identityPublicId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default MessagingMessagesController;
