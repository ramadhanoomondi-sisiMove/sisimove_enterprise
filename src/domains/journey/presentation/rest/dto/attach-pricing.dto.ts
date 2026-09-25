import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, IsString, MaxLength, Min } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Request body for attaching pricing configuration to a Journey.
 *
 * The Journey public ID is supplied by the route:
 *
 *     POST /journeys/:journeyPublicId/pricing
 *
 * The JourneyPricing child entity is created by the application layer.
 *
 * Correlation and causation identifiers are application concerns and are
 * therefore not supplied by the HTTP client.
 */
export class AttachPricingDto {
  @ApiProperty({
    example: 1500,
    description:
      'Passenger price for the Journey, expressed in the smallest unit of the configured currency.',
  })
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty({
    example: 'KES',
    description: 'ISO currency code for the Journey price.',
  })
  @IsString()
  @MaxLength(3)
  currency!: string;
}
