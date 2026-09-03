// -----------------------------------------------------------------------------
// Recovery — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating a Recovery aggregate.
//
// The command represents the application-level intent:
//
//     Create Recovery
//
// Token security boundary:
//
//     CreateRecoveryHandler
//            │
//            ▼
//     RecoveryTokenService
//            │
//            ├── generateToken()
//            │        │
//            │        ▼
//            │     raw token
//            │        │
//            │        ▼
//            │     hashToken()
//            │        │
//            │        ▼
//            │   RecoveryTokenHash
//            │
//            ▼
//     RecoveryEntity.create()
//
// The raw recovery token NEVER enters this command.
//
// The recovery-token hash is also NOT supplied by the command. It is produced
// by the application handler from the security abstraction and passed directly
// into the domain factory.
//
// -----------------------------------------------------------------------------
//
// Responsibilities of this command:
//
// - carry the intent to create a Recovery;
// - carry the Identity reference;
// - carry the Recovery type;
// - carry the Recovery expiry;
// - carry correlation metadata.
//
// This command does NOT:
//
// - generate recovery tokens;
// - hash recovery tokens;
// - carry raw recovery tokens;
// - carry recovery-token hashes;
// - validate recovery tokens;
// - create Recovery entities;
// - create Recovery aggregates;
// - persist Recovery;
// - send notifications.
//
// -----------------------------------------------------------------------------
//
// Aggregate created:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// -----------------------------------------------------------------------------
//
// Domain-ready inputs:
//
// - identityPublicId;
// - type;
// - expiresAt.
//
// Application metadata:
//
// - correlationId;
// - causationId.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  RecoveryIdentityPublicId,
  RecoveryType,
  RecoveryExpiresAt,
} from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for creating a Recovery aggregate.
 *
 * Required inputs:
 *
 * - identityPublicId;
 * - type;
 * - expiresAt;
 * - correlationId.
 *
 * Recovery-token material is intentionally absent from the command.
 *
 * The CreateRecoveryHandler is responsible for:
 *
 * 1. generating the raw recovery token through RecoveryTokenService;
 * 2. hashing the raw token through RecoveryTokenService;
 * 3. creating a RecoveryTokenHash value object;
 * 4. supplying only the hash to RecoveryEntity.create().
 *
 * The raw recovery token exists only transiently inside the application
 * workflow and must never enter the command or domain model.
 *
 * The following are intentionally NOT supplied:
 *
 * - raw recovery token;
 * - recovery token hash;
 * - RecoveryPublicId;
 * - persistence/internal ID;
 * - initial status;
 * - requestedAt;
 * - createdAt;
 * - updatedAt;
 * - completedAt;
 * - cancelledAt.
 */
export class CreateRecoveryCommand extends Command {
  constructor(
    /**
     * Opaque public reference to the Identity associated with this Recovery.
     *
     * The value is a domain-ready reference and does not cause the command
     * handler to load or mutate the Identity aggregate.
     */
    public readonly identityPublicId: RecoveryIdentityPublicId,

    /**
     * Recovery workflow type.
     */
    public readonly type: RecoveryType,

    /**
     * Expiry timestamp for the Recovery workflow.
     *
     * The value object owns its timestamp semantics and validation.
     */
    public readonly expiresAt: RecoveryExpiresAt,

    /**
     * Correlation identifier for the Recovery creation operation.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or domain event that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateRecoveryCommand;
