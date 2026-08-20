// -----------------------------------------------------------------------------
// Journey Completion — Review Dispute Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for placing a Journey Completion dispute under review.
 *
 * The DTO contains primitive transport values only.
 *
 * The controller/application boundary converts:
 *
 * - disputePublicId -> JourneyCompletionDisputePublicId
 * - underReviewAt -> Date
 *
 * before constructing ReviewJourneyCompletionDisputeCommand.
 */
export class ReviewJourneyCompletionDisputeDto {
  // ===========================================================================
  // Dispute Public ID
  // ===========================================================================

  /**
   * Public identity of the Journey Completion dispute.
   *
   * This is normally supplied by the route. It remains here as a DTO field
   * only for transport contracts that use the DTO independently.
   */
  @ApiProperty({
    description: 'Public identifier of the Journey Completion dispute.',
    example: 'JCD_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  disputePublicId!: string;

  // ===========================================================================
  // Correlation ID
  // ===========================================================================

  /**
   * Application correlation identifier.
   */
  @ApiProperty({
    description:
      'Correlation identifier used for tracing the dispute review command.',
    example: '9f4a8f1d-6a6e-4c2f-b9e6-1a2f31a8c741',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  correlationId!: string;

  // ===========================================================================
  // Causation ID
  // ===========================================================================

  /**
   * Optional identifier of the command or event that caused this operation.
   */
  @ApiPropertyOptional({
    description:
      'Optional causation identifier for the command or event chain.',
    example: '8e2e3f10-2a8f-45cc-91e8-53cf7d4b1920',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  causationId?: string;

  // ===========================================================================
  // Under Review Timestamp
  // ===========================================================================

  /**
   * Optional timestamp at which the dispute entered review.
   *
   * The command/application boundary converts this primitive string to Date.
   */
  @ApiPropertyOptional({
    description:
      'Optional timestamp at which the dispute entered the review state.',
    example: '2026-08-20T17:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  underReviewAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ReviewJourneyCompletionDisputeDto;
