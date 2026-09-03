// -----------------------------------------------------------------------------
// Verification — Create Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for creating a Verification aggregate.
//
// Aggregate:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// Applicant flow:
//
//     POST /verifications
//
// The authenticated identity is obtained exclusively from the JWT:
//
//     req.user.sub
//
// The client does NOT provide:
//
// - identityPublicId;
// - VerificationPublicId;
// - persistence/internal ID;
// - status;
// - level;
// - createdAt;
// - updatedAt;
// - correlationId;
// - causationId.
//
// Verification creation is therefore an authenticated self-service operation.
//
// The backend/application layer is responsible for:
//
// - resolving the authenticated Identity;
// - establishing the Identity → Verification relationship;
// - generating VerificationPublicId;
// - creating VerificationEntity;
// - establishing the initial lifecycle state;
// - establishing the initial verification level;
// - initializing the request collection;
// - establishing timestamps;
// - enforcing aggregate invariants;
// - recording VerificationCreatedEvent.
//
// -----------------------------------------------------------------------------
//
// Initial state:
//
// status   = PENDING
// level    = NONE
// requests = []
//
// No VerificationRequest is created during Verification aggregate creation.
//
// Verification evidence is submitted separately through:
//
//     POST /verifications/:verificationPublicId/requests
//
// -----------------------------------------------------------------------------
//
// Physical-world verification:
//
// The applicant does not need to know or provide internal application metadata
// in order to start verification.
//
// The actual verification evidence is provided in the subsequent
// VerificationRequest operation, for example:
//
// - profile photo;
// - government identification document;
// - driver's licence.
//
// The corresponding uploaded Asset is referenced by assetPublicId.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {}
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiPropertyOptional } from '@nestjs/swagger';

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request for creating a Verification aggregate.
 *
 * This DTO intentionally contains no applicant-supplied fields.
 *
 * The authenticated identity is established from the JWT security context.
 *
 * Example:
 *
 *     {}
 *
 * The verification aggregate is initialized by the application/domain layer.
 */
export class CreateVerificationRequestDto {
  /**
   * This property exists only to make the request model explicit in Swagger
   * when an empty JSON object is submitted.
   *
   * No application value is accepted from the client.
   */
  @ApiPropertyOptional({
    description:
      'No applicant-supplied fields are required to start verification. The authenticated identity is derived from the access token.',
    nullable: true,
    deprecated: true,
  })
  readonly _empty?: never;
}
