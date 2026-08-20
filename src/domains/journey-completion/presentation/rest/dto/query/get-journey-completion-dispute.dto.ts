// -----------------------------------------------------------------------------
// Journey Completion — Get Dispute Query DTO
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
 * REST query DTO for retrieving a specific Journey Completion dispute.
 *
 * Both identifiers remain transport-level primitives. The application query
 * handler converts them into domain value objects.
 */
export class GetJourneyCompletionDisputeQueryDto {
  // ===========================================================================
  // Journey Completion Public ID
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Completion that owns the dispute.',
    example: 'JCP_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  completionPublicId!: string;

  // ===========================================================================
  // Dispute Public ID
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Completion dispute to retrieve.',
    example: 'JCD_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  disputePublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionDisputeQueryDto;
