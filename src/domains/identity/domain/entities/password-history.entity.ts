// src/domains/identity/domain/entities/password-history.entity.ts

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

interface PasswordHistoryProps {
  /**
   * Internal Authentication UUID.
   */
  authenticationId: string;

  /**
   * Historical password hash.
   *
   * Never store plaintext passwords.
   */
  passwordHash: string;

  /**
   * Authentication password version at the time
   * this password was active.
   */
  version: number;

  /**
   * Timestamp when this password became active.
   */
  createdAt: Date;
}

export class PasswordHistoryEntity extends Entity<PasswordHistoryProps> {
  constructor(props: PasswordHistoryProps, id?: UniqueEntityId) {
    super(props, id);
  }

  /**
   * Creates a new password history entry.
   */
  static create(
    authenticationId: string,
    passwordHash: string,
    version: number,
  ): PasswordHistoryEntity {
    return new PasswordHistoryEntity({
      authenticationId,
      passwordHash,
      version,
      createdAt: new Date(),
    });
  }

  /**
   * Internal Authentication UUID.
   */
  get authenticationId(): string {
    return this.props.authenticationId;
  }

  /**
   * Historical password hash.
   */
  get passwordHash(): string {
    return this.props.passwordHash;
  }

  /**
   * Password version.
   */
  get version(): number {
    return this.props.version;
  }

  /**
   * Creation timestamp.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Convenience helper for comparing versions.
   */
  isVersion(version: number): boolean {
    return this.props.version === version;
  }

  /**
   * Returns true if this history entry belongs
   * to the supplied authentication.
   */
  belongsTo(authenticationId: string): boolean {
    return this.props.authenticationId === authenticationId;
  }
}
