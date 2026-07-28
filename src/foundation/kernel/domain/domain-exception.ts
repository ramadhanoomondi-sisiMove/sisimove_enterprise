// src/foundation/kernel/domain/domain-exception.ts

export abstract class DomainException extends Error {
  protected constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);

    this.name = new.target.name;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace?.(this, new.target);
  }
}
