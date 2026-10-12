// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding HTTP Controller
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Bind HTTP requests and route parameters.
// - Resolve the authenticated identity through CurrentIdentity.
// - Convert transport primitives into domain value objects.
// - Dispatch application commands and queries.
// - Map application results into HTTP response models.
//
// Architectural rules:
// - No business logic in the controller.
// - No direct persistence access.
// - No aggregate mutation outside application handlers.
// - Authenticated identity is never accepted from an untrusted request body.
// - Existing Journey Boarding operations retain their application boundaries.
//
// -----------------------------------------------------------------------------

import { randomUUID } from 'node:crypto';

import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  CurrentIdentity,
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
  type AuthenticatedIdentity,
} from '../../../../../foundation/security/auth';

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';
import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { JOURNEY_BOARDING_TOKENS } from '../../../application/journey-boarding.tokens';

// -----------------------------------------------------------------------------
// Response Mapper
// -----------------------------------------------------------------------------

import JourneyBoardingResponseMapper, {
  JourneyBoardingParticipantResponse,
  JourneyBoardingResponse,
} from '../mappers/journey-boarding-response.mapper';

// -----------------------------------------------------------------------------
// Application Commands
// -----------------------------------------------------------------------------

import {
  BoardPassengerCommand,
  BoardProviderCommand,
  CancelJourneyBoardingCommand,
  CreateJourneyBoardingCommand,
  MarkPassengerNoShowCommand,
  OpenJourneyBoardingCommand,
  RemoveParticipantCommand,
  StartJourneyCommand,
  WithdrawParticipantCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application Queries
// -----------------------------------------------------------------------------

import {
  GetJourneyBoardingByJourneyQuery,
  GetJourneyBoardingParticipantsQuery,
  GetJourneyBoardingQuery,
  GetParticipantSummaryQuery,
  ListJourneyBoardingsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain Aggregates and Entities
// -----------------------------------------------------------------------------

import type { JourneyBoardingAggregate } from '../../../domain/aggregates/journey-boarding.aggregate';

import type { JourneyBoardingEntity } from '../../../domain/entities/journey-boarding.entity';
import type { JourneyBoardingParticipantEntity } from '../../../domain/entities/journey-boarding-participant.entity';

// -----------------------------------------------------------------------------
// Journey Boarding Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyBoardingJourneyId,
  JourneyBoardingMemberPublicId,
  JourneyBoardingParticipantPublicId,
  JourneyBoardingProviderPublicId,
  JourneyBoardingPublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Journey Value Objects
// -----------------------------------------------------------------------------

import { JourneyPublicId } from '../../../../trust/domain/value-objects';

// -----------------------------------------------------------------------------
// Identity Value Objects
// -----------------------------------------------------------------------------

import { IdentityPublicId } from '../../../../identity/domain/value-objects/identity-public-id.vo';

// -----------------------------------------------------------------------------
// Request DTOs
// -----------------------------------------------------------------------------

import {
  BoardPassengerDto,
  BoardProviderDto,
  CancelJourneyBoardingDto,
  CreateJourneyBoardingDto,
  MarkPassengerNoShowDto,
  OpenJourneyBoardingDto,
  RemoveParticipantDto,
  StartJourneyDto,
  WithdrawParticipantDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Command Handler Result Types
// -----------------------------------------------------------------------------

import type { BoardPassengerResult } from '../../../application/command-handlers/board-passenger.handler';
import type { StartJourneyResult } from '../../../application/command-handlers/start-journey.handler';
import type { CancelJourneyBoardingResult } from '../../../application/command-handlers/cancel-journey-boarding.handler';
import type { MarkPassengerNoShowResult } from '../../../application/command-handlers/mark-passenger-no-show.handler';
import type { WithdrawParticipantResult } from '../../../application/command-handlers/withdraw-participant.handler';
import type { RemoveParticipantResult } from '../../../application/command-handlers/remove-participant.handler';

// -----------------------------------------------------------------------------
// Provider Summary Response
// -----------------------------------------------------------------------------

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Journey Boardings')
@ApiBearerAuth('access-token')
@Controller('journey-boardings')
export class JourneyBoardingController {
  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createJourneyBoardingHandler: CommandHandler<
      CreateJourneyBoardingCommand,
      JourneyBoardingAggregate
    >,

    @Inject(JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.OPEN)
    private readonly openJourneyBoardingHandler: CommandHandler<
      OpenJourneyBoardingCommand,
      JourneyBoardingAggregate
    >,

    @Inject(JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.START_JOURNEY)
    private readonly startJourneyHandler: CommandHandler<
      StartJourneyCommand,
      StartJourneyResult
    >,

    @Inject(JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelJourneyBoardingHandler: CommandHandler<
      CancelJourneyBoardingCommand,
      CancelJourneyBoardingResult
    >,

    @Inject(JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.BOARD_PROVIDER)
    private readonly boardProviderHandler: CommandHandler<
      BoardProviderCommand,
      JourneyBoardingAggregate
    >,

    @Inject(JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.BOARD_PASSENGER)
    private readonly boardPassengerHandler: CommandHandler<
      BoardPassengerCommand,
      BoardPassengerResult
    >,

    @Inject(JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.MARK_PASSENGER_NO_SHOW)
    private readonly markPassengerNoShowHandler: CommandHandler<
      MarkPassengerNoShowCommand,
      MarkPassengerNoShowResult
    >,

    @Inject(JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.WITHDRAW_PARTICIPANT)
    private readonly withdrawParticipantHandler: CommandHandler<
      WithdrawParticipantCommand,
      WithdrawParticipantResult
    >,

    @Inject(JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.REMOVE_PARTICIPANT)
    private readonly removeParticipantHandler: CommandHandler<
      RemoveParticipantCommand,
      RemoveParticipantResult
    >,

    // -------------------------------------------------------------------------
    // Journey Boarding Query Handlers
    // -------------------------------------------------------------------------

    @Inject(JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.GET)
    private readonly getJourneyBoardingHandler: QueryHandler<
      GetJourneyBoardingQuery,
      JourneyBoardingAggregate
    >,

    @Inject(JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.GET_BY_JOURNEY)
    private readonly getJourneyBoardingByJourneyHandler: QueryHandler<
      GetJourneyBoardingByJourneyQuery,
      JourneyBoardingAggregate
    >,

    @Inject(JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.LIST)
    private readonly listJourneyBoardingsHandler: QueryHandler<
      ListJourneyBoardingsQuery,
      JourneyBoardingEntity[]
    >,

    @Inject(JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.GET_PARTICIPANTS)
    private readonly getJourneyBoardingParticipantsHandler: QueryHandler<
      GetJourneyBoardingParticipantsQuery,
      JourneyBoardingParticipantEntity[]
    >,

    // -------------------------------------------------------------------------
    // Provider Summary Query Handler
    // -------------------------------------------------------------------------

    @Inject(JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.GET_PARTICIPANT_SUMMARY)
    private readonly getParticipantSummaryHandler: QueryHandler<
      GetParticipantSummaryQuery,
      GetJourneyBoardingParticipantsQuery
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // List Journey Boardings
  // ---------------------------------------------------------------------------

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('boarding:read')
  @ApiOperation({
    summary: 'List journey boardings',
    description: 'Returns journey boarding records accessible to the caller.',
  })
  public async list(): Promise<JourneyBoardingEntity[]> {
    return this.listJourneyBoardingsHandler.execute(
      new ListJourneyBoardingsQuery(),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Journey Boarding by Journey
  // ---------------------------------------------------------------------------

  @Get('journey/:journeyId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('boarding:read')
  @ApiOperation({
    summary: 'Get journey boarding by journey',
    description:
      'Returns the boarding aggregate associated with the specified journey.',
  })
  @ApiParam({
    name: 'journeyId',
    type: String,
    required: true,
    description: 'Public identifier of the journey.',
  })
  public async getByJourney(
    @Param('journeyId') journeyId: string,
  ): Promise<JourneyBoardingResponse> {
    const aggregate = await this.getJourneyBoardingByJourneyHandler.execute(
      new GetJourneyBoardingByJourneyQuery(new JourneyPublicId(journeyId)),
    );

    return JourneyBoardingResponseMapper.toResponse(aggregate, journeyId);
  }

  // ---------------------------------------------------------------------------
  // Get Participant Summary
  // ---------------------------------------------------------------------------

  @Get(
    ':journeyBoardingPublicId/participants/:participantIdentityPublicId/summary',
  )
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('boarding:read')
  @ApiOperation({
    summary: 'Get journey boarding participant summary',
    description:
      'Returns a participant profile, verification status, ratings, and trust information after confirming that the requester and target belong to the specified Journey Boarding.',
  })
  @ApiParam({
    name: 'journeyBoardingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Boarding aggregate.',
  })
  @ApiParam({
    name: 'participantIdentityPublicId',
    type: String,
    required: true,
    description:
      'Identity public ID of the participant whose summary is requested.',
  })
  public async getParticipantSummary(
    @Param('journeyBoardingPublicId')
    journeyBoardingPublicId: string,
    @Param('participantIdentityPublicId')
    participantIdentityPublicId: string,
    @CurrentIdentity() identity: AuthenticatedIdentity,
  ): Promise<GetJourneyBoardingParticipantsQuery> {
    const boarding = await this.getJourneyBoardingHandler.execute(
      new GetJourneyBoardingQuery(
        new JourneyBoardingPublicId(journeyBoardingPublicId),
      ),
    );

    const requesterMemberPublicId = new JourneyBoardingMemberPublicId(
      identity.identityPublicId,
    );

    const requesterIsProvider =
      boarding.providerPublicId.value === identity.identityPublicId;

    const requesterIsParticipant = boarding.participants.some((participant) =>
      participant.memberPublicId.equals(requesterMemberPublicId),
    );

    if (!requesterIsProvider && !requesterIsParticipant) {
      throw new ForbiddenException(
        'You must belong to this journey boarding to view participant summaries.',
      );
    }

    const targetIsProvider =
      boarding.providerPublicId.value === participantIdentityPublicId;

    const targetIsParticipant = boarding.participants.some(
      (participant) =>
        participant.memberPublicId.value === participantIdentityPublicId,
    );

    if (!targetIsProvider && !targetIsParticipant) {
      throw new NotFoundException(
        'The requested participant does not belong to this journey boarding.',
      );
    }

    return this.getParticipantSummaryHandler.execute(
      new GetParticipantSummaryQuery(
        new IdentityPublicId(participantIdentityPublicId),
        new IdentityPublicId(identity.identityPublicId),
      ),
    );
  }
  // ---------------------------------------------------------------------------
  // List Boarding Participants
  // ---------------------------------------------------------------------------

  @Get(':journeyBoardingPublicId/participants')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('boarding:read')
  @ApiOperation({
    summary: 'List boarding participants',
    description:
      'Returns participants belonging to the specified Journey Boarding.',
  })
  @ApiParam({
    name: 'journeyBoardingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Boarding aggregate.',
  })
  public async getParticipants(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
  ): Promise<JourneyBoardingParticipantResponse[]> {
    const participants =
      await this.getJourneyBoardingParticipantsHandler.execute(
        new GetJourneyBoardingParticipantsQuery(
          new JourneyBoardingPublicId(journeyBoardingPublicId),
        ),
      );

    return JourneyBoardingResponseMapper.participantsToResponse(participants);
  }

  // ---------------------------------------------------------------------------
  // Get Journey Boarding by Public ID
  // ---------------------------------------------------------------------------

  @Get(':journeyBoardingPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('boarding:read')
  @ApiOperation({
    summary: 'Get journey boarding',
    description: 'Returns a journey boarding aggregate by its public ID.',
  })
  @ApiParam({
    name: 'journeyBoardingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Boarding aggregate.',
  })
  public async getByPublicId(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
  ): Promise<JourneyBoardingAggregate> {
    return this.getJourneyBoardingHandler.execute(
      new GetJourneyBoardingQuery(
        new JourneyBoardingPublicId(journeyBoardingPublicId),
      ),
    );
  }

  // ===========================================================================
  // Create and Open Boarding
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Journey Boarding
  // ---------------------------------------------------------------------------

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('boarding:create')
  @ApiOperation({
    summary: 'Create journey boarding',
    description:
      'Creates a boarding aggregate for the journey and authenticated provider.',
  })
  public async create(
    @Body() dto: CreateJourneyBoardingDto,
    @CurrentIdentity() identity: AuthenticatedIdentity,
  ): Promise<JourneyBoardingAggregate> {
    const command = new CreateJourneyBoardingCommand(
      JourneyBoardingJourneyId.create(dto.journeyId),
      new JourneyBoardingProviderPublicId(identity.identityPublicId),
      randomUUID(),
      dto.causationId,
    );

    return this.createJourneyBoardingHandler.execute(command);
  }

  // ---------------------------------------------------------------------------
  // Open Journey Boarding
  // ---------------------------------------------------------------------------

  @Post(':journeyBoardingPublicId/open')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('boarding:open')
  @ApiOperation({
    summary: 'Open journey boarding',
    description: 'Opens boarding for the specified journey.',
  })
  public async open(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Body() dto: OpenJourneyBoardingDto,
  ): Promise<JourneyBoardingAggregate> {
    const command = new OpenJourneyBoardingCommand(
      journeyBoardingPublicId,
      randomUUID(),
      dto.causationId,
      dto.boardingStartedAt !== undefined
        ? new Date(dto.boardingStartedAt)
        : undefined,
    );

    return this.openJourneyBoardingHandler.execute(command);
  }

  // ===========================================================================
  // Journey Lifecycle
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Start Journey
  // ---------------------------------------------------------------------------

  @Post(':journeyBoardingPublicId/start')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('boarding:start')
  @ApiOperation({
    summary: 'Start journey',
    description: 'Records the start of the journey.',
  })
  public async startJourney(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Body() dto: StartJourneyDto,
  ): Promise<JourneyBoardingResponse> {
    const command = new StartJourneyCommand(
      new JourneyBoardingPublicId(journeyBoardingPublicId),
      randomUUID(),
      dto.causationId,
      dto.journeyStartedAt !== undefined
        ? new Date(dto.journeyStartedAt)
        : undefined,
    );

    const result = await this.startJourneyHandler.execute(command);

    return JourneyBoardingResponseMapper.toResponse(
      result.aggregate,
      result.journeyPublicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Cancel Journey Boarding
  // ---------------------------------------------------------------------------

  @Post(':journeyBoardingPublicId/cancel')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('boarding:cancel')
  @ApiOperation({
    summary: 'Cancel journey boarding',
    description:
      'Cancels the specified boarding with the authenticated identity as actor.',
  })
  public async cancel(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Body() dto: CancelJourneyBoardingDto,
    @CurrentIdentity() identity: AuthenticatedIdentity,
  ): Promise<JourneyBoardingResponse> {
    const actorPublicId = new JourneyBoardingMemberPublicId(
      identity.identityPublicId,
    );

    const command = new CancelJourneyBoardingCommand(
      new JourneyBoardingPublicId(journeyBoardingPublicId),
      randomUUID(),
      actorPublicId,
      dto.causationId,
      dto.cancelledAt !== undefined ? new Date(dto.cancelledAt) : undefined,
    );

    const result = await this.cancelJourneyBoardingHandler.execute(command);

    return JourneyBoardingResponseMapper.toResponse(
      result.aggregate,
      result.journeyPublicId,
    );
  }

  // ===========================================================================
  // Provider Boarding
  // ===========================================================================

  @Post(':journeyBoardingPublicId/provider/board')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('boarding:board:provider')
  @ApiOperation({
    summary: 'Board provider',
    description: 'Records the provider boarding the journey.',
  })
  public async boardProvider(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Body() dto: BoardProviderDto,
  ): Promise<JourneyBoardingAggregate> {
    const command = new BoardProviderCommand(
      journeyBoardingPublicId,
      randomUUID(),
      dto.causationId,
      dto.boardedAt !== undefined ? new Date(dto.boardedAt) : undefined,
    );

    return this.boardProviderHandler.execute(command);
  }

  // ===========================================================================
  // Passenger Boarding
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Board Passenger
  // ---------------------------------------------------------------------------

  @Post(':journeyBoardingPublicId/participants/:participantPublicId/board')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('boarding:confirm-passenger')
  @ApiOperation({
    summary: 'Board passenger',
    description: 'Records a participant boarding the journey.',
  })
  public async boardPassenger(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Param('participantPublicId') participantPublicId: string,
    @Body() dto: BoardPassengerDto,
  ): Promise<JourneyBoardingResponse> {
    const command = new BoardPassengerCommand(
      new JourneyBoardingPublicId(journeyBoardingPublicId),
      new JourneyBoardingParticipantPublicId(participantPublicId),
      randomUUID(),
      dto.causationId,
      dto.boardedAt !== undefined ? new Date(dto.boardedAt) : undefined,
    );

    const result = await this.boardPassengerHandler.execute(command);

    return JourneyBoardingResponseMapper.toResponse(
      result.aggregate,
      result.journeyPublicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Mark Passenger No-Show
  // ---------------------------------------------------------------------------

  @Post(':journeyBoardingPublicId/participants/:participantPublicId/no-show')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('boarding:passenger:no-show')
  @ApiOperation({
    summary: 'Mark passenger as no-show',
    description:
      'Records that a passenger did not board within the applicable workflow.',
  })
  public async markPassengerNoShow(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Param('participantPublicId') participantPublicId: string,
    @Body() dto: MarkPassengerNoShowDto,
  ): Promise<JourneyBoardingResponse> {
    const command = new MarkPassengerNoShowCommand(
      new JourneyBoardingPublicId(journeyBoardingPublicId),
      new JourneyBoardingParticipantPublicId(participantPublicId),
      randomUUID(),
      dto.causationId,
      dto.noShowAt !== undefined ? new Date(dto.noShowAt) : undefined,
    );

    const result = await this.markPassengerNoShowHandler.execute(command);

    return JourneyBoardingResponseMapper.toResponse(
      result.aggregate,
      result.journeyPublicId,
    );
  }

  // ===========================================================================
  // Participant Lifecycle
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Withdraw Participant
  // ---------------------------------------------------------------------------

  @Post(':journeyBoardingPublicId/participants/:participantPublicId/withdraw')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('boarding:participant:withdraw')
  @ApiOperation({
    summary: 'Withdraw participant',
    description: 'Withdraws a participant from journey boarding.',
  })
  public async withdrawParticipant(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Param('participantPublicId') participantPublicId: string,
    @Body() dto: WithdrawParticipantDto,
  ): Promise<JourneyBoardingResponse> {
    const command = new WithdrawParticipantCommand(
      new JourneyBoardingPublicId(journeyBoardingPublicId),
      new JourneyBoardingParticipantPublicId(participantPublicId),
      randomUUID(),
      dto.causationId,
      dto.withdrawnAt !== undefined ? new Date(dto.withdrawnAt) : undefined,
    );

    const result = await this.withdrawParticipantHandler.execute(command);

    return JourneyBoardingResponseMapper.toResponse(
      result.aggregate,
      result.journeyPublicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Remove Participant
  // ---------------------------------------------------------------------------

  @Post(':journeyBoardingPublicId/participants/:participantPublicId/remove')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('boarding:participant:remove')
  @ApiOperation({
    summary: 'Remove participant',
    description:
      'Removes a participant from boarding with the authenticated identity as actor.',
  })
  public async removeParticipant(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Param('participantPublicId') participantPublicId: string,
    @Body() dto: RemoveParticipantDto,
    @CurrentIdentity() identity: AuthenticatedIdentity,
  ): Promise<JourneyBoardingResponse> {
    const actorPublicId = new JourneyBoardingMemberPublicId(
      identity.identityPublicId,
    );

    const command = new RemoveParticipantCommand(
      new JourneyBoardingPublicId(journeyBoardingPublicId),
      new JourneyBoardingParticipantPublicId(participantPublicId),
      randomUUID(),
      actorPublicId,
      dto.causationId,
      dto.removedAt !== undefined ? new Date(dto.removedAt) : undefined,
    );

    const result = await this.removeParticipantHandler.execute(command);

    return JourneyBoardingResponseMapper.toResponse(
      result.aggregate,
      result.journeyPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyBoardingController;
