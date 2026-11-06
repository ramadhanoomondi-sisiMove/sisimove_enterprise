// -----------------------------------------------------------------------------
// SisiMove Platform — General Ledger Account Provisioner
// -----------------------------------------------------------------------------
//
// Purpose:
//   Idempotently provisions the platform-wide KES Chart of Accounts defined by
//   PLATFORM_GL_ACCOUNTS.
//
// Responsibilities:
//   - validate the static catalogue before touching persistence;
//   - resolve each parent by its account code;
//   - translate parentCode into the parent's internal UniqueEntityId;
//   - create missing AccountingAccount aggregates;
//   - persist newly created AccountingAccount aggregates through the repository;
//   - leave existing account records and lifecycle states unchanged;
//   - fail loudly when an existing account conflicts with the catalogue.
//
// Boundaries:
//   - This class does not use Prisma directly.
//   - This class does not create FinancialAccount wallet records.
//   - This class does not define transaction-to-GL posting mappings.
//   - Catalogue descriptions are documentation and are not persisted by the
//     current AccountingAccount model.
//
// The class runs during NestJS application bootstrap. AccountingModule wires
// the repository and UnitOfWork through its factory provider.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS — Application Bootstrap
// -----------------------------------------------------------------------------

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Catalogue
// -----------------------------------------------------------------------------

import {
  PLATFORM_GL_ACCOUNTS,
  validatePlatformGlAccountCatalogue,
  type PlatformGlAccountDefinition,
} from './platform-gl-accounts.catalogue';

// -----------------------------------------------------------------------------
// Domain — Aggregate and Entity
// -----------------------------------------------------------------------------

import { AccountingAccountAggregate } from '../../domain/aggregates/accounting-account.aggregate';

import { AccountingAccountEntity } from '../../domain/entities/accounting-account.entity';

// -----------------------------------------------------------------------------
// Domain — Repository Contract
// -----------------------------------------------------------------------------

import type { AccountingAccountRepository } from '../../domain/repositories/accounting-account.repository';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import { AccountingAccountCode } from '../../domain/value-objects/accounting-account-code.vo';

import { AccountingAccountName } from '../../domain/value-objects/accounting-account-name.vo';

import { AccountingAccountType } from '../../domain/value-objects/accounting-account-type.vo';

// -----------------------------------------------------------------------------
// Foundation — Unit Of Work
// -----------------------------------------------------------------------------

import type { UnitOfWork } from '../../../../foundation/persistence/unit-of-work.interface';

// =============================================================================
// Result
// =============================================================================

export interface PlatformGlAccountsProvisioningResult {
  /** Number of catalogue accounts newly created. */
  readonly createdCount: number;

  /** Number of catalogue accounts already present and matching. */
  readonly existingCount: number;

  /** Newly created account codes, in catalogue order. */
  readonly createdCodes: readonly string[];

  /** Existing account codes, in catalogue order. */
  readonly existingCodes: readonly string[];
}

// =============================================================================
// Provisioner
// =============================================================================

@Injectable()
export class PlatformGlAccountsProvisioner implements OnApplicationBootstrap {
  private readonly logger = new Logger(PlatformGlAccountsProvisioner.name);

  public constructor(
    private readonly accountRepository: AccountingAccountRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {
    if (!accountRepository) {
      throw new Error('Accounting Account repository is required.');
    }

    if (!unitOfWork) {
      throw new Error('UnitOfWork is required.');
    }
  }

  // ---------------------------------------------------------------------------
  // Application Bootstrap
  // ---------------------------------------------------------------------------

  /**
   * Ensures the platform General Ledger chart of accounts exists after NestJS
   * has initialized the application modules.
   *
   */
  public async onApplicationBootstrap(): Promise<void> {
    const result = await this.provision();

    this.logger.log(
      `Platform GL accounts are available. ` +
        `Created: ${result.createdCount}; ` +
        `already existed: ${result.existingCount}; ` +
        `catalogue total: ${result.createdCount + result.existingCount}.`,
    );

    if (result.createdCodes.length > 0) {
      this.logger.log(
        `Created platform GL account codes: ${result.createdCodes.join(', ')}.`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Provision
  // ---------------------------------------------------------------------------

  /**
   * Provisions every catalogue account in one UnitOfWork.
   *
   * Existing accounts are never silently overwritten or reactivated. If an
   * existing account's code, name, type, or parent relationship differs from
   * the catalogue, provisioning fails and the UnitOfWork rolls back.
   */
  public async provision(): Promise<PlatformGlAccountsProvisioningResult> {
    validatePlatformGlAccountCatalogue();

    return this.unitOfWork.execute(async () => {
      const resolvedAccounts = new Map<string, AccountingAccountAggregate>();

      const createdCodes: string[] = [];
      const existingCodes: string[] = [];

      for (const definition of PLATFORM_GL_ACCOUNTS) {
        const accountCode = AccountingAccountCode.create(definition.code);
        const existing = await this.accountRepository.findByCode(accountCode);

        if (existing !== null) {
          this.ensureExistingAccountMatches(
            definition,
            existing,
            resolvedAccounts,
          );

          resolvedAccounts.set(definition.code, existing);
          existingCodes.push(definition.code);
          continue;
        }

        const parentAccountId = definition.parentCode
          ? this.resolveParentAccountId(definition, resolvedAccounts)
          : undefined;

        const accountEntity = AccountingAccountEntity.create(
          accountCode,
          AccountingAccountName.create(definition.name),
          AccountingAccountType.fromValue(definition.type),
          parentAccountId,
        );

        const aggregate = AccountingAccountAggregate.create(accountEntity);

        await this.accountRepository.save(aggregate);

        resolvedAccounts.set(definition.code, aggregate);
        createdCodes.push(definition.code);
      }

      return {
        createdCount: createdCodes.length,
        existingCount: existingCodes.length,
        createdCodes,
        existingCodes,
      };
    });
  }

  // ---------------------------------------------------------------------------
  // Parent Resolution
  // ---------------------------------------------------------------------------

  /**
   * Resolves the parent's internal persistence identity.
   *
   * Catalogue order is expected to place every parent before its children.
   * The catalogue validator guarantees that each parent code exists; this
   * method additionally ensures it has already been resolved in this run.
   */
  private resolveParentAccountId(
    definition: PlatformGlAccountDefinition,
    resolvedAccounts: ReadonlyMap<string, AccountingAccountAggregate>,
  ): AccountingAccountAggregate['id'] {
    const parentCode = definition.parentCode;

    if (parentCode === undefined) {
      throw new Error(
        `Platform GL account ${definition.code} does not define a parent.`,
      );
    }

    const parent = resolvedAccounts.get(parentCode);

    if (parent === undefined) {
      throw new Error(
        `Parent ${parentCode} must be provisioned before child account ${definition.code}.`,
      );
    }

    if (parent.type.value !== definition.type) {
      throw new Error(
        `Platform GL account ${definition.code} (${definition.type}) has parent ${parent.code.value} (${parent.type.value}).`,
      );
    }

    return parent.id;
  }

  // ---------------------------------------------------------------------------
  // Existing Account Validation
  // ---------------------------------------------------------------------------

  /**
   * Existing records are treated as authoritative operational data.
   * Provisioning verifies them rather than mutating them.
   */
  private ensureExistingAccountMatches(
    definition: PlatformGlAccountDefinition,
    existing: AccountingAccountAggregate,
    resolvedAccounts: ReadonlyMap<string, AccountingAccountAggregate>,
  ): void {
    if (existing.code.value !== definition.code) {
      throw new Error(
        `Existing platform GL account lookup returned code ${existing.code.value} for requested code ${definition.code}.`,
      );
    }

    if (existing.name.value !== definition.name) {
      throw new Error(
        `Platform GL account ${definition.code} name mismatch. Expected "${definition.name}", found "${existing.name.value}".`,
      );
    }

    if (existing.type.value !== definition.type) {
      throw new Error(
        `Platform GL account ${definition.code} type mismatch. Expected ${definition.type}, found ${existing.type.value}.`,
      );
    }

    if (definition.parentCode === undefined) {
      if (existing.hasParentAccount()) {
        throw new Error(
          `Platform GL root account ${definition.code} unexpectedly has a parent.`,
        );
      }

      return;
    }

    const expectedParent = resolvedAccounts.get(definition.parentCode);

    if (expectedParent === undefined) {
      throw new Error(
        `Parent ${definition.parentCode} must be resolved before validating existing account ${definition.code}.`,
      );
    }

    const actualParentId = existing.parentAccountId;

    if (
      actualParentId === undefined ||
      !actualParentId.equals(expectedParent.id)
    ) {
      throw new Error(
        `Platform GL account ${definition.code} has an unexpected parent. Expected ${definition.parentCode}.`,
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PlatformGlAccountsProvisioner;
