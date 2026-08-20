// -----------------------------------------------------------------------------
// Journey Completion — Get Confirmation Query DTO
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
 * REST query DTO for retrieving a specific Journey Completion confirmation.
 *
 * Both identifiers are transport-level primitives. Conversion to domain
 * value objects occurs in the application query handler.
 */
export class GetJourneyCompletionConfirmationQueryDto {
  // ===========================================================================
  // Journey Completion Public ID
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Completion that owns the confirmation.',
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
  // Confirmation Public ID
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Completion confirmation to retrieve.',
    example: 'JCC_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  confirmationPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionConfirmationQueryDto;
