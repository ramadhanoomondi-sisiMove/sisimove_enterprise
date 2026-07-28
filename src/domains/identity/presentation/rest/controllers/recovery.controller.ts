// src/domains/identity/presentation/rest/recovery.controller.ts

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CorrelationId } from '../../../../../foundation/logging/correlation-id';

//
// Commands
//
import { RequestRecoveryCommand } from '../../../application/commands/request-recovery.command';
import { CompleteRecoveryCommand } from '../../../application/commands/complete-recovery.command';
import { CancelRecoveryCommand } from '../../../application/commands/cancel-recovery.command';

//
// Contracts
//
import type { RequestRecoveryResult } from '../../../application/contracts/request-recovery.result';
import type { CompleteRecoveryResult } from '../../../application/contracts/complete-recovery.result';
import type { CancelRecoveryResult } from '../../../application/contracts/cancel-recovery.result';

//
// Handlers
//
import { RequestRecoveryHandler } from '../../../application/handlers/request-recovery.handler';
import { CompleteRecoveryHandler } from '../../../application/handlers/complete-recovery.handler';
import { CancelRecoveryHandler } from '../../../application/handlers/cancel-recovery.handler';

//
// DTOs
//
import { RequestRecoveryDto } from '../dto/request-recovery.dto';
import { CompleteRecoveryDto } from '../dto/complete-recovery.dto';
import { CancelRecoveryDto } from '../dto/cancel-recovery.dto';

//
// Value Objects
//
import { RecoveryId } from '../../../domain/value-objects/recovery-id.vo';
import { RecoveryFailureReason } from '../../../domain/value-objects/recovery-failure-reason.enum';

@ApiTags('Recovery')
@Controller('recoveries')
export class RecoveryController {
  constructor(
    private readonly requestRecoveryHandler: RequestRecoveryHandler,
    private readonly completeRecoveryHandler: CompleteRecoveryHandler,
    private readonly cancelRecoveryHandler: CancelRecoveryHandler,
  ) {}

  @Post('request')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a recovery request',
    description:
      'Creates a new recovery request and issues a one-time recovery token.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Recovery request created successfully.',
  })
  async requestRecovery(
    @Body() dto: RequestRecoveryDto,
  ): Promise<RequestRecoveryResult> {
    const command = new RequestRecoveryCommand(
      dto.identityId,
      dto.recoveryType,
      CorrelationId.generate(),
    );

    return this.requestRecoveryHandler.execute(command);
  }

  @Post('complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Complete a recovery',
    description:
      'Validates the supplied recovery token and completes the recovery workflow.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Recovery completed successfully.',
  })
  async completeRecovery(
    @Body() dto: CompleteRecoveryDto,
  ): Promise<CompleteRecoveryResult> {
    const command = new CompleteRecoveryCommand(
      dto.identityId,
      dto.recoveryToken, // 2nd parameter
      dto.recoveryType, // 3rd parameter
      CorrelationId.generate(),
    );

    return this.completeRecoveryHandler.execute(command);
  }

  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel a recovery request',
    description:
      'Cancels an active recovery request before it has been completed.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Recovery cancelled successfully.',
  })
  async cancelRecovery(
    @Body() dto: CancelRecoveryDto,
  ): Promise<CancelRecoveryResult> {
    const command = new CancelRecoveryCommand(
      new RecoveryId(dto.recoveryPublicId),
      (dto.reason ??
        RecoveryFailureReason.CANCELLED_BY_USER) as RecoveryFailureReason,
      CorrelationId.generate(),
    );

    return this.cancelRecoveryHandler.execute(command);
  }
}
