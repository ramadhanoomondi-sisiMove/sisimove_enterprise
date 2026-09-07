// -----------------------------------------------------------------------------
// Notification Preference — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Notification Preference aggregate operations.
//
// Aggregate:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// NotificationPreferenceEntity is the aggregate root entity.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - conversion from transport primitives to domain value objects;
// - dispatching Notification Preference commands and queries;
// - generating application correlation identifiers;
// - mapping application/domain results to transport responses.
//
// The controller contains NO business rules.
//
// Domain behavior remains inside:
//
// - NotificationPreferenceAggregate;
// - NotificationPreferenceEntity.
//
// Application orchestration remains inside:
//
// - command handlers;
// - query handlers.
//
// Persistence remains behind:
//
// - NotificationPreferenceRepository.
//
// -----------------------------------------------------------------------------
//
// Boundary rules:
//
// - Internal entity identifiers are never exposed to clients.
// - Notification Preference public identity is used at the HTTP boundary.
// - Member public identity remains an opaque Identity-domain reference.
// - The controller never accesses Prisma or repositories directly.
// - Aggregate invariants remain inside the domain layer.
// - Preference mutations are delegated to the aggregate/application layer.
// - Correlation identifiers are generated at the transport boundary.
// - Response mapping is centralized in NotificationPreferenceResponseMapper.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// NotificationPreferenceAggregate
//        │
//        └── NotificationPreferenceEntity
//
// The NotificationPreferenceEntity is the aggregate root.
//
// There are no child entities exposed by this controller.
//
// -----------------------------------------------------------------------------
//
// Routes:
//
// GET   /notification-preferences/by-member/:memberPublicId
// GET   /notification-preferences/:preferencePublicId
//
// POST  /notification-preferences
// PATCH /notification-preferences/:preferencePublicId
//
// Static routes are declared before dynamic routes for predictable routing.
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
// preferencePublicId
//      ↓
// new NotificationPreferencePublicId(...)
//
// memberPublicId
//      ↓
// NotificationMemberPublicId.create(...)
//
// -----------------------------------------------------------------------------
//
// Preference update:
//
// The update command represents the complete desired preference state:
//
// - Journey
// - Booking
// - Payment
// - Wallet
// - Trust
// - Verification
// - Message
// - Support
// - System
//
// The controller does not decide how those values are applied.
// The application handler delegates the requested state to the aggregate.
//
// -----------------------------------------------------------------------------

import { randomUUID } from 'node:crypto';

import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';
import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { NOTIFICATION_TOKENS } from '../../../application/notification.tokens';

import {
  CreateNotificationPreferenceCommand,
  UpdateNotificationPreferenceCommand,
} from '../../../application/commands';

import {
  GetNotificationPreferenceByMemberQuery,
  GetNotificationPreferenceQuery,
} from '../../../application/queries';

import type { NotificationPreferenceAggregate } from '../../../domain/aggregates/notification-preference.aggregate';

import {
  NotificationMemberPublicId,
  NotificationPreferencePublicId,
} from '../../../domain/value-objects';

import {
  CreateNotificationPreferenceRequestDto,
  UpdateNotificationPreferenceRequestDto,
} from '../dto/request';

import {
  NotificationPreferenceResponseMapper,
  type NotificationPreferenceResponse,
} from '../mappers/notification-preference.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Notification Preferences')
@ApiBearerAuth('access-token')
@Controller('notification-preferences')
export class NotificationPreferencesController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(NOTIFICATION_TOKENS.COMMAND_HANDLERS.CREATE_NOTIFICATION_PREFERENCE)
    private readonly createNotificationPreferenceHandler: CommandHandler<
      CreateNotificationPreferenceCommand,
      NotificationPreferenceAggregate
    >,

    @Inject(NOTIFICATION_TOKENS.COMMAND_HANDLERS.UPDATE_NOTIFICATION_PREFERENCE)
    private readonly updateNotificationPreferenceHandler: CommandHandler<
      UpdateNotificationPreferenceCommand,
      NotificationPreferenceAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATION_PREFERENCE)
    private readonly getNotificationPreferenceHandler: QueryHandler<
      GetNotificationPreferenceQuery,
      NotificationPreferenceAggregate | null
    >,

    @Inject(
      NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATION_PREFERENCE_BY_MEMBER,
    )
    private readonly getNotificationPreferenceByMemberHandler: QueryHandler<
      GetNotificationPreferenceByMemberQuery,
      NotificationPreferenceAggregate | null
    >,
  ) {}

  // ===========================================================================
  // Get Preference By Member
  // ===========================================================================

  @ApiOperation({
    summary: 'Get notification preferences by member',
    description:
      'Returns the Notification Preference aggregate belonging to a member.',
  })
  @ApiParam({
    name: 'memberPublicId',
    type: String,
    required: true,
    description:
      'Public identity of the member whose notification preferences are being retrieved.',
    example: 'MEM_550e8400-e29b-41d4-a716-446655440000',
  })
  @Get('by-member/:memberPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification-preference:read')
  public async getByMember(
    @Param('memberPublicId') memberPublicId: string,
  ): Promise<NotificationPreferenceResponse> {
    // -------------------------------------------------------------------------
    // Transport Primitive → Domain Value Object
    // -------------------------------------------------------------------------

    const memberId = NotificationMemberPublicId.create(memberPublicId);

    // -------------------------------------------------------------------------
    // Query
    // -------------------------------------------------------------------------

    const query = new GetNotificationPreferenceByMemberQuery(memberId);

    const preference =
      await this.getNotificationPreferenceByMemberHandler.execute(query);

    // -------------------------------------------------------------------------
    // Not Found
    // -------------------------------------------------------------------------

    if (preference === null) {
      throw new NotFoundException(
        'Notification preference was not found for the specified member.',
      );
    }

    // -------------------------------------------------------------------------
    // Response Mapping
    // -------------------------------------------------------------------------

    return NotificationPreferenceResponseMapper.toResponse(preference);
  }

  // ===========================================================================
  // Get Preference
  // ===========================================================================

  @ApiOperation({
    summary: 'Get notification preferences',
    description:
      'Returns a Notification Preference aggregate identified by its public identity.',
  })
  @ApiParam({
    name: 'preferencePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification Preference aggregate.',
    example: 'NTP_550e8400-e29b-41d4-a716-446655440000',
  })
  @Get(':preferencePublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification-preference:read')
  public async get(
    @Param('preferencePublicId') preferencePublicId: string,
  ): Promise<NotificationPreferenceResponse> {
    // -------------------------------------------------------------------------
    // Transport Primitive → Domain Value Object
    // -------------------------------------------------------------------------
    //
    // NotificationPreferencePublicId uses a constructor-based API.
    //
    // Do NOT use:
    //
    //   NotificationPreferencePublicId.create(...)
    //
    // because the value object does not expose a static create() method.
    //

    const preferenceId = new NotificationPreferencePublicId(preferencePublicId);

    // -------------------------------------------------------------------------
    // Query
    // -------------------------------------------------------------------------

    const query = new GetNotificationPreferenceQuery(preferenceId);

    const preference =
      await this.getNotificationPreferenceHandler.execute(query);

    // -------------------------------------------------------------------------
    // Not Found
    // -------------------------------------------------------------------------

    if (preference === null) {
      throw new NotFoundException('Notification preference was not found.');
    }

    // -------------------------------------------------------------------------
    // Response Mapping
    // -------------------------------------------------------------------------

    return NotificationPreferenceResponseMapper.toResponse(preference);
  }

  // ===========================================================================
  // Create Preference
  // ===========================================================================

  @ApiOperation({
    summary: 'Create notification preferences',
    description:
      'Creates a Notification Preference aggregate for a member. Newly created preferences use the entity default state.',
  })
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification-preference:create')
  public async create(
    @Body() dto: CreateNotificationPreferenceRequestDto,
  ): Promise<NotificationPreferenceResponse> {
    // -------------------------------------------------------------------------
    // Transport Primitive → Domain Value Object
    // -------------------------------------------------------------------------

    const memberPublicId = NotificationMemberPublicId.create(
      dto.memberPublicId,
    );

    // -------------------------------------------------------------------------
    // Command
    // -------------------------------------------------------------------------
    //
    // Creation intentionally carries only the member identity.
    //
    // The NotificationPreferenceEntity owns its initial/default preference
    // state. The controller does not duplicate or define those defaults.
    //
    // createdAt and causationId are omitted because the command constructor
    // provides defaults for them.
    //

    const command = new CreateNotificationPreferenceCommand(
      memberPublicId,
      randomUUID(),
    );

    // -------------------------------------------------------------------------
    // Command Execution
    // -------------------------------------------------------------------------

    const preference =
      await this.createNotificationPreferenceHandler.execute(command);

    // -------------------------------------------------------------------------
    // Response Mapping
    // -------------------------------------------------------------------------

    return NotificationPreferenceResponseMapper.toResponse(preference);
  }

  // ===========================================================================
  // Update Preference
  // ===========================================================================

  @ApiOperation({
    summary: 'Update notification preferences',
    description:
      'Updates the complete notification preference state of a Notification Preference aggregate.',
  })
  @ApiParam({
    name: 'preferencePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Notification Preference aggregate.',
    example: 'NTP_550e8400-e29b-41d4-a716-446655440000',
  })
  @Patch(':preferencePublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('notification-preference:update')
  public async update(
    @Param('preferencePublicId') preferencePublicId: string,
    @Body() dto: UpdateNotificationPreferenceRequestDto,
  ): Promise<NotificationPreferenceResponse> {
    // -------------------------------------------------------------------------
    // Transport Primitive → Domain Value Object
    // -------------------------------------------------------------------------

    const preferenceId = new NotificationPreferencePublicId(preferencePublicId);

    // -------------------------------------------------------------------------
    // Command
    // -------------------------------------------------------------------------
    //
    // The request DTO represents the complete desired preference state.
    //
    // The controller simply transfers those values into the application
    // command. It does not decide how the aggregate applies them.
    //
    // updatedAt and causationId are omitted because the command constructor
    // provides defaults for them.
    //

    const command = new UpdateNotificationPreferenceCommand(
      preferenceId,
      dto.journeyEnabled,
      dto.bookingEnabled,
      dto.paymentEnabled,
      dto.walletEnabled,
      dto.trustEnabled,
      dto.verificationEnabled,
      dto.messageEnabled,
      dto.supportEnabled,
      dto.systemEnabled,
      randomUUID(),
    );

    // -------------------------------------------------------------------------
    // Command Execution
    // -------------------------------------------------------------------------

    const preference =
      await this.updateNotificationPreferenceHandler.execute(command);

    // -------------------------------------------------------------------------
    // Response Mapping
    // -------------------------------------------------------------------------

    return NotificationPreferenceResponseMapper.toResponse(preference);
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default NotificationPreferencesController;
