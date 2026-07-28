// src/domains/identity/domain/exceptions/identity-not-found.exception.ts

export class IdentityNotFoundException extends Error {
  constructor(publicId: string) {
    super(`Identity with public ID '${publicId}' was not found.`);

    this.name = 'IdentityNotFoundException';
  }
}
