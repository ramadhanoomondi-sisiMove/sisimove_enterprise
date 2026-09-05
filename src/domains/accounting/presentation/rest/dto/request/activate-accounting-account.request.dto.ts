// -----------------------------------------------------------------------------
// Accounting — Activate Account Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for activating an existing Accounting Account.
//
// User-facing intent:
//
//     Activate Accounting Account
//
// Lifecycle:
//
//     INACTIVE → ACTIVE
//
// The user only needs to identify the Accounting Account to activate.
//
// The system determines:
//
// - whether the account exists;
// - whether the account is INACTIVE;
// - whether activation is permitted;
// - the resulting lifecycle state;
// - lifecycle timestamps.
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
// The client should not tell the system that an account can be activated.
// The domain determines that.
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
 * REST request for activating an Accounting Account.
 *
 * Only the account's public identity is required.
 */
export class ActivateAccountingAccountRequestDto {
  // ===========================================================================
  // Account Public Identity
  // ===========================================================================

  /**
   * Public identity of the Accounting Account to activate.
   */
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Public identity of the Accounting Account to activate.',
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

export default ActivateAccountingAccountRequestDto;
