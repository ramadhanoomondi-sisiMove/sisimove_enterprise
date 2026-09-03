// src/domains/journey-boarding/presentation/rest/controllers/journey-boarding.controller.ts

// -----------------------------------------------------------------------------
// Journey Boarding — REST Controller
// -----------------------------------------------------------------------------

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
  Req,
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Authentication / Authorization
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Foundation Application Contracts
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';
import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOARDING_TOKENS } from '../../../application/journey-boarding.tokens';

// -----------------------------------------------------------------------------
// Commands
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
// Queries
// -----------------------------------------------------------------------------

import {
  GetJourneyBoardingByJourneyQuery,
  GetJourneyBoardingParticipantsQuery,
  GetJourneyBoardingQuery,
  ListJourneyBoardingsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain Aggregate / Entity
// -----------------------------------------------------------------------------

import type { JourneyBoardingAggregate } from '../../../domain/aggregates/journey-boarding.aggregate';

import type { JourneyBoardingEntity } from '../../../domain/entities/journey-boarding.entity';

import type { JourneyBoardingParticipantEntity } from '../../../domain/entities/journey-boarding-participant.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyBoardingJourneyId,
  JourneyBoardingMemberPublicId,
  JourneyBoardingParticipantPublicId,
  JourneyBoardingProviderPublicId,
  JourneyBoardingPublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// DTOs
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
// Request Type
// -----------------------------------------------------------------------------

interface AuthenticatedRequest {
  user: {
    publicId: string;
  };
}

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Journey Boardings')
@Controller('journey-boardings')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class JourneyBoardingController {
  constructor(
    // ========================================================================
    // Lifecycle Command Handlers
    // ========================================================================

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
      JourneyBoardingAggregate
    >,

    @Inject(JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelJourneyBoardingHandler: CommandHandler<
      CancelJourneyBoardingCommand,
      JourneyBoardingAggregate
    >,

    // ========================================================================
    // Provider Boarding
    // ========================================================================

    @Inject(JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.BOARD_PROVIDER)
    private readonly boardProviderHandler: CommandHandler<
      BoardProviderCommand,
      JourneyBoardingAggregate
    >,

    // ========================================================================
    // Passenger Boarding
    // ========================================================================

    @Inject(JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.BOARD_PASSENGER)
    private readonly boardPassengerHandler: CommandHandler<
      BoardPassengerCommand,
      JourneyBoardingAggregate
    >,

    @Inject(JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.MARK_PASSENGER_NO_SHOW)
    private readonly markPassengerNoShowHandler: CommandHandler<
      MarkPassengerNoShowCommand,
      JourneyBoardingAggregate
    >,

    // ========================================================================
    // Participant Lifecycle
    // ========================================================================

    @Inject(JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.WITHDRAW_PARTICIPANT)
    private readonly withdrawParticipantHandler: CommandHandler<
      WithdrawParticipantCommand,
      JourneyBoardingAggregate
    >,

    @Inject(JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.REMOVE_PARTICIPANT)
    private readonly removeParticipantHandler: CommandHandler<
      RemoveParticipantCommand,
      JourneyBoardingAggregate
    >,

    // ========================================================================
    // Journey Boarding Queries
    // ========================================================================

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

    // ========================================================================
    // Participant Queries
    // ========================================================================

    @Inject(JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.GET_PARTICIPANTS)
    private readonly getJourneyBoardingParticipantsHandler: QueryHandler<
      GetJourneyBoardingParticipantsQuery,
      JourneyBoardingParticipantEntity[]
    >,
  ) {}

  // ===========================================================================
  // QUERY ENDPOINTS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // List Journey Boardings
  // ---------------------------------------------------------------------------

  @Get()
  @RequirePermissions('journey-boarding:read')
  public async list(): Promise<JourneyBoardingEntity[]> {
    return this.listJourneyBoardingsHandler.execute(
      new ListJourneyBoardingsQuery(),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Journey Boarding By Public ID
  // ---------------------------------------------------------------------------

  @Get(':journeyBoardingPublicId')
  @RequirePermissions('journey-boarding:read')
  public async getByPublicId(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
  ): Promise<JourneyBoardingAggregate> {
    return this.getJourneyBoardingHandler.execute(
      new GetJourneyBoardingQuery(
        new JourneyBoardingPublicId(journeyBoardingPublicId),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Journey Boarding By Journey
  // ---------------------------------------------------------------------------

  @Get('journey/:journeyId')
  @RequirePermissions('journey-boarding:read')
  public async getByJourney(
    @Param('journeyId') journeyId: string,
  ): Promise<JourneyBoardingAggregate> {
    return this.getJourneyBoardingByJourneyHandler.execute(
      new GetJourneyBoardingByJourneyQuery(
        JourneyBoardingJourneyId.create(journeyId),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Journey Boarding Participants
  // ---------------------------------------------------------------------------

  @Get(':journeyBoardingPublicId/participants')
  @RequirePermissions('journey-boarding:read')
  public async getParticipants(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
  ): Promise<JourneyBoardingParticipantEntity[]> {
    return this.getJourneyBoardingParticipantsHandler.execute(
      new GetJourneyBoardingParticipantsQuery(
        new JourneyBoardingPublicId(journeyBoardingPublicId),
      ),
    );
  }

  // ===========================================================================
  // JOURNEY BOARDING LIFECYCLE COMMANDS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('journey-boarding:create')
  public async create(
    @Body() dto: CreateJourneyBoardingDto,
  ): Promise<JourneyBoardingAggregate> {
    return this.createJourneyBoardingHandler.execute(
      new CreateJourneyBoardingCommand(
        JourneyBoardingJourneyId.create(dto.journeyId),
        new JourneyBoardingProviderPublicId(dto.providerPublicId),
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Open Boarding
  // ---------------------------------------------------------------------------

  @Post(':journeyBoardingPublicId/open')
  @RequirePermissions('journey-boarding:open')
  public async open(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Body() dto: OpenJourneyBoardingDto,
  ): Promise<JourneyBoardingAggregate> {
    return this.openJourneyBoardingHandler.execute(
      new OpenJourneyBoardingCommand(
        journeyBoardingPublicId,
        dto.correlationId,
        dto.causationId,
        dto.boardingStartedAt !== undefined
          ? new Date(dto.boardingStartedAt)
          : undefined,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Start Journey
  // ---------------------------------------------------------------------------

  @Post(':journeyBoardingPublicId/start')
  @RequirePermissions('journey-boarding:start')
  public async startJourney(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Body() dto: StartJourneyDto,
  ): Promise<JourneyBoardingAggregate> {
    return this.startJourneyHandler.execute(
      new StartJourneyCommand(
        new JourneyBoardingPublicId(journeyBoardingPublicId),
        dto.correlationId,
        dto.causationId,
        dto.journeyStartedAt !== undefined
          ? new Date(dto.journeyStartedAt)
          : undefined,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Cancel
  // ---------------------------------------------------------------------------

  @Post(':journeyBoardingPublicId/cancel')
  @RequirePermissions('journey-boarding:cancel')
  public async cancel(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Body() dto: CancelJourneyBoardingDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<JourneyBoardingAggregate> {
    const actorPublicId = dto.actorPublicId ?? request.user.publicId;

    return this.cancelJourneyBoardingHandler.execute(
      new CancelJourneyBoardingCommand(
        new JourneyBoardingPublicId(journeyBoardingPublicId),
        dto.correlationId,
        actorPublicId
          ? new JourneyBoardingMemberPublicId(actorPublicId)
          : undefined,
        dto.causationId,
        dto.cancelledAt !== undefined ? new Date(dto.cancelledAt) : undefined,
      ),
    );
  }

  // ===========================================================================
  // PROVIDER BOARDING
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Board Provider
  // ---------------------------------------------------------------------------

  @Post(':journeyBoardingPublicId/provider/board')
  @RequirePermissions('journey-boarding:board:provider')
  public async boardProvider(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Body() dto: BoardProviderDto,
  ): Promise<JourneyBoardingAggregate> {
    return this.boardProviderHandler.execute(
      new BoardProviderCommand(
        journeyBoardingPublicId,
        dto.correlationId,
        dto.causationId,
        dto.boardedAt !== undefined ? new Date(dto.boardedAt) : undefined,
      ),
    );
  }

  // ===========================================================================
  // PASSENGER BOARDING
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Board Passenger
  // ---------------------------------------------------------------------------

  @Post(':journeyBoardingPublicId/participants/:participantPublicId/board')
  @RequirePermissions('journey-boarding:board:passenger')
  public async boardPassenger(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Param('participantPublicId') participantPublicId: string,
    @Body() dto: BoardPassengerDto,
  ): Promise<JourneyBoardingAggregate> {
    return this.boardPassengerHandler.execute(
      new BoardPassengerCommand(
        new JourneyBoardingPublicId(journeyBoardingPublicId),
        new JourneyBoardingParticipantPublicId(participantPublicId),
        dto.correlationId,
        dto.causationId,
        dto.boardedAt !== undefined ? new Date(dto.boardedAt) : undefined,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Mark Passenger No-Show
  // ---------------------------------------------------------------------------

  @Post(':journeyBoardingPublicId/participants/:participantPublicId/no-show')
  @RequirePermissions('journey-boarding:passenger:no-show')
  public async markPassengerNoShow(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Param('participantPublicId') participantPublicId: string,
    @Body() dto: MarkPassengerNoShowDto,
  ): Promise<JourneyBoardingAggregate> {
    return this.markPassengerNoShowHandler.execute(
      new MarkPassengerNoShowCommand(
        new JourneyBoardingPublicId(journeyBoardingPublicId),
        new JourneyBoardingParticipantPublicId(participantPublicId),
        dto.correlationId,
        dto.causationId,
        dto.noShowAt !== undefined ? new Date(dto.noShowAt) : undefined,
      ),
    );
  }

  // ===========================================================================
  // PARTICIPANT LIFECYCLE COMMANDS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Withdraw Participant
  // ---------------------------------------------------------------------------

  @Post(':journeyBoardingPublicId/participants/:participantPublicId/withdraw')
  @RequirePermissions('journey-boarding:participant:withdraw')
  public async withdrawParticipant(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Param('participantPublicId') participantPublicId: string,
    @Body() dto: WithdrawParticipantDto,
  ): Promise<JourneyBoardingAggregate> {
    return this.withdrawParticipantHandler.execute(
      new WithdrawParticipantCommand(
        new JourneyBoardingPublicId(journeyBoardingPublicId),
        new JourneyBoardingParticipantPublicId(participantPublicId),
        dto.correlationId,
        dto.causationId,
        dto.withdrawnAt !== undefined ? new Date(dto.withdrawnAt) : undefined,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Remove Participant
  // ---------------------------------------------------------------------------

  @Post(':journeyBoardingPublicId/participants/:participantPublicId/remove')
  @RequirePermissions('journey-boarding:participant:remove')
  public async removeParticipant(
    @Param('journeyBoardingPublicId') journeyBoardingPublicId: string,
    @Param('participantPublicId') participantPublicId: string,
    @Body() dto: RemoveParticipantDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<JourneyBoardingAggregate> {
    const actorPublicId = dto.actorPublicId ?? request.user.publicId;

    return this.removeParticipantHandler.execute(
      new RemoveParticipantCommand(
        new JourneyBoardingPublicId(journeyBoardingPublicId),
        new JourneyBoardingParticipantPublicId(participantPublicId),
        dto.correlationId,
        actorPublicId
          ? new JourneyBoardingMemberPublicId(actorPublicId)
          : undefined,
        dto.causationId,
        dto.removedAt !== undefined ? new Date(dto.removedAt) : undefined,
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyBoardingController;
