// -----------------------------------------------------------------------------
// Journey Settlement — Get By Completion Query DTO
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
 * REST query DTO for retrieving the Journey Settlement associated with
 * a Journey Completion.
 *
 * The Journey Completion public identifier remains a transport primitive.
 * The application query handler converts it into JourneyCompletionPublicId.
 */
export class GetJourneySettlementByCompletionQueryDto {
  // ===========================================================================
  // Journey Completion Public ID
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Completion whose settlement is requested.',
    example: 'JCP_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  completionPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneySettlementByCompletionQueryDto;
