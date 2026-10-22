// -----------------------------------------------------------------------------
// Authentication — Change Password Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for changing an Authentication password.
//
// The client supplies only the new password.
//
// The backend derives:
// - authenticationPublicId from the authenticated request context;
// - changedAt from the server clock;
// - correlationId from the request/application correlation context;
// - causationId from the application workflow when applicable.
//
// The password is hashed by the backend before the domain command is created.
//
// Security requirements:
// - Never log or persist the plaintext password.
// - Never include the plaintext password in domain events.
// - Never store the plaintext password on AuthenticationEntity.
// - Enforce authentication, authorization, and ownership in the backend.
//
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_PASSWORD_LENGTH = 1;
const MAX_PASSWORD_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Request to change the authenticated user's password.
 *
 * The caller supplies only the new plaintext password.
 * All security identifiers and operational metadata are server-managed.
 */
export class ChangePasswordRequestDto {
  /**
   * New plaintext password.
   *
   * Whitespace is preserved exactly as supplied.
   * The backend hashes the password before creating the domain command.
   */
  @ApiProperty({
    example: 'NewSecurePassword123!',
    description: 'The new password for the authenticated user.',
    minLength: MIN_PASSWORD_LENGTH,
    maxLength: MAX_PASSWORD_LENGTH,
    writeOnly: true,
  })
  @IsString({
    message: 'password must be a string.',
  })
  @MinLength(MIN_PASSWORD_LENGTH, {
    message: 'password must not be empty.',
  })
  @MaxLength(MAX_PASSWORD_LENGTH, {
    message: `password must not exceed ${MAX_PASSWORD_LENGTH} characters.`,
  })
  password!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PASSWORD_LENGTH as AUTHENTICATION_PASSWORD_MIN_LENGTH,
  MAX_PASSWORD_LENGTH as AUTHENTICATION_PASSWORD_MAX_LENGTH,
};

export default ChangePasswordRequestDto;
