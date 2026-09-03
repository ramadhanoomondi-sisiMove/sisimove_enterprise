// -----------------------------------------------------------------------------
// Identity — Change Phone Number Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for changing the phone number of an Identity.
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs at the presentation/application mapping
// boundary.
//
// The request identifies the Identity aggregate and provides the new phone
// number together with the correlation metadata required for the operation.
//
// The application handler loads the IdentityAggregate, converts the transport
// phone number string into IdentityPhoneNumber, invokes:
//
//     identityAggregate.changePhoneNumber(...)
//
// and persists the aggregate.
//
// The aggregate is responsible for:
//
// - validating the Identity lifecycle state;
// - validating the phone number through IdentityPhoneNumber;
// - determining whether the value actually changed;
// - determining the phone-number-change timestamp;
// - changing the Identity phone number;
// - recording IdentityPhoneNumberChangedEvent.
//
// Phone verification, OTP, authentication, notification, and other downstream
// consequences remain outside this aggregate.
//
// This DTO does NOT:
//
// - supply the phone-number-change timestamp;
// - mutate IdentityEntity directly;
// - construct IdentityEntity;
// - perform phone-number verification;
// - generate or send OTP challenges;
// - authenticate the Identity;
// - create or revoke authentication credentials;
// - create or revoke sessions;
// - send notifications;
// - perform external integration side effects;
// - emit IdentityPhoneNumberChangedEvent directly.
//
// The phone-number-change timestamp is a domain fact determined by
// IdentityAggregate when the phone-number change actually occurs.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2",
//       "phoneNumber": "+254712345678",
//       "correlationId": "COR-01K3R8Y7Q2",
//       "causationId": "CMD-01K3R8Y6M4"
//     }
//
// -----------------------------------------------------------------------------
//
// Timestamp ownership:
//
// HTTP DTO
//     │
//     ├── identityPublicId
//     ├── phoneNumber
//     ├── correlationId
//     └── causationId
//              │
//              ▼
// ChangeIdentityPhoneNumberCommand
//              │
//              ▼
// ChangeIdentityPhoneNumberHandler
//              │
//              ▼
// IdentityAggregate.changePhoneNumber(phoneNumber, correlationId)
//              │
//              ├── determines changedAt
//              ├── mutates IdentityEntity
//              └── records IdentityPhoneNumberChangedEvent
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_IDENTITY_PUBLIC_ID_LENGTH = 1;
const MAX_IDENTITY_PUBLIC_ID_LENGTH = 128;

const MIN_PHONE_NUMBER_LENGTH = 7;
const MAX_PHONE_NUMBER_LENGTH = 20;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for changing an Identity's phone number.
 *
 * Represents the application-level intent to replace the current phone
 * number of an existing Identity aggregate.
 *
 * Required transport input:
 *
 * - identityPublicId;
 * - phoneNumber;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId.
 *
 * The phone-number-change timestamp is intentionally NOT supplied by the
 * caller. IdentityAggregate determines changedAt when the phone-number change
 * occurs.
 *
 * The following values are intentionally NOT supplied:
 *
 * - IdentityPhoneNumber value object;
 * - identity status;
 * - phone-number verification state;
 * - OTP challenges;
 * - authentication credentials;
 * - sessions;
 * - mutation timestamp;
 * - domain events.
 *
 * Those concerns are handled by the appropriate domain and application
 * boundaries.
 */
export class ChangeIdentityPhoneNumberRequestDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity aggregate whose phone number is being
   * changed.
   *
   * This is an opaque public identifier and not a persistence/internal
   * identifier.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Identity aggregate whose phone number is being changed.',
    minLength: MIN_IDENTITY_PUBLIC_ID_LENGTH,
    maxLength: MAX_IDENTITY_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'identityPublicId must be a string.',
  })
  @MinLength(MIN_IDENTITY_PUBLIC_ID_LENGTH, {
    message: 'identityPublicId must not be empty.',
  })
  @MaxLength(MAX_IDENTITY_PUBLIC_ID_LENGTH, {
    message: `identityPublicId must not exceed ${MAX_IDENTITY_PUBLIC_ID_LENGTH} characters.`,
  })
  identityPublicId!: string;

  // ===========================================================================
  // Phone Number
  // ===========================================================================

  /**
   * New phone number for the Identity.
   *
   * The transport string is converted to the IdentityPhoneNumber value object
   * at the presentation/application mapping boundary.
   *
   * The expected representation is an international E.164 phone number.
   *
   * Example:
   *
   * - +254712345678
   */
  @ApiProperty({
    example: '+254712345678',
    description:
      'New international phone number for the Identity. The transport string is converted to the IdentityPhoneNumber value object at the application boundary.',
    minLength: MIN_PHONE_NUMBER_LENGTH,
    maxLength: MAX_PHONE_NUMBER_LENGTH,
    pattern: '^\\+[1-9]\\d{6,19}$',
  })
  @Transform(trimString)
  @IsString({
    message: 'phoneNumber must be a string.',
  })
  @MinLength(MIN_PHONE_NUMBER_LENGTH, {
    message: `phoneNumber must be at least ${MIN_PHONE_NUMBER_LENGTH} characters.`,
  })
  @MaxLength(MAX_PHONE_NUMBER_LENGTH, {
    message: `phoneNumber must not exceed ${MAX_PHONE_NUMBER_LENGTH} characters.`,
  })
  @Matches(/^\+[1-9]\d{6,19}$/, {
    message:
      'phoneNumber must be a valid international phone number in E.164 format.',
  })
  phoneNumber!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the phone-number change operation.
   *
   * This identifies the end-to-end business operation and is propagated to
   * the resulting IdentityPhoneNumberChangedEvent.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the phone-number change operation and resulting domain event.',
    minLength: MIN_CORRELATION_ID_LENGTH,
    maxLength: MAX_CORRELATION_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'correlationId must be a string.',
  })
  @MinLength(MIN_CORRELATION_ID_LENGTH, {
    message: 'correlationId must not be empty.',
  })
  @MaxLength(MAX_CORRELATION_ID_LENGTH, {
    message: `correlationId must not exceed ${MAX_CORRELATION_ID_LENGTH} characters.`,
  })
  correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command, event, or operation that caused this
   * phone-number change request.
   *
   * When supplied, this value is propagated through the application workflow
   * and associated with the resulting domain event.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this phone-number change request.',
    nullable: true,
    minLength: MIN_CAUSATION_ID_LENGTH,
    maxLength: MAX_CAUSATION_ID_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'causationId must be a string.',
  })
  @MinLength(MIN_CAUSATION_ID_LENGTH, {
    message: 'causationId must not be empty.',
  })
  @MaxLength(MAX_CAUSATION_ID_LENGTH, {
    message: `causationId must not exceed ${MAX_CAUSATION_ID_LENGTH} characters.`,
  })
  causationId?: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_IDENTITY_PUBLIC_ID_LENGTH as IDENTITY_CHANGE_PHONE_NUMBER_PUBLIC_ID_MIN_LENGTH,
  MAX_IDENTITY_PUBLIC_ID_LENGTH as IDENTITY_CHANGE_PHONE_NUMBER_PUBLIC_ID_MAX_LENGTH,
  MIN_PHONE_NUMBER_LENGTH as IDENTITY_CHANGE_PHONE_NUMBER_MIN_LENGTH,
  MAX_PHONE_NUMBER_LENGTH as IDENTITY_CHANGE_PHONE_NUMBER_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as IDENTITY_CHANGE_PHONE_NUMBER_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as IDENTITY_CHANGE_PHONE_NUMBER_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as IDENTITY_CHANGE_PHONE_NUMBER_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as IDENTITY_CHANGE_PHONE_NUMBER_CAUSATION_ID_MAX_LENGTH,
};
