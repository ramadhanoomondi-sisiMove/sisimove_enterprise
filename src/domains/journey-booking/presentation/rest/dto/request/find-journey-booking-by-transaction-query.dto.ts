// -----------------------------------------------------------------------------
// Journey Booking — Find Journey Booking By Transaction Query DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Query parameters for retrieving a Journey Booking by its associated
 * Financial transaction public identifier.
 *
 * The transaction identifier is a cross-domain public identifier and is
 * converted into JourneyBookingTransactionPublicId by the presentation/
 * application mapping layer.
 */
export class FindJourneyBookingByTransactionQueryDto {
  // ===========================================================================
  // Transaction
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Financial transaction associated with the Journey Booking payment.',
    example: 'TXN-01J8XYZ789',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  transactionPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FindJourneyBookingByTransactionQueryDto;
