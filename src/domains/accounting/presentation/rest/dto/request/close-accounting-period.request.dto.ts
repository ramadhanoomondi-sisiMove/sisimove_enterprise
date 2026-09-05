// -----------------------------------------------------------------------------
// Accounting — Close Accounting Period Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for closing an existing Accounting Period aggregate.
//
// Aggregate:
//
// AccountingPeriodAggregate
// └── AccountingPeriodEntity
//
// User-facing intent:
//
//     Close Accounting Period
//
// Lifecycle:
//
//     OPEN → CLOSED
//
// CLOSED is terminal.
//
// The Accounting Period is identified by its public identity.
//
// The caller does NOT need to provide a closing timestamp. The application
// execution workflow establishes the effective closing timestamp when the
// operation is performed.
//
// This request does NOT supply:
//
// - Accounting Period internal ID;
// - closing timestamp;
// - period status;
// - closedAt;
// - createdAt;
// - updatedAt;
// - correlation ID;
// - causation ID.
//
// Those values belong to the domain, persistence, or application execution
// context.
//
// This DTO does NOT:
//
// - load the Accounting Period;
// - validate the Accounting Period lifecycle;
// - determine whether journals remain outstanding;
// - validate related journal aggregates;
// - modify the aggregate;
// - persist the aggregate;
// - access Prisma;
// - perform authorization.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "publicId": "7b4c7b7e-2d2a-4e6c-8a8b-7f2d9a1c1234"
//     }
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
 * REST request for closing an Accounting Period.
 *
 * The caller only identifies which Accounting Period should be closed.
 *
 * Required transport input:
 *
 * - publicId.
 *
 * The application layer converts the public identity into
 * AccountingPeriodPublicId before constructing CloseAccountingPeriodCommand.
 *
 * The closing timestamp is intentionally not exposed at the REST boundary.
 * It is established by the application/domain execution workflow.
 */
export class CloseAccountingPeriodRequestDto {
  // ===========================================================================
  // Public Identity
  // ===========================================================================

  /**
   * Public identity of the Accounting Period to close.
   */
  @ApiProperty({
    example: '7b4c7b7e-2d2a-4e6c-8a8b-7f2d9a1c1234',
    description: 'Public identity of the Accounting Period to close.',
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

export default CloseAccountingPeriodRequestDto;
