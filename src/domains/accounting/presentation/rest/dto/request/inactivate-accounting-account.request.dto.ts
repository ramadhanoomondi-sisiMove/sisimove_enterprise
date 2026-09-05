// -----------------------------------------------------------------------------
// Accounting — Inactivate Account Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for inactivating an existing Accounting Account.
//
// User-facing intent:
//
//     Inactivate Accounting Account
//
// Lifecycle:
//
//     ACTIVE → INACTIVE
//
// The user only needs to identify the Accounting Account to inactivate.
//
// The system determines:
//
// - whether the account exists;
// - whether the account is ACTIVE;
// - whether inactivation is permitted;
// - the resulting lifecycle state.
//
// The request does NOT supply:
//
// - internal/persistence ID;
// - status;
// - lifecycle state;
// - timestamps;
// - correlationId;
// - causationId.
//
// The client should not provide the resulting status. The domain owns the
// lifecycle transition.
//
// This DTO does NOT:
//
// - load the account;
// - access Prisma;
// - access repositories;
// - perform the lifecycle transition;
// - persist the aggregate;
// - construct domain events;
// - perform authorization.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsString, IsUUID } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request for inactivating an Accounting Account.
 *
 * Only the account's public identity is required.
 */
export class InactivateAccountingAccountRequestDto {
  // ===========================================================================
  // Account Public Identity
  // ===========================================================================

  /**
   * Public identity of the Accounting Account to inactivate.
   */
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Public identity of the Accounting Account to inactivate.',
    format: 'uuid',
  })
  @IsString({
    message: 'publicId must be a string.',
  })
  @IsUUID('4', {
    message: 'publicId must be a valid UUID.',
  })
  publicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default InactivateAccountingAccountRequestDto;
