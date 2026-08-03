import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CorrelationId } from '../../../../../foundation/logging/correlation-id';

import { RequirePermissions } from '../../../../identity/presentation/auth';

import {
  ApproveAssetCommand,
  RejectAssetCommand,
} from '../../../application/commands';

import {
  ApproveAssetHandler,
  RejectAssetHandler,
} from '../../../application/handlers';

import { ApproveAssetRequest, RejectAssetRequest } from '../requests';

@ApiTags('Asset Moderation')
@ApiBearerAuth()
@Controller('assets')
export class AssetModerationController {
  constructor(
    private readonly approveAssetHandler: ApproveAssetHandler,
    private readonly rejectAssetHandler: RejectAssetHandler,
  ) {}

  @Post(':publicId/moderation/approve')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions('assets.moderate')
  @ApiOperation({
    summary: 'Approve an asset moderation.',
  })
  @ApiNoContentResponse({
    description: 'Asset moderation approved successfully.',
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async approve(
    @Param('publicId') publicId: string,
    @Body() request: ApproveAssetRequest,
  ): Promise<void> {
    await this.approveAssetHandler.execute(
      new ApproveAssetCommand(
        publicId,
        request.type,
        request.moderatorIdentityPublicId,
        request.confidence,
        new Date(),
        CorrelationId.generate(),
      ),
    );
  }

  @Post(':publicId/moderation/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions('assets.moderate')
  @ApiOperation({
    summary: 'Reject an asset moderation.',
  })
  @ApiNoContentResponse({
    description: 'Asset moderation rejected successfully.',
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async reject(
    @Param('publicId') publicId: string,
    @Body() request: RejectAssetRequest,
  ): Promise<void> {
    await this.rejectAssetHandler.execute(
      new RejectAssetCommand(
        publicId,
        request.type,
        request.reason,
        request.moderatorIdentityPublicId,
        request.confidence,
        new Date(),
        CorrelationId.generate(),
      ),
    );
  }
}
