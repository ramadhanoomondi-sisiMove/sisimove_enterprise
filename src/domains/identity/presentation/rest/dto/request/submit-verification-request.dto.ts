// -----------------------------------------------------------------------------
// Verification — Submit Verification Request HTTP DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for submitting verification evidence.
//
// The authenticated identity is resolved from the JWT.
// The evidence file is supplied as multipart/form-data and handled separately
// by the FileInterceptor.
//
// This DTO intentionally contains only the verification request type.
//
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class SubmitVerificationRequestRequestDto {
  @ApiProperty({
    enum: ['PROFILE_PHOTO', 'GOVERNMENT_ID', 'DRIVER_LICENSE'],
    example: 'PROFILE_PHOTO',
    description: 'Type of verification evidence being submitted.',
  })
  @IsString()
  @IsIn(['PROFILE_PHOTO', 'GOVERNMENT_ID', 'DRIVER_LICENSE'])
  public readonly type!: string;
}
