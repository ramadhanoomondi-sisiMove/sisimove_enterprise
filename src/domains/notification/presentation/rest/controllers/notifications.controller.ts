// -----------------------------------------------------------------------------
// Notification — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Notification aggregate operations.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// NotificationDeliveryEntity is a child entity and is NOT an aggregate root.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - conversion from transport primitives to domain value objects;
// - resolution of Notification public identities into aggregates when
//   required for child-entity operations;
// - resolution of Notification Delivery public identities from the aggregate;
// - generation of application correlation identifiers;
// - dispatching Notification commands and queries;
// - mapping application/domain results to transport responses.
//
// The controller contains NO business rules.
//
// Domain behavior remains inside:
//
// - NotificationAggregate;
// - NotificationEntity;
// - NotificationDeliveryEntity.
//
// Application orchestration remains inside:
//
// - command handlers;
// - query handlers.
//
// Persistence remains behind:
//
// - NotificationRepository.
//
// -----------------------------------------------------------------------------
//
// Boundary rules:
//
// - Internal entity identifiers are never exposed to clients.
// - Notification public identities are used at the HTTP boundary.
// - Notification Delivery is a child entity of NotificationAggregate.
// - Delivery public identities are resolved from the loaded aggregate.
// - The controller never accesses Prisma or repositories directly.
// - Cross-domain references remain opaque public identities.
// - Lifecycle transitions are delegated to application/domain layers.
// - Correlation identifiers are generated at the transport boundary.
// - Response mapping is centralized in NotificationResponseMapper.
//
// -----------------------------------------------------------------------------
//
// Delivery boundary:
//
// NotificationDeliveryEntity is NOT an aggregate root.
//
// Therefore delivery operations are always scoped by:
//
// NotificationPublicId
//        ↓
// NotificationAggregate
//        ↓
// NotificationAggregate.deliveries
//        ↓
// NotificationDeliveryEntity
//
// -----------------------------------------------------------------------------
//
// Action routes:
//
// POST /notifications/:notificationPublicId/send
// POST /notifications/:notificationPublicId/read
// POST /notifications/:notificationPublicId/fail
// POST /notifications/:notificationPublicId/cancel
//
// POST /notifications/:notificationPublicId/deliveries
// POST /notifications/:notificationPublicId/deliveries/:deliveryPublicId/send
// POST /notifications/:notificationPublicId/deliveries/:deliveryPublicId/deliver
// POST /notifications/:notificationPublicId/deliveries/:deliveryPublicId/fail
// POST /notifications/:notificationPublicId/deliveries/:deliveryPublicId/cancel
//
// Actions without caller-supplied data do not bind an empty request DTO.
//
// -----------------------------------------------------------------------------
//
// Value-object boundary:
//
// HTTP primitive
//      ↓
// Domain Value Object
//      ↓
// Application Command / Query
//
// Notification public identities:
//
// string notificationPublicId
//      ↓
// new NotificationPublicId(notificationPublicId)
//
// string deliveryPublicId
//      ↓
// new NotificationDeliveryPublicId(deliveryPublicId)
//
// Cross-domain member identity:
//
// string recipientPublicId
//      ↓
// NotificationMemberPublicId
//
// Domain value objects:
//
// string type
//      ↓
// NotificationType
//
// string priority
//      ↓
// NotificationPriority
//
// string title
//      ↓
// NotificationTitle
//
// string body
//      ↓
// NotificationBody
//
// string failureReason
//      ↓
// NotificationFailureReason
//
// -----------------------------------------------------------------------------
//
// Cross-domain query references:
//
// Notification event/reference value objects are created at the HTTP boundary,
// while the current application query constructors accept primitive strings.
//
// Therefore:
//
// NotificationEventType.value
// NotificationEventPublicId.value
// NotificationReferenceType.value
// NotificationReferencePublicId.value
//
// are passed into the corresponding application queries.
//
// -----------------------------------------------------------------------------
//
// Command boundary:
//
// NotificationFailureReason is created as a domain value object at the HTTP
// boundary, then its primitive value is passed to commands because the current
// FailNotificationCommand and FailNotificationDeliveryCommand constructors
// accept string failure reasons.
//
// -----------------------------------------------------------------------------
//
// Query not-found boundary:
//
// Single-aggregate query handlers are responsible for converting a missing
// aggregate into an application/domain exception.
//
// Therefore:
//
// Repository
//      ↓
// Aggregate | null
//      ↓
// Query Handler
//      ├── Aggregate → return aggregate
//      └── null      → throw NotificationException
//
// The controller therefore does NOT perform null checks for single-aggregate
// queries and does NOT duplicate query-handler not-found behavior.
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
  Param,
  Post,
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

import { NOTIFICATION_TOKENS } from '../../../application/notification.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  CancelNotificationCommand,
  CancelNotificationDeliveryCommand,
  CreateNotificationCommand,
  CreateNotificationDeliveryCommand,
  DeliverNotificationDeliveryCommand,
  FailNotificationCommand,
  FailNotificationDeliveryCommand,
  ReadNotificationCommand,
  SendNotificationCommand,
  SendNotificationDeliveryCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetNotificationQuery,
  GetNotificationsByEventQuery,
  GetNotificationsByRecipientQuery,
  GetNotificationsByReferenceQuery,
  GetNotificationsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { NotificationAggregate } from '../../../domain/aggregates/notification.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entities
// -----------------------------------------------------------------------------

import type { NotificationDeliveryEntity } from '../../../domain/entities/notification-delivery.entity';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  NotificationBody,
  NotificationChannel,
  NotificationDeliveryPublicId,
  NotificationEventPublicId,
  NotificationEventType,
  NotificationFailureReason,
  NotificationMemberPublicId,
  NotificationPriority,
  NotificationProviderReference,
  NotificationPublicId,
  NotificationReferencePublicId,
  NotificationReferenceType,
  NotificationTitle,
  NotificationType,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  CreateNotificationDeliveryRequestDto,
  CreateNotificationRequestDto,
  FailNotificationDeliveryRequestDto,
  FailNotificationRequestDto,
  SendNotificationDeliveryRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import {
  NotificationResponseMapper,
  type NotificationDeliveryResponse,
  type NotificationResponse,
} from '../mappers/notification.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Notifications')
@ApiBearerAuth('access-token')
@Controller('notifications')
export class NotificationsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Notification Command Handlers
    // -------------------------------------------------------------------------

    @Inject(NOTIFICATION_TOKENS.COMMAND_HANDLERS.CREATE_NOTIFICATION)
    private readonly createNotificationHandler: CommandHandler<
      CreateNotificationCommand,
      NotificationAggregate
    >,

    @Inject(NOTIFICATION_TOKENS.COMMAND_HANDLERS.SEND_NOTIFICATION)
    private readonly sendNotificationHandler: CommandHandler<
      SendNotificationCommand,
      NotificationAggregate
    >,

    @Inject(NOTIFICATION_TOKENS.COMMAND_HANDLERS.READ_NOTIFICATION)
    private readonly readNotificationHandler: CommandHandler<
      ReadNotificationCommand,
      NotificationAggregate
    >,

    @Inject(NOTIFICATION_TOKENS.COMMAND_HANDLERS.FAIL_NOTIFICATION)
    private readonly failNotificationHandler: CommandHandler<
      FailNotificationCommand,
      NotificationAggregate
    >,

    @Inject(NOTIFICATION_TOKENS.COMMAND_HANDLERS.CANCEL_NOTIFICATION)
    private readonly cancelNotificationHandler: CommandHandler<
      CancelNotificationCommand,
      NotificationAggregate
    >,

    // -------------------------------------------------------------------------
    // Notification Delivery Command Handlers
    // -------------------------------------------------------------------------

    @Inject(NOTIFICATION_TOKENS.COMMAND_HANDLERS.CREATE_NOTIFICATION_DELIVERY)
    private readonly createNotificationDeliveryHandler: CommandHandler<
      CreateNotificationDeliveryCommand,
      NotificationAggregate
    >,

    @Inject(NOTIFICATION_TOKENS.COMMAND_HANDLERS.SEND_NOTIFICATION_DELIVERY)
    private readonly sendNotificationDeliveryHandler: CommandHandler<
      SendNotificationDeliveryCommand,
      NotificationAggregate
    >,

    @Inject(NOTIFICATION_TOKENS.COMMAND_HANDLERS.DELIVER_NOTIFICATION_DELIVERY)
    private readonly deliverNotificationDeliveryHandler: CommandHandler<
      DeliverNotificationDeliveryCommand,
      NotificationAggregate
    >,

    @Inject(NOTIFICATION_TOKENS.COMMAND_HANDLERS.FAIL_NOTIFICATION_DELIVERY)
    private readonly failNotificationDeliveryHandler: CommandHandler<
      FailNotificationDeliveryCommand,
      NotificationAggregate
    >,

    @Inject(NOTIFICATION_TOKENS.COMMAND_HANDLERS.CANCEL_NOTIFICATION_DELIVERY)
    private readonly cancelNotificationDeliveryHandler: CommandHandler<
      CancelNotificationDeliveryCommand,
      NotificationAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATION)
    private readonly getNotificationHandler: QueryHandler<
      GetNotificationQuery,
      NotificationAggregate
    >,

    @Inject(NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATIONS)
    private readonly getNotificationsHandler: QueryHandler<
      GetNotificationsQuery,
      readonly NotificationAggregate[]
    >,

    @Inject(NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATIONS_BY_RECIPIENT)
    private readonly getNotificationsByRecipientHandler: QueryHandler<
      GetNotificationsByRecipientQuery,
      readonly NotificationAggregate[]
    >,

    @Inject(NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATIONS_BY_EVENT)
    private readonly getNotificationsByEventHandler: QueryHandler<
      GetNotificationsByEventQuery,
      readonly NotificationAggregate[]
    >,

    @Inject(NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATIONS_BY_REFERENCE)
    private readonly getNotificationsByReferenceHandler: QueryHandler<
      GetNotificationsByReferenceQuery,
      readonly NotificationAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Notification Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Notifications
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'List notifications',
    description:
      'Returns Notification aggregates available through the Notification application query boundary.',
  })
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification:read')
  public async getNotifications(): Promise<NotificationResponse[]> {
    const query = new GetNotificationsQuery();

    const notifications = await this.getNotificationsHandler.execute(query);

    return notifications.map((notification) =>
      NotificationResponseMapper.toResponse(notification),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Notifications By Recipient
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get notifications by recipient',
    description:
      'Returns Notification aggregates belonging to a specific recipient.',
  })
  @ApiParam({
    name: 'recipientPublicId',
    type: String,
    required: true,
    description: 'Public identity of the notification recipient.',
    example: 'MEM_550e8400-e29b-41d4-a716-446655440000',
  })
  @Get('by-recipient/:recipientPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification:read')
  public async getByRecipient(
    @Param('recipientPublicId') recipientPublicId: string,
  ): Promise<NotificationResponse[]> {
    const recipient = NotificationMemberPublicId.create(recipientPublicId);

    const query = new GetNotificationsByRecipientQuery(recipient);

    const notifications =
      await this.getNotificationsByRecipientHandler.execute(query);

    return notifications.map((notification) =>
      NotificationResponseMapper.toResponse(notification),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Notifications By Event
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get notifications by event',
    description:
      'Returns Notification aggregates generated from a specific source event.',
  })
  @ApiParam({
    name: 'eventType',
    type: String,
    required: true,
    description: 'Type of the source event.',
    example: 'booking.created',
  })
  @ApiParam({
    name: 'eventPublicId',
    type: String,
    required: true,
    description: 'Public identity of the source event.',
    example: 'EVT_550e8400-e29b-41d4-a716-446655440000',
  })
  @Get('by-event/:eventType/:eventPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification:read')
  public async getByEvent(
    @Param('eventType') eventType: string,
    @Param('eventPublicId') eventPublicId: string,
  ): Promise<NotificationResponse[]> {
    const sourceEventType = NotificationEventType.create(eventType);

    const sourceEventPublicId = NotificationEventPublicId.create(eventPublicId);

    const query = new GetNotificationsByEventQuery(
      sourceEventType.value,
      sourceEventPublicId.value,
    );

    const notifications =
      await this.getNotificationsByEventHandler.execute(query);

    return notifications.map((notification) =>
      NotificationResponseMapper.toResponse(notification),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Notifications By Reference
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get notifications by reference',
    description:
      'Returns Notification aggregates associated with a referenced domain resource.',
  })
  @ApiParam({
    name: 'referenceType',
    type: String,
    required: true,
    description: 'Type of the referenced domain resource.',
    example: 'booking',
  })
  @ApiParam({
    name: 'referencePublicId',
    type: String,
    required: true,
    description: 'Public identity of the referenced domain resource.',
    example: 'BKG_550e8400-e29b-41d4-a716-446655440000',
  })
  @Get('by-reference/:referenceType/:referencePublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification:read')
  public async getByReference(
    @Param('referenceType') referenceType: string,
    @Param('referencePublicId') referencePublicId: string,
  ): Promise<NotificationResponse[]> {
    const notificationReferenceType =
      NotificationReferenceType.create(referenceType);

    const notificationReferencePublicId =
      NotificationReferencePublicId.create(referencePublicId);

    const query = new GetNotificationsByReferenceQuery(
      notificationReferenceType.value,
      notificationReferencePublicId.value,
    );

    const notifications =
      await this.getNotificationsByReferenceHandler.execute(query);

    return notifications.map((notification) =>
      NotificationResponseMapper.toResponse(notification),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Notification
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get a notification',
    description:
      'Returns a Notification aggregate identified by its public identity.',
  })
  @ApiParam({
    name: 'notificationPublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification.',
    example: 'NTF_550e8400-e29b-41d4-a716-446655440000',
  })
  @Get(':notificationPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification:read')
  public async get(
    @Param('notificationPublicId') notificationPublicId: string,
  ): Promise<NotificationResponse> {
    const notification = await this.resolveNotification(notificationPublicId);

    return NotificationResponseMapper.toResponse(notification);
  }

  // ===========================================================================
  // Notification Delivery Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Notification Deliveries
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get notification deliveries',
    description:
      'Returns the Notification Delivery child entities belonging to a Notification aggregate.',
  })
  @ApiParam({
    name: 'notificationPublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification.',
    example: 'NTF_550e8400-e29b-41d4-a716-446655440000',
  })
  @Get(':notificationPublicId/deliveries')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification-delivery:read')
  public async getDeliveries(
    @Param('notificationPublicId') notificationPublicId: string,
  ): Promise<NotificationDeliveryResponse[]> {
    const notification = await this.resolveNotification(notificationPublicId);

    return notification.deliveries.map((delivery) =>
      NotificationResponseMapper.fromDeliveryEntity(delivery),
    );
  }

  // ===========================================================================
  // Notification Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Notification
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Create a notification',
    description: 'Creates a new Notification aggregate in the pending state.',
  })
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification:create')
  public async create(
    @Body() dto: CreateNotificationRequestDto,
  ): Promise<NotificationResponse> {
    const referenceType =
      dto.referenceType === undefined
        ? undefined
        : NotificationReferenceType.create(dto.referenceType);

    const referencePublicId =
      dto.referencePublicId === undefined
        ? undefined
        : NotificationReferencePublicId.create(dto.referencePublicId);

    const eventType =
      dto.eventType === undefined
        ? undefined
        : NotificationEventType.create(dto.eventType);

    const eventPublicId =
      dto.eventPublicId === undefined
        ? undefined
        : NotificationEventPublicId.create(dto.eventPublicId);

    const command = new CreateNotificationCommand(
      NotificationMemberPublicId.create(dto.recipientPublicId),
      NotificationType.create(dto.type),
      NotificationPriority.create(dto.priority),
      NotificationTitle.create(dto.title),
      NotificationBody.create(dto.body),
      referenceType,
      referencePublicId,
      eventType,
      eventPublicId,
      randomUUID(),
    );

    const notification = await this.createNotificationHandler.execute(command);

    return NotificationResponseMapper.toResponse(notification);
  }

  // ---------------------------------------------------------------------------
  // Send Notification
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Send a notification',
    description:
      'Transitions a pending Notification to SENT according to domain lifecycle rules.',
  })
  @ApiParam({
    name: 'notificationPublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification.',
    example: 'NTF_550e8400-e29b-41d4-a716-446655440000',
  })
  @Post(':notificationPublicId/send')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification:send')
  public async send(
    @Param('notificationPublicId') notificationPublicId: string,
  ): Promise<NotificationResponse> {
    const notificationId = new NotificationPublicId(notificationPublicId);

    const command = new SendNotificationCommand(
      notificationId,
      randomUUID(),
      new Date(),
    );

    const notification = await this.sendNotificationHandler.execute(command);

    return NotificationResponseMapper.toResponse(notification);
  }

  // ---------------------------------------------------------------------------
  // Read Notification
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Mark a notification as read',
    description:
      'Marks a Notification as READ according to its domain lifecycle rules.',
  })
  @ApiParam({
    name: 'notificationPublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification.',
    example: 'NTF_550e8400-e29b-41d4-a716-446655440000',
  })
  @Post(':notificationPublicId/read')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification:read')
  public async read(
    @Param('notificationPublicId') notificationPublicId: string,
  ): Promise<NotificationResponse> {
    const notificationId = new NotificationPublicId(notificationPublicId);

    const command = new ReadNotificationCommand(
      notificationId,
      randomUUID(),
      new Date(),
    );

    const notification = await this.readNotificationHandler.execute(command);

    return NotificationResponseMapper.toResponse(notification);
  }

  // ---------------------------------------------------------------------------
  // Fail Notification
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Fail a notification',
    description:
      'Marks a Notification as FAILED with the supplied failure reason.',
  })
  @ApiParam({
    name: 'notificationPublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification.',
    example: 'NTF_550e8400-e29b-41d4-a716-446655440000',
  })
  @Post(':notificationPublicId/fail')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification:fail')
  public async fail(
    @Param('notificationPublicId') notificationPublicId: string,
    @Body() dto: FailNotificationRequestDto,
  ): Promise<NotificationResponse> {
    const notificationId = new NotificationPublicId(notificationPublicId);

    const failureReason = NotificationFailureReason.create(dto.failureReason);

    const command = new FailNotificationCommand(
      notificationId,
      failureReason.value,
      randomUUID(),
      new Date(),
    );

    const notification = await this.failNotificationHandler.execute(command);

    return NotificationResponseMapper.toResponse(notification);
  }

  // ---------------------------------------------------------------------------
  // Cancel Notification
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Cancel a notification',
    description:
      'Cancels a Notification according to its domain lifecycle rules.',
  })
  @ApiParam({
    name: 'notificationPublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification.',
    example: 'NTF_550e8400-e29b-41d4-a716-446655440000',
  })
  @Post(':notificationPublicId/cancel')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification:cancel')
  public async cancel(
    @Param('notificationPublicId') notificationPublicId: string,
  ): Promise<NotificationResponse> {
    const notificationId = new NotificationPublicId(notificationPublicId);

    const command = new CancelNotificationCommand(
      notificationId,
      randomUUID(),
      new Date(),
    );

    const notification = await this.cancelNotificationHandler.execute(command);

    return NotificationResponseMapper.toResponse(notification);
  }

  // ===========================================================================
  // Notification Delivery Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Notification Delivery
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Create a notification delivery',
    description:
      'Adds a pending Notification Delivery to the specified Notification aggregate.',
  })
  @ApiParam({
    name: 'notificationPublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification.',
    example: 'NTF_550e8400-e29b-41d4-a716-446655440000',
  })
  @Post(':notificationPublicId/deliveries')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification-delivery:create')
  public async createDelivery(
    @Param('notificationPublicId') notificationPublicId: string,
    @Body() dto: CreateNotificationDeliveryRequestDto,
  ): Promise<NotificationResponse> {
    const notificationId = new NotificationPublicId(notificationPublicId);

    const channel = NotificationChannel.create(dto.channel);

    const command = new CreateNotificationDeliveryCommand(
      notificationId,
      channel,
      randomUUID(),
    );

    const notification =
      await this.createNotificationDeliveryHandler.execute(command);

    return NotificationResponseMapper.toResponse(notification);
  }

  // ---------------------------------------------------------------------------
  // Send Notification Delivery
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Send a notification delivery',
    description:
      'Marks a pending Notification Delivery as SENT and optionally records an external provider reference.',
  })
  @ApiParam({
    name: 'notificationPublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification.',
    example: 'NTF_550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'deliveryPublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification Delivery.',
    example: 'NTD_550e8400-e29b-41d4-a716-446655440000',
  })
  @Post(':notificationPublicId/deliveries/:deliveryPublicId/send')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification-delivery:send')
  public async sendDelivery(
    @Param('notificationPublicId') notificationPublicId: string,
    @Param('deliveryPublicId') deliveryPublicId: string,
    @Body() dto: SendNotificationDeliveryRequestDto,
  ): Promise<NotificationResponse> {
    const notificationId = new NotificationPublicId(notificationPublicId);

    const notification = await this.resolveNotification(notificationPublicId);

    const delivery = this.resolveDelivery(notification, deliveryPublicId);

    const providerReference =
      dto.providerReference === undefined
        ? undefined
        : NotificationProviderReference.create(dto.providerReference);

    const command = new SendNotificationDeliveryCommand(
      notificationId,
      delivery.id,
      providerReference,
      randomUUID(),
      new Date(),
    );

    const updatedNotification =
      await this.sendNotificationDeliveryHandler.execute(command);

    return NotificationResponseMapper.toResponse(updatedNotification);
  }

  // ---------------------------------------------------------------------------
  // Deliver Notification Delivery
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Deliver a notification delivery',
    description: 'Marks a SENT Notification Delivery as DELIVERED.',
  })
  @ApiParam({
    name: 'notificationPublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification.',
    example: 'NTF_550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'deliveryPublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification Delivery.',
    example: 'NTD_550e8400-e29b-41d4-a716-446655440000',
  })
  @Post(':notificationPublicId/deliveries/:deliveryPublicId/deliver')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification-delivery:deliver')
  public async deliverDelivery(
    @Param('notificationPublicId') notificationPublicId: string,
    @Param('deliveryPublicId') deliveryPublicId: string,
  ): Promise<NotificationResponse> {
    const notificationId = new NotificationPublicId(notificationPublicId);

    const notification = await this.resolveNotification(notificationPublicId);

    const delivery = this.resolveDelivery(notification, deliveryPublicId);

    const command = new DeliverNotificationDeliveryCommand(
      notificationId,
      delivery.id,
      randomUUID(),
      new Date(),
    );

    const updatedNotification =
      await this.deliverNotificationDeliveryHandler.execute(command);

    return NotificationResponseMapper.toResponse(updatedNotification);
  }

  // ---------------------------------------------------------------------------
  // Fail Notification Delivery
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Fail a notification delivery',
    description:
      'Marks a Notification Delivery as FAILED with the supplied failure reason.',
  })
  @ApiParam({
    name: 'notificationPublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification.',
    example: 'NTF_550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'deliveryPublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification Delivery.',
    example: 'NTD_550e8400-e29b-41d4-a716-446655440000',
  })
  @Post(':notificationPublicId/deliveries/:deliveryPublicId/fail')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification-delivery:fail')
  public async failDelivery(
    @Param('notificationPublicId') notificationPublicId: string,
    @Param('deliveryPublicId') deliveryPublicId: string,
    @Body() dto: FailNotificationDeliveryRequestDto,
  ): Promise<NotificationResponse> {
    const notificationId = new NotificationPublicId(notificationPublicId);

    const notification = await this.resolveNotification(notificationPublicId);

    const delivery = this.resolveDelivery(notification, deliveryPublicId);

    const failureReason = NotificationFailureReason.create(dto.failureReason);

    const command = new FailNotificationDeliveryCommand(
      notificationId,
      delivery.id,
      failureReason.value,
      randomUUID(),
      new Date(),
    );

    const updatedNotification =
      await this.failNotificationDeliveryHandler.execute(command);

    return NotificationResponseMapper.toResponse(updatedNotification);
  }

  // ---------------------------------------------------------------------------
  // Cancel Notification Delivery
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Cancel a notification delivery',
    description:
      'Cancels a Notification Delivery according to its domain lifecycle rules.',
  })
  @ApiParam({
    name: 'notificationPublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification.',
    example: 'NTF_550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'deliveryPublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification Delivery.',
    example: 'NTD_550e8400-e29b-41d4-a716-446655440000',
  })
  @Post(':notificationPublicId/deliveries/:deliveryPublicId/cancel')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification-delivery:cancel')
  public async cancelDelivery(
    @Param('notificationPublicId') notificationPublicId: string,
    @Param('deliveryPublicId') deliveryPublicId: string,
  ): Promise<NotificationResponse> {
    const notificationId = new NotificationPublicId(notificationPublicId);

    const notification = await this.resolveNotification(notificationPublicId);

    const delivery = this.resolveDelivery(notification, deliveryPublicId);

    const command = new CancelNotificationDeliveryCommand(
      notificationId,
      delivery.id,
      randomUUID(),
      new Date(),
    );

    const updatedNotification =
      await this.cancelNotificationDeliveryHandler.execute(command);

    return NotificationResponseMapper.toResponse(updatedNotification);
  }

  // ===========================================================================
  // Internal Transport Resolution
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Resolve Notification
  // ---------------------------------------------------------------------------

  /**
   * Resolves a Notification public identity into its aggregate.
   *
   * Aggregate retrieval remains the responsibility of the application
   * query handler.
   *
   * The query handler owns the not-found behavior.
   *
   * The controller does not:
   *
   * - access repositories;
   * - access Prisma;
   * - inspect persistence models;
   * - implement Notification business rules;
   * - duplicate application-level not-found handling.
   */
  private async resolveNotification(
    notificationPublicId: string,
  ): Promise<NotificationAggregate> {
    const notificationId = new NotificationPublicId(notificationPublicId);

    return this.getNotificationHandler.execute(
      new GetNotificationQuery(notificationId),
    );
  }

  // ---------------------------------------------------------------------------
  // Resolve Notification Delivery
  // ---------------------------------------------------------------------------

  /**
   * Resolves a Notification Delivery from an already loaded
   * Notification aggregate.
   *
   * NotificationDeliveryEntity is a child entity of
   * NotificationAggregate and is therefore never resolved independently.
   */
  private resolveDelivery(
    notification: NotificationAggregate,
    deliveryPublicId: string,
  ): NotificationDeliveryEntity {
    const notificationDeliveryPublicId = new NotificationDeliveryPublicId(
      deliveryPublicId,
    );

    const delivery = notification.getDeliveryByPublicId(
      notificationDeliveryPublicId,
    );

    if (delivery === undefined) {
      throw new Error('Notification Delivery was not found.');
    }

    return delivery;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default NotificationsController;
