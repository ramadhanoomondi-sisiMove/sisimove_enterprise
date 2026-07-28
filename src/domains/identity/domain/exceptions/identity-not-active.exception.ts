// src/domains/identity/domain/exceptions/identity-not-active.exception.ts

export class IdentityNotActiveException extends Error {
  constructor() {
    super('Identity is not active.');
    this.name = 'IdentityNotActiveException';
  }
}
