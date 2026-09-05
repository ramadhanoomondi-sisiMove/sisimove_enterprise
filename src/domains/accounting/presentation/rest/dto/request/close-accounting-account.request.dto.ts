// -----------------------------------------------------------------------------
// Accounting — Close Account Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for closing an existing Accounting Account.
//
// User-facing intent:
//
//     Close Accounting Account
//
// The user only needs to identify which account should be closed.
//
// The application/domain determines whether the operation is permitted.
//
// Lifecycle:
//
//     ACTIVE   → CLOSED
//     INACTIVE → CLOSED
//
// CLOSED is terminal.
//
// The request does NOT supply:
//
// - internal/persistence ID;
// - status;
// - closedAt;
// - createdAt;
// - updatedAt;
// - lifecycle state;
// - correlationId;
// - causationId.
//
// The client should not tell the system that an account is closable.
// The system determines that from the aggregate.
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
 * REST request for closing an Accounting Account.
 *
 * Only the account's public identity is required.
 */
export class CloseAccountingAccountRequestDto {
  // ===========================================================================
  // Account Public Identity
  // ===========================================================================

  /**
   * Public identity of the Accounting Account to close.
   */
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Public identity of the Accounting Account to close.',
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
// Default Exports
// -----------------------------------------------------------------------------

export default CloseAccountingAccountRequestDto;
