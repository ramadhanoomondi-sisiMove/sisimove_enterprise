// src/domains/journey-demand/presentation/rest/dto/queries/get-my-journey-demands-query.dto.ts

// -----------------------------------------------------------------------------
// sisiMove — Get My Journey Demands — Query DTO
// -----------------------------------------------------------------------------
//
// HTTP query DTO for retrieving the authenticated requester's Journey Demands.
//
// IMPORTANT:
// - requesterPublicId MUST NOT be supplied by the client.
// - Ownership is derived from the authenticated JWT identity by the controller.
// - Therefore this DTO contains pagination only.
//
// Request flow:
//
//   GET /journey-demands/me
//          |
//          v
//   JwtAuthGuard
//          |
//          v
//   CurrentIdentity.identityPublicId
//          |
//          v
//   GetMyJourneyDemandsQuery
//          |
//          v
//   JourneyDemandRepository
//
// This prevents a client from selecting another requester's public ID through
// the /me endpoint.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsInt, IsOptional, Max, Min } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class GetMyJourneyDemandsQueryDto {
  // ===========================================================================
  // Pagination
  // ===========================================================================

  @ApiPropertyOptional({
    description: 'Maximum number of Journey Demands to return.',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Number of Journey Demands to skip before returning results.',
    example: 0,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMyJourneyDemandsQueryDto;
