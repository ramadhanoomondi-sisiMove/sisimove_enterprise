// -----------------------------------------------------------------------------
// Journey Booking — Cancel Request DTO
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { JOURNEY_BOOKING_CANCELLATION_REASONS } from '../../../../domain/value-objects';

import type { JourneyBookingCancellationReasonValue } from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class CancelJourneyBookingDto {
  // ===========================================================================
  // Journey Booking
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Booking that should be cancelled.',
    example: 'JBK-01J8XYZ123',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyBookingPublicId!: string;

  // ===========================================================================
  // Cancellation Reason
  // ===========================================================================

  @ApiProperty({
    description: 'Reason for cancelling the Journey Booking.',
    enum: JOURNEY_BOOKING_CANCELLATION_REASONS,
    example: 'PASSENGER_REQUEST',
  })
  @IsEnum(JOURNEY_BOOKING_CANCELLATION_REASONS)
  reason!: JourneyBookingCancellationReasonValue;

  // ===========================================================================
  // Cancelled By
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Public identifier of the passenger, operator, or other actor requesting the cancellation.',
    example: 'IDN-01J8XYZ456',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  cancelledByPublicId?: string;

  // ===========================================================================
  // Reason Description
  // ===========================================================================

  @ApiPropertyOptional({
    description: 'Optional additional explanation for the cancellation.',
    example: 'Passenger changed travel plans.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  reasonDescription?: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  @ApiProperty({
    description:
      'Identifier used to correlate this request with the originating workflow or distributed trace.',
    example: 'corr-01J8XYZ789',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Identifier of the command or event that caused this cancellation request, when applicable.',
    example: 'cmd-01J8XYZABC',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  causationId?: string;

  // ===========================================================================
  // Cancellation Time
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Explicit cancellation timestamp. When omitted, the aggregate uses the current time.',
    example: '2026-08-18T14:30:00.000Z',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  cancelledAt?: string;
}

export default CancelJourneyBookingDto;
