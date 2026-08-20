// -----------------------------------------------------------------------------
// Journey Settlement — Get Query DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving a Journey Settlement by public identity.
 *
 * The public identifier remains a transport-level primitive. The application
 * query handler converts it into JourneySettlementPublicId before accessing
 * the domain repository.
 */
export class GetJourneySettlementQueryDto {
  // ===========================================================================
  // Journey Settlement Public ID
  // ===========================================================================

  @ApiProperty({
    description: 'Public identifier of the Journey Settlement to retrieve.',
    example: 'JST_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  journeySettlementPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneySettlementQueryDto;
