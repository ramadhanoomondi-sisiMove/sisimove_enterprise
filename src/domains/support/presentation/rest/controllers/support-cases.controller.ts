// -----------------------------------------------------------------------------
// Support — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Support Case aggregate operations.
//
// Authorization and identity rules:
//
// - Every endpoint requires authentication and its declared permission.
// - The authenticated identity is obtained through CurrentIdentity.
// - Actor identities are never trusted when supplied by request DTOs.
// - Target identities, such as an assignee or participant, remain request data.
// - Access to individual Support Cases must additionally be enforced by the
//   application/domain authorization boundary.
// - Correlation and causation identifiers are generated internally.
// - All responses are mapped through SupportCaseResponseMapper.
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
  CurrentIdentity,
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

import { SUPPORT_TOKENS } from '../../../application/support.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  AddSupportCaseEvidenceCommand,
  AddSupportCaseMessageCommand,
  AddSupportCaseNoteCommand,
  AddSupportCaseParticipantCommand,
  AssignSupportCaseCommand,
  CancelSupportCaseCommand,
  ChangeSupportCaseCategoryCommand,
  ChangeSupportCasePriorityCommand,
  CloseSupportCaseCommand,
  CreateJourneySupportCaseCommand,
  CreateSupportCaseCommand,
  CreateSupportCaseResolutionCommand,
  DeleteSupportCaseMessageCommand,
  EditSupportCaseMessageCommand,
  RemoveSupportCaseParticipantCommand,
  ResolveSupportCaseCommand,
  StartSupportCaseCommand,
  UnassignSupportCaseCommand,
  WaitForInternalActionSupportCaseCommand,
  WaitForMemberSupportCaseCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetSupportCaseEvidenceQuery,
  GetSupportCaseMessagesQuery,
  GetSupportCaseNotesQuery,
  GetSupportCaseParticipantsQuery,
  GetSupportCaseQuery,
  GetSupportCasesByAssigneeQuery,
  GetSupportCasesByCategoryQuery,
  GetSupportCasesByPriorityQuery,
  GetSupportCasesByReferenceQuery,
  GetSupportCasesByRequesterQuery,
  GetSupportCasesByStatusQuery,
  GetSupportCasesQuery,
  GetSupportCaseResolutionQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { SupportCaseAggregate } from '../../../domain/aggregates/support-case.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  SupportCaseAssignedToPublicId,
  SupportCaseCategory,
  SupportCaseDescription,
  SupportCaseEvidenceAssetId,
  SupportCaseEvidenceDescription,
  SupportCaseEvidenceSubmittedByPublicId,
  SupportCaseMessageAssetId,
  SupportCaseMessageContent,
  SupportCaseMessagePublicId,
  SupportCaseMessageSenderPublicId,
  SupportCaseMessageType,
  SupportCaseNoteAuthorPublicId,
  SupportCaseNoteContent,
  SupportCaseParticipantPublicId,
  SupportCaseParticipantRole,
  SupportCasePriority,
  SupportCasePublicId,
  SupportCaseReferencePublicId,
  SupportCaseReferenceType,
  SupportCaseRequesterPublicId,
  SupportCaseResolutionResolvedByPublicId,
  SupportCaseResolutionSummary,
  SupportCaseResolutionType,
  SupportCaseStatus,
  SupportCaseSubject,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  AddSupportCaseEvidenceRequestDto,
  AddSupportCaseMessageRequestDto,
  AddSupportCaseNoteRequestDto,
  AddSupportCaseParticipantRequestDto,
  AssignSupportCaseRequestDto,
  CancelSupportCaseRequestDto,
  ChangeSupportCaseCategoryRequestDto,
  ChangeSupportCasePriorityRequestDto,
  CloseSupportCaseRequestDto,
  CreateJourneySupportCaseRequestDto,
  CreateSupportCaseRequestDto,
  CreateSupportCaseResolutionRequestDto,
  DeleteSupportCaseMessageRequestDto,
  EditSupportCaseMessageRequestDto,
  RemoveSupportCaseParticipantRequestDto,
  ResolveSupportCaseRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import {
  SupportCaseResponseMapper,
  type SupportCaseResponse,
} from '../mappers/support-case.response.mapper';

// =============================================================================
// Authenticated Identity Contract
// =============================================================================
//
// Keep this minimal structural type local to the HTTP boundary. The
// CurrentIdentity decorator must provide the authenticated identity populated
// by the authentication guard, including identityPublicId.
//
// If your project's CurrentIdentity decorator exports a canonical identity
// type, prefer importing that type instead of maintaining this local shape.
// =============================================================================

interface CurrentAuthenticatedIdentity {
  readonly identityPublicId: string;
}

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Support Cases')
@ApiBearerAuth('access-token')
@Controller('support-cases')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SupportCasesController {
  // ===========================================================================
  // Constructor — Command and Query Handlers
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Support Case Command Handlers
    // -------------------------------------------------------------------------

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.CREATE_SUPPORT_CASE)
    private readonly createSupportCaseHandler: CommandHandler<
      CreateSupportCaseCommand,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.CREATE_JOURNEY_SUPPORT_CASE)
    private readonly createJourneySupportCaseHandler: CommandHandler<
      CreateJourneySupportCaseCommand,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.ASSIGN_SUPPORT_CASE)
    private readonly assignSupportCaseHandler: CommandHandler<
      AssignSupportCaseCommand,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.UNASSIGN_SUPPORT_CASE)
    private readonly unassignSupportCaseHandler: CommandHandler<
      UnassignSupportCaseCommand,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.CHANGE_SUPPORT_CASE_PRIORITY)
    private readonly changeSupportCasePriorityHandler: CommandHandler<
      ChangeSupportCasePriorityCommand,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.CHANGE_SUPPORT_CASE_CATEGORY)
    private readonly changeSupportCaseCategoryHandler: CommandHandler<
      ChangeSupportCaseCategoryCommand,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.START_SUPPORT_CASE)
    private readonly startSupportCaseHandler: CommandHandler<
      StartSupportCaseCommand,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.WAIT_FOR_MEMBER_SUPPORT_CASE)
    private readonly waitForMemberSupportCaseHandler: CommandHandler<
      WaitForMemberSupportCaseCommand,
      SupportCaseAggregate
    >,

    @Inject(
      SUPPORT_TOKENS.COMMAND_HANDLERS.WAIT_FOR_INTERNAL_ACTION_SUPPORT_CASE,
    )
    private readonly waitForInternalActionSupportCaseHandler: CommandHandler<
      WaitForInternalActionSupportCaseCommand,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.RESOLVE_SUPPORT_CASE)
    private readonly resolveSupportCaseHandler: CommandHandler<
      ResolveSupportCaseCommand,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.CLOSE_SUPPORT_CASE)
    private readonly closeSupportCaseHandler: CommandHandler<
      CloseSupportCaseCommand,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.CANCEL_SUPPORT_CASE)
    private readonly cancelSupportCaseHandler: CommandHandler<
      CancelSupportCaseCommand,
      SupportCaseAggregate
    >,

    // -------------------------------------------------------------------------
    // Participant Command Handlers
    // -------------------------------------------------------------------------

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.ADD_SUPPORT_CASE_PARTICIPANT)
    private readonly addSupportCaseParticipantHandler: CommandHandler<
      AddSupportCaseParticipantCommand,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.REMOVE_SUPPORT_CASE_PARTICIPANT)
    private readonly removeSupportCaseParticipantHandler: CommandHandler<
      RemoveSupportCaseParticipantCommand,
      SupportCaseAggregate
    >,

    // -------------------------------------------------------------------------
    // Message Command Handlers
    // -------------------------------------------------------------------------

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.ADD_SUPPORT_CASE_MESSAGE)
    private readonly addSupportCaseMessageHandler: CommandHandler<
      AddSupportCaseMessageCommand,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.EDIT_SUPPORT_CASE_MESSAGE)
    private readonly editSupportCaseMessageHandler: CommandHandler<
      EditSupportCaseMessageCommand,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.DELETE_SUPPORT_CASE_MESSAGE)
    private readonly deleteSupportCaseMessageHandler: CommandHandler<
      DeleteSupportCaseMessageCommand,
      SupportCaseAggregate
    >,

    // -------------------------------------------------------------------------
    // Note Command Handler
    // -------------------------------------------------------------------------

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.ADD_SUPPORT_CASE_NOTE)
    private readonly addSupportCaseNoteHandler: CommandHandler<
      AddSupportCaseNoteCommand,
      SupportCaseAggregate
    >,

    // -------------------------------------------------------------------------
    // Evidence Command Handler
    // -------------------------------------------------------------------------

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.ADD_SUPPORT_CASE_EVIDENCE)
    private readonly addSupportCaseEvidenceHandler: CommandHandler<
      AddSupportCaseEvidenceCommand,
      SupportCaseAggregate
    >,

    // -------------------------------------------------------------------------
    // Resolution Command Handler
    // -------------------------------------------------------------------------

    @Inject(SUPPORT_TOKENS.COMMAND_HANDLERS.CREATE_SUPPORT_CASE_RESOLUTION)
    private readonly createSupportCaseResolutionHandler: CommandHandler<
      CreateSupportCaseResolutionCommand,
      SupportCaseAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE)
    private readonly getSupportCaseHandler: QueryHandler<
      GetSupportCaseQuery,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES)
    private readonly getSupportCasesHandler: QueryHandler<
      GetSupportCasesQuery,
      readonly SupportCaseAggregate[]
    >,

    @Inject(SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_REQUESTER)
    private readonly getSupportCasesByRequesterHandler: QueryHandler<
      GetSupportCasesByRequesterQuery,
      readonly SupportCaseAggregate[]
    >,

    @Inject(SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_ASSIGNEE)
    private readonly getSupportCasesByAssigneeHandler: QueryHandler<
      GetSupportCasesByAssigneeQuery,
      readonly SupportCaseAggregate[]
    >,

    @Inject(SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_REFERENCE)
    private readonly getSupportCasesByReferenceHandler: QueryHandler<
      GetSupportCasesByReferenceQuery,
      readonly SupportCaseAggregate[]
    >,

    @Inject(SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_STATUS)
    private readonly getSupportCasesByStatusHandler: QueryHandler<
      GetSupportCasesByStatusQuery,
      readonly SupportCaseAggregate[]
    >,

    @Inject(SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_CATEGORY)
    private readonly getSupportCasesByCategoryHandler: QueryHandler<
      GetSupportCasesByCategoryQuery,
      readonly SupportCaseAggregate[]
    >,

    @Inject(SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_PRIORITY)
    private readonly getSupportCasesByPriorityHandler: QueryHandler<
      GetSupportCasesByPriorityQuery,
      readonly SupportCaseAggregate[]
    >,

    @Inject(SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE_PARTICIPANTS)
    private readonly getSupportCaseParticipantsHandler: QueryHandler<
      GetSupportCaseParticipantsQuery,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE_MESSAGES)
    private readonly getSupportCaseMessagesHandler: QueryHandler<
      GetSupportCaseMessagesQuery,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE_NOTES)
    private readonly getSupportCaseNotesHandler: QueryHandler<
      GetSupportCaseNotesQuery,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE_EVIDENCE)
    private readonly getSupportCaseEvidenceHandler: QueryHandler<
      GetSupportCaseEvidenceQuery,
      SupportCaseAggregate
    >,

    @Inject(SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE_RESOLUTION)
    private readonly getSupportCaseResolutionHandler: QueryHandler<
      GetSupportCaseResolutionQuery,
      SupportCaseAggregate
    >,
  ) {}

  // ===========================================================================
  // Support Case Queries
  // ===========================================================================

  @ApiOperation({
    summary: 'List support cases',
    description:
      'Returns Support Case aggregates available through the Support application query boundary.',
  })
  @Get()
  @RequirePermissions('support-case:read')
  public async getSupportCases(): Promise<SupportCaseResponse[]> {
    const supportCases = await this.getSupportCasesHandler.execute(
      new GetSupportCasesQuery(),
    );

    return supportCases.map((supportCase) =>
      SupportCaseResponseMapper.toResponse(supportCase),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Support Cases By Requester
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get support cases by requester',
    description: 'Returns Support Cases belonging to a specific requester.',
  })
  @ApiParam({
    name: 'requesterPublicId',
    type: String,
    required: true,
    description: 'Public identity of the requester.',
  })
  @Get('by-requester/:requesterPublicId')
  @RequirePermissions('support-case:read')
  public async getByRequester(
    @Param('requesterPublicId') requesterPublicId: string,
    @CurrentIdentity() identity: CurrentAuthenticatedIdentity,
  ): Promise<SupportCaseResponse[]> {
    // A caller without broader administrative authorization must not be able
    // to enumerate another requester's support cases merely by changing the
    // route parameter. The permission guard remains responsible for deciding
    // which permissions the caller has. This controller always scopes the
    // requester query to the authenticated identity.
    const requester = SupportCaseRequesterPublicId.create(
      identity.identityPublicId,
    );

    void requesterPublicId;

    const supportCases = await this.getSupportCasesByRequesterHandler.execute(
      new GetSupportCasesByRequesterQuery(requester),
    );

    return supportCases.map((supportCase) =>
      SupportCaseResponseMapper.toResponse(supportCase),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Support Cases By Assignee
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get support cases by assignee',
    description: 'Returns Support Cases assigned to a specific member.',
  })
  @ApiParam({
    name: 'assignedToPublicId',
    type: String,
    required: true,
    description: 'Public identity of the assignee.',
  })
  @Get('by-assignee/:assignedToPublicId')
  @RequirePermissions('support-case:read')
  public async getByAssignee(
    @Param('assignedToPublicId') assignedToPublicId: string,
  ): Promise<SupportCaseResponse[]> {
    const assignedTo = SupportCaseAssignedToPublicId.create(assignedToPublicId);

    const supportCases = await this.getSupportCasesByAssigneeHandler.execute(
      new GetSupportCasesByAssigneeQuery(assignedTo),
    );

    return supportCases.map((supportCase) =>
      SupportCaseResponseMapper.toResponse(supportCase),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Support Cases By Reference
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get support cases by reference',
    description:
      'Returns Support Cases associated with a referenced domain resource.',
  })
  @ApiParam({
    name: 'referenceType',
    type: String,
    required: true,
    description: 'Type of the referenced domain resource.',
  })
  @ApiParam({
    name: 'referencePublicId',
    type: String,
    required: true,
    description: 'Public identity of the referenced domain resource.',
  })
  @Get('by-reference/:referenceType/:referencePublicId')
  @RequirePermissions('support-case:read')
  public async getByReference(
    @Param('referenceType') referenceType: string,
    @Param('referencePublicId') referencePublicId: string,
  ): Promise<SupportCaseResponse[]> {
    const type = SupportCaseReferenceType.create(referenceType);
    const publicId = SupportCaseReferencePublicId.create(referencePublicId);

    const supportCases = await this.getSupportCasesByReferenceHandler.execute(
      new GetSupportCasesByReferenceQuery(type.value, publicId.value),
    );

    return supportCases.map((supportCase) =>
      SupportCaseResponseMapper.toResponse(supportCase),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Support Cases By Status
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get support cases by status',
    description: 'Returns Support Cases in the specified lifecycle status.',
  })
  @ApiParam({
    name: 'status',
    type: String,
    required: true,
    description: 'Support Case lifecycle status.',
  })
  @Get('by-status/:status')
  @RequirePermissions('support-case:read')
  public async getByStatus(
    @Param('status') status: string,
  ): Promise<SupportCaseResponse[]> {
    const value = SupportCaseStatus.create(status);

    const supportCases = await this.getSupportCasesByStatusHandler.execute(
      new GetSupportCasesByStatusQuery(value),
    );

    return supportCases.map((supportCase) =>
      SupportCaseResponseMapper.toResponse(supportCase),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Support Cases By Category
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get support cases by category',
    description: 'Returns Support Cases belonging to the specified category.',
  })
  @ApiParam({
    name: 'category',
    type: String,
    required: true,
    description: 'Support Case category.',
  })
  @Get('by-category/:category')
  @RequirePermissions('support-case:read')
  public async getByCategory(
    @Param('category') category: string,
  ): Promise<SupportCaseResponse[]> {
    const value = SupportCaseCategory.create(category);

    const supportCases = await this.getSupportCasesByCategoryHandler.execute(
      new GetSupportCasesByCategoryQuery(value),
    );

    return supportCases.map((supportCase) =>
      SupportCaseResponseMapper.toResponse(supportCase),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Support Cases By Priority
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get support cases by priority',
    description: 'Returns Support Cases with the specified priority.',
  })
  @ApiParam({
    name: 'priority',
    type: String,
    required: true,
    description: 'Support Case priority.',
  })
  @Get('by-priority/:priority')
  @RequirePermissions('support-case:read')
  public async getByPriority(
    @Param('priority') priority: string,
  ): Promise<SupportCaseResponse[]> {
    const value = SupportCasePriority.create(priority);

    const supportCases = await this.getSupportCasesByPriorityHandler.execute(
      new GetSupportCasesByPriorityQuery(value),
    );

    return supportCases.map((supportCase) =>
      SupportCaseResponseMapper.toResponse(supportCase),
    );
  }

  // ===========================================================================
  // Get Support Case
  // ===========================================================================

  @ApiOperation({
    summary: 'Get a support case',
    description:
      'Returns a Support Case aggregate identified by its public identity.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Get(':supportCasePublicId')
  @RequirePermissions('support-case:read')
  public async get(
    @Param('supportCasePublicId') supportCasePublicId: string,
  ): Promise<SupportCaseResponse> {
    const supportCase = await this.getSupportCaseHandler.execute(
      new GetSupportCaseQuery(new SupportCasePublicId(supportCasePublicId)),
    );

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ===========================================================================
  // Support Case Child Queries
  // ===========================================================================

  @ApiOperation({
    summary: 'Get support case participants',
    description:
      'Returns the participant child entities belonging to a Support Case.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Get(':supportCasePublicId/participants')
  @RequirePermissions('support-case-participant:read')
  public async getParticipants(
    @Param('supportCasePublicId') supportCasePublicId: string,
  ): Promise<
    ReturnType<typeof SupportCaseResponseMapper.fromParticipantEntity>[]
  > {
    const supportCase = await this.getSupportCaseParticipantsHandler.execute(
      new GetSupportCaseParticipantsQuery(
        new SupportCasePublicId(supportCasePublicId),
      ),
    );

    return supportCase.participants.map((participant) =>
      SupportCaseResponseMapper.fromParticipantEntity(participant),
    );
  }

  @ApiOperation({
    summary: 'Get support case messages',
    description:
      'Returns the message child entities belonging to a Support Case.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Get(':supportCasePublicId/messages')
  @RequirePermissions('support-case-message:read')
  public async getMessages(
    @Param('supportCasePublicId') supportCasePublicId: string,
  ): Promise<ReturnType<typeof SupportCaseResponseMapper.fromMessageEntity>[]> {
    const supportCase = await this.getSupportCaseMessagesHandler.execute(
      new GetSupportCaseMessagesQuery(
        new SupportCasePublicId(supportCasePublicId),
      ),
    );

    return supportCase.messages.map((message) =>
      SupportCaseResponseMapper.fromMessageEntity(message),
    );
  }

  @ApiOperation({
    summary: 'Get support case notes',
    description: 'Returns the note child entities belonging to a Support Case.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Get(':supportCasePublicId/notes')
  @RequirePermissions('support-case-note:read')
  public async getNotes(
    @Param('supportCasePublicId') supportCasePublicId: string,
  ): Promise<ReturnType<typeof SupportCaseResponseMapper.fromNoteEntity>[]> {
    const supportCase = await this.getSupportCaseNotesHandler.execute(
      new GetSupportCaseNotesQuery(
        new SupportCasePublicId(supportCasePublicId),
      ),
    );

    return supportCase.notes.map((note) =>
      SupportCaseResponseMapper.fromNoteEntity(note),
    );
  }

  @ApiOperation({
    summary: 'Get support case evidence',
    description:
      'Returns the evidence child entities belonging to a Support Case.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Get(':supportCasePublicId/evidence')
  @RequirePermissions('support-case-evidence:read')
  public async getEvidence(
    @Param('supportCasePublicId') supportCasePublicId: string,
  ): Promise<
    ReturnType<typeof SupportCaseResponseMapper.fromEvidenceEntity>[]
  > {
    const supportCase = await this.getSupportCaseEvidenceHandler.execute(
      new GetSupportCaseEvidenceQuery(
        new SupportCasePublicId(supportCasePublicId),
      ),
    );

    return supportCase.evidence.map((evidence) =>
      SupportCaseResponseMapper.fromEvidenceEntity(evidence),
    );
  }

  @ApiOperation({
    summary: 'Get support case resolution',
    description:
      'Returns the resolution child entity belonging to a Support Case.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Get(':supportCasePublicId/resolution')
  @RequirePermissions('support-case-resolution:read')
  public async getResolution(
    @Param('supportCasePublicId') supportCasePublicId: string,
  ): Promise<ReturnType<
    typeof SupportCaseResponseMapper.fromResolutionEntity
  > | null> {
    const supportCase = await this.getSupportCaseResolutionHandler.execute(
      new GetSupportCaseResolutionQuery(
        new SupportCasePublicId(supportCasePublicId),
      ),
    );

    if (!supportCase.resolution) {
      return null;
    }

    return SupportCaseResponseMapper.fromResolutionEntity(
      supportCase.resolution,
    );
  }

  // ===========================================================================
  // Support Case Commands
  // ===========================================================================

  @ApiOperation({
    summary: 'Create a support case',
    description: 'Creates a new Support Case aggregate.',
  })
  @Post()
  @RequirePermissions('support-case:create')
  public async create(
    @Body() dto: CreateSupportCaseRequestDto,
    @CurrentIdentity() identity: CurrentAuthenticatedIdentity,
  ): Promise<SupportCaseResponse> {
    const command = new CreateSupportCaseCommand(
      SupportCaseRequesterPublicId.create(identity.identityPublicId),
      SupportCasePriority.create(dto.priority),
      SupportCaseCategory.create(dto.category),
      SupportCaseSubject.create(dto.subject),
      randomUUID(),
      randomUUID(),
      dto.description === undefined
        ? undefined
        : SupportCaseDescription.create(dto.description),
      dto.referenceType === undefined
        ? undefined
        : SupportCaseReferenceType.create(dto.referenceType),
      dto.referencePublicId === undefined
        ? undefined
        : SupportCaseReferencePublicId.create(dto.referencePublicId),
    );

    const supportCase = await this.createSupportCaseHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ---------------------------------------------------------------------------
  // Create Support Case For Journey
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Create a support case for a Journey',
    description:
      'Creates a Support Case linked to the specified Journey. The authenticated identity is used as the requester.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey requiring support.',
  })
  @Post('journeys/:journeyPublicId')
  @RequirePermissions('support-case:create')
  public async createForJourney(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: CreateJourneySupportCaseRequestDto,
    @CurrentIdentity() identity: CurrentAuthenticatedIdentity,
  ): Promise<SupportCaseResponse> {
    const command = new CreateJourneySupportCaseCommand(
      SupportCaseRequesterPublicId.create(identity.identityPublicId),
      SupportCaseReferencePublicId.create(journeyPublicId),
      SupportCasePriority.create(dto.priority),
      SupportCaseCategory.create(dto.category),
      SupportCaseSubject.create(dto.subject),
      randomUUID(),
      randomUUID(),
      dto.description === undefined
        ? undefined
        : SupportCaseDescription.create(dto.description),
    );

    const supportCase =
      await this.createJourneySupportCaseHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ---------------------------------------------------------------------------
  // Assign
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Assign a support case',
    description: 'Assigns a Support Case to a member.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Post(':supportCasePublicId/assign')
  @RequirePermissions('support-case:assign')
  public async assign(
    @Param('supportCasePublicId') supportCasePublicId: string,
    @Body() dto: AssignSupportCaseRequestDto,
  ): Promise<SupportCaseResponse> {
    const command = new AssignSupportCaseCommand(
      new SupportCasePublicId(supportCasePublicId),
      SupportCaseAssignedToPublicId.create(dto.assignedToPublicId),
      randomUUID(),
      randomUUID(),
    );

    const supportCase = await this.assignSupportCaseHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ---------------------------------------------------------------------------
  // Unassign
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Unassign a support case',
    description: 'Removes the current assignee from a Support Case.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Post(':supportCasePublicId/unassign')
  @RequirePermissions('support-case:assign')
  public async unassign(
    @Param('supportCasePublicId') supportCasePublicId: string,
  ): Promise<SupportCaseResponse> {
    const command = new UnassignSupportCaseCommand(
      new SupportCasePublicId(supportCasePublicId),
      randomUUID(),
      randomUUID(),
    );

    const supportCase = await this.unassignSupportCaseHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ---------------------------------------------------------------------------
  // Change Priority
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Change support case priority',
    description: 'Changes the priority of a Support Case.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Post(':supportCasePublicId/priority')
  @RequirePermissions('support-case:update')
  public async changePriority(
    @Param('supportCasePublicId') supportCasePublicId: string,
    @Body() dto: ChangeSupportCasePriorityRequestDto,
  ): Promise<SupportCaseResponse> {
    const command = new ChangeSupportCasePriorityCommand(
      new SupportCasePublicId(supportCasePublicId),
      SupportCasePriority.create(dto.priority),
      randomUUID(),
      randomUUID(),
    );

    const supportCase =
      await this.changeSupportCasePriorityHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ---------------------------------------------------------------------------
  // Change Category
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Change support case category',
    description: 'Changes the category of a Support Case.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Post(':supportCasePublicId/category')
  @RequirePermissions('support-case:update')
  public async changeCategory(
    @Param('supportCasePublicId') supportCasePublicId: string,
    @Body() dto: ChangeSupportCaseCategoryRequestDto,
  ): Promise<SupportCaseResponse> {
    const command = new ChangeSupportCaseCategoryCommand(
      new SupportCasePublicId(supportCasePublicId),
      SupportCaseCategory.create(dto.category),
      randomUUID(),
      randomUUID(),
    );

    const supportCase =
      await this.changeSupportCaseCategoryHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ---------------------------------------------------------------------------
  // Start
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Start a support case',
    description: 'Starts a Support Case according to its domain lifecycle.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Post(':supportCasePublicId/start')
  @RequirePermissions('support-case:start')
  public async start(
    @Param('supportCasePublicId') supportCasePublicId: string,
  ): Promise<SupportCaseResponse> {
    const command = new StartSupportCaseCommand(
      new SupportCasePublicId(supportCasePublicId),
      randomUUID(),
      randomUUID(),
    );

    const supportCase = await this.startSupportCaseHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ---------------------------------------------------------------------------
  // Wait For Member
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Wait for member',
    description: 'Places a Support Case into the waiting-for-member state.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Post(':supportCasePublicId/wait-for-member')
  @RequirePermissions('support-case:update')
  public async waitForMember(
    @Param('supportCasePublicId') supportCasePublicId: string,
  ): Promise<SupportCaseResponse> {
    const command = new WaitForMemberSupportCaseCommand(
      new SupportCasePublicId(supportCasePublicId),
      randomUUID(),
      randomUUID(),
    );

    const supportCase =
      await this.waitForMemberSupportCaseHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ---------------------------------------------------------------------------
  // Wait For Internal Action
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Wait for internal action',
    description:
      'Places a Support Case into the waiting-for-internal-action state.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Post(':supportCasePublicId/wait-for-internal-action')
  @RequirePermissions('support-case:update')
  public async waitForInternalAction(
    @Param('supportCasePublicId') supportCasePublicId: string,
  ): Promise<SupportCaseResponse> {
    const command = new WaitForInternalActionSupportCaseCommand(
      new SupportCasePublicId(supportCasePublicId),
      randomUUID(),
      randomUUID(),
    );

    const supportCase =
      await this.waitForInternalActionSupportCaseHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ---------------------------------------------------------------------------
  // Resolve
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Resolve a support case',
    description:
      'Resolves a Support Case using the supplied resolution information.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Post(':supportCasePublicId/resolve')
  @RequirePermissions('support-case:resolve')
  public async resolve(
    @Param('supportCasePublicId') supportCasePublicId: string,
    @Body() dto: ResolveSupportCaseRequestDto,
    @CurrentIdentity() identity: CurrentAuthenticatedIdentity,
  ): Promise<SupportCaseResponse> {
    const command = new ResolveSupportCaseCommand(
      new SupportCasePublicId(supportCasePublicId),
      SupportCaseResolutionType.create(dto.resolutionType),
      SupportCaseResolutionSummary.create(dto.resolutionSummary),
      SupportCaseResolutionResolvedByPublicId.create(identity.identityPublicId),
      randomUUID(),
      dto.resolvedAt === undefined ? undefined : new Date(dto.resolvedAt),
      randomUUID(),
    );

    const supportCase = await this.resolveSupportCaseHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ---------------------------------------------------------------------------
  // Close
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Close a support case',
    description: 'Closes a Support Case according to its domain lifecycle.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Post(':supportCasePublicId/close')
  @RequirePermissions('support-case:close')
  public async close(
    @Param('supportCasePublicId') supportCasePublicId: string,
    @Body() dto: CloseSupportCaseRequestDto,
  ): Promise<SupportCaseResponse> {
    const command = new CloseSupportCaseCommand(
      new SupportCasePublicId(supportCasePublicId),
      randomUUID(),
      dto.closedAt === undefined ? undefined : new Date(dto.closedAt),
      randomUUID(),
    );

    const supportCase = await this.closeSupportCaseHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ---------------------------------------------------------------------------
  // Cancel
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Cancel a support case',
    description: 'Cancels a Support Case according to its domain lifecycle.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Post(':supportCasePublicId/cancel')
  @RequirePermissions('support-case:cancel')
  public async cancel(
    @Param('supportCasePublicId') supportCasePublicId: string,
    @Body() dto: CancelSupportCaseRequestDto,
  ): Promise<SupportCaseResponse> {
    const command = new CancelSupportCaseCommand(
      new SupportCasePublicId(supportCasePublicId),
      randomUUID(),
      dto.cancelledAt === undefined ? undefined : new Date(dto.cancelledAt),
      randomUUID(),
    );

    const supportCase = await this.cancelSupportCaseHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ===========================================================================
  // Participant Commands
  // ===========================================================================

  @ApiOperation({
    summary: 'Add a support case participant',
    description: 'Adds a participant to the Support Case aggregate.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Post(':supportCasePublicId/participants')
  @RequirePermissions('support-case-participant:create')
  public async addParticipant(
    @Param('supportCasePublicId') supportCasePublicId: string,
    @Body() dto: AddSupportCaseParticipantRequestDto,
  ): Promise<SupportCaseResponse> {
    const command = new AddSupportCaseParticipantCommand(
      new SupportCasePublicId(supportCasePublicId),
      dto.memberPublicId,
      SupportCaseParticipantRole.create(dto.role),
      randomUUID(),
      randomUUID(),
    );

    const supportCase =
      await this.addSupportCaseParticipantHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  @ApiOperation({
    summary: 'Remove a support case participant',
    description: 'Removes a participant from the Support Case aggregate.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @ApiParam({
    name: 'participantPublicId',
    type: String,
    required: true,
    description: 'Public identity of the participant.',
  })
  @Post(':supportCasePublicId/participants/:participantPublicId/remove')
  @RequirePermissions('support-case-participant:remove')
  public async removeParticipant(
    @Param('supportCasePublicId') supportCasePublicId: string,
    @Param('participantPublicId') participantPublicId: string,
    @Body() dto: RemoveSupportCaseParticipantRequestDto,
  ): Promise<SupportCaseResponse> {
    const command = new RemoveSupportCaseParticipantCommand(
      new SupportCasePublicId(supportCasePublicId),
      new SupportCaseParticipantPublicId(participantPublicId),
      randomUUID(),
      dto.leftAt === undefined ? undefined : new Date(dto.leftAt),
      randomUUID(),
    );

    const supportCase =
      await this.removeSupportCaseParticipantHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ===========================================================================
  // Message Commands
  // ===========================================================================

  @ApiOperation({
    summary: 'Add a support case message',
    description: 'Adds a message to the Support Case aggregate.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Post(':supportCasePublicId/messages')
  @RequirePermissions('support-case-message:create')
  public async addMessage(
    @Param('supportCasePublicId') supportCasePublicId: string,
    @Body() dto: AddSupportCaseMessageRequestDto,
    @CurrentIdentity() identity: CurrentAuthenticatedIdentity,
  ): Promise<SupportCaseResponse> {
    const command = new AddSupportCaseMessageCommand(
      new SupportCasePublicId(supportCasePublicId),
      SupportCaseMessageSenderPublicId.create(identity.identityPublicId),
      SupportCaseMessageType.create(dto.type),
      randomUUID(),
      dto.content === undefined
        ? undefined
        : SupportCaseMessageContent.create(dto.content),
      dto.assetId === undefined
        ? undefined
        : SupportCaseMessageAssetId.create(dto.assetId),
      dto.sentAt === undefined ? undefined : new Date(dto.sentAt),
      randomUUID(),
    );

    const supportCase =
      await this.addSupportCaseMessageHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  @ApiOperation({
    summary: 'Edit a support case message',
    description: 'Edits an existing Support Case message.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @ApiParam({
    name: 'messagePublicId',
    type: String,
    required: true,
    description: 'Public identity of the message.',
  })
  @Post(':supportCasePublicId/messages/:messagePublicId/edit')
  @RequirePermissions('support-case-message:update')
  public async editMessage(
    @Param('supportCasePublicId') supportCasePublicId: string,
    @Param('messagePublicId') messagePublicId: string,
    @Body() dto: EditSupportCaseMessageRequestDto,
  ): Promise<SupportCaseResponse> {
    const command = new EditSupportCaseMessageCommand(
      new SupportCasePublicId(supportCasePublicId),
      new SupportCaseMessagePublicId(messagePublicId),
      SupportCaseMessageContent.create(dto.content),
      randomUUID(),
      randomUUID(),
    );

    const supportCase =
      await this.editSupportCaseMessageHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  @ApiOperation({
    summary: 'Delete a support case message',
    description: 'Deletes a Support Case message according to domain rules.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @ApiParam({
    name: 'messagePublicId',
    type: String,
    required: true,
    description: 'Public identity of the message.',
  })
  @Post(':supportCasePublicId/messages/:messagePublicId/delete')
  @RequirePermissions('support-case-message:delete')
  public async deleteMessage(
    @Param('supportCasePublicId') supportCasePublicId: string,
    @Param('messagePublicId') messagePublicId: string,
    @Body() dto: DeleteSupportCaseMessageRequestDto,
  ): Promise<SupportCaseResponse> {
    const command = new DeleteSupportCaseMessageCommand(
      new SupportCasePublicId(supportCasePublicId),
      new SupportCaseMessagePublicId(messagePublicId),
      randomUUID(),
      dto.deletedAt === undefined ? undefined : new Date(dto.deletedAt),
      randomUUID(),
    );

    const supportCase =
      await this.deleteSupportCaseMessageHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ===========================================================================
  // Note Commands
  // ===========================================================================

  @ApiOperation({
    summary: 'Add a support case note',
    description: 'Adds an internal note to the Support Case aggregate.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Post(':supportCasePublicId/notes')
  @RequirePermissions('support-case-note:create')
  public async addNote(
    @Param('supportCasePublicId') supportCasePublicId: string,
    @Body() dto: AddSupportCaseNoteRequestDto,
    @CurrentIdentity() identity: CurrentAuthenticatedIdentity,
  ): Promise<SupportCaseResponse> {
    const command = new AddSupportCaseNoteCommand(
      new SupportCasePublicId(supportCasePublicId),
      SupportCaseNoteAuthorPublicId.create(identity.identityPublicId),
      SupportCaseNoteContent.create(dto.content),
      randomUUID(),
      randomUUID(),
    );

    const supportCase = await this.addSupportCaseNoteHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ===========================================================================
  // Evidence Commands
  // ===========================================================================

  @ApiOperation({
    summary: 'Add support case evidence',
    description: 'Adds evidence to the Support Case aggregate.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Post(':supportCasePublicId/evidence')
  @RequirePermissions('support-case-evidence:create')
  public async addEvidence(
    @Param('supportCasePublicId') supportCasePublicId: string,
    @Body() dto: AddSupportCaseEvidenceRequestDto,
    @CurrentIdentity() identity: CurrentAuthenticatedIdentity,
  ): Promise<SupportCaseResponse> {
    const command = new AddSupportCaseEvidenceCommand(
      new SupportCasePublicId(supportCasePublicId),
      SupportCaseEvidenceSubmittedByPublicId.create(identity.identityPublicId),
      SupportCaseEvidenceAssetId.create(dto.assetId),
      randomUUID(),
      dto.description === undefined
        ? undefined
        : SupportCaseEvidenceDescription.create(dto.description),
      randomUUID(),
    );

    const supportCase =
      await this.addSupportCaseEvidenceHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }

  // ===========================================================================
  // Resolution Commands
  // ===========================================================================

  @ApiOperation({
    summary: 'Create a support case resolution',
    description:
      'Creates and attaches a resolution to the Support Case aggregate.',
  })
  @ApiParam({
    name: 'supportCasePublicId',
    type: String,
    required: true,
    description: 'Public identity of the Support Case.',
  })
  @Post(':supportCasePublicId/resolution')
  @RequirePermissions('support-case-resolution:create')
  public async createResolution(
    @Param('supportCasePublicId') supportCasePublicId: string,
    @Body() dto: CreateSupportCaseResolutionRequestDto,
    @CurrentIdentity() identity: CurrentAuthenticatedIdentity,
  ): Promise<SupportCaseResponse> {
    const command = new CreateSupportCaseResolutionCommand(
      new SupportCasePublicId(supportCasePublicId),
      SupportCaseResolutionType.create(dto.type),
      SupportCaseResolutionSummary.create(dto.summary),
      SupportCaseResolutionResolvedByPublicId.create(identity.identityPublicId),
      randomUUID(),
      dto.resolvedAt === undefined ? undefined : new Date(dto.resolvedAt),
      randomUUID(),
    );

    const supportCase =
      await this.createSupportCaseResolutionHandler.execute(command);

    return SupportCaseResponseMapper.toResponse(supportCase);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default SupportCasesController;
