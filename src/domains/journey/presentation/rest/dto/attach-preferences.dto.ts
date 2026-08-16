import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class AttachPreferencesDto {
  @ApiProperty({
    example: 'JRN-ABC12345',
    description: 'Public ID of the Journey to update.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  journeyPublicId!: string;

  @ApiProperty({
    example: 'JPE-ABC12345',
    description:
      'Public ID of the Journey preferences configuration to attach.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  preferencesPublicId!: string;

  @ApiProperty({
    example: 'corr-01J8XYZ123',
    description: 'Correlation identifier for distributed tracing.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  correlationId!: string;

  @ApiPropertyOptional({
    example: 'cmd-01J8XYZ456',
    description: 'Optional causation identifier for distributed tracing.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  causationId?: string;
}
