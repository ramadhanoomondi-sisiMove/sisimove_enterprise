// src/domains/identity/domain/repositories/identity-audit.repository.ts

import type { IdentityAuditAggregate } from '../aggregates/identity-audit.aggregate';

import type { IdentityAuditFilter } from './identity-audit-filter';

import type { IdentityAuditId } from '../value-objects/identity-audit-id.vo';

export interface IdentityAuditRepository {
  /**
   * Persists a newly recorded audit event.
   */
  save(audit: IdentityAuditAggregate): Promise<void>;

  /**
   * Persists changes to an existing audit event.
   *
   * Included for repository consistency across the domain,
   * although audit events are expected to be immutable after creation.
   */
  update(audit: IdentityAuditAggregate): Promise<void>;

  /**
   * Retrieves an audit event by its public identifier.
   */
  findByPublicId(
    publicId: IdentityAuditId,
  ): Promise<IdentityAuditAggregate | null>;

  /**
   * Retrieves audit events matching the supplied filter.
   *
   * If no filter is supplied, all audit events are returned.
   */
  find(
    filter?: IdentityAuditFilter,
  ): Promise<readonly IdentityAuditAggregate[]>;

  /**
   * Returns whether an audit event exists.
   */
  exists(publicId: IdentityAuditId): Promise<boolean>;
}
