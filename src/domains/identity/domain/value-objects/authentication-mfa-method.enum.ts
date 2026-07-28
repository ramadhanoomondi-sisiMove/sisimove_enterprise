// src/domains/identity/domain/value-objects/authentication-mfa-method.enum.ts

export enum AuthenticationMfaMethod {
  TOTP = 'TOTP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PASSKEY = 'PASSKEY',
}
