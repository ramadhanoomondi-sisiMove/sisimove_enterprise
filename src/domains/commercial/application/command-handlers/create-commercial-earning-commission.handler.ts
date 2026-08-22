// -----------------------------------------------------------------------------
// Commercial Earning Commission — Create Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { COMMERCIAL_EARNING_COMMISSION_TOKENS } from '../commercial-earning-commission.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CreateCommercialEarningCommissionCommand } from '../commands/create-commercial-earning-commission.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { CommercialEarningCommissionAggregate } from '../../domain/aggregates/commercial-earning-commission.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { CommercialEarningCommissionEntity } from '../../domain/entities/commercial-earning-commission.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { CommercialEarningCommissionRepository } from '../../domain/repositories/commercial-earning-commission.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { CommercialEarningCommissionPublicId } from '../../domain/value-objects/commercial-earning-commission-public-id.vo';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { CommercialEarningCommissionAlreadyExistsException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles creation of a Commercial Earning Commission aggregate.
 *
 * The command is expected to contain already validated domain value objects
 * for:
 *
 * - Commercial Commission Rule reference;
 * - Journey reference;
 * - Settlement reference;
 * - Provider reference;
 * - commission percentage;
 * - provider earning base amount;
 * - commission amount;
 * - provider net earning amount;
 * - currency.
 *
 * The handler is responsible for application-level orchestration:
 *
 * 1. Ensure a Commercial Earning Commission does not already exist for the
 *    Settlement.
 * 2. Generate the Commercial Earning Commission public identity.
 * 3. Create the Commercial Earning Commission entity in PENDING state.
 * 4. Create the Commercial Earning Commission aggregate.
 * 5. Persist the aggregate.
 * 6. Return the created aggregate.
 *
 * The Settlement is the uniqueness boundary for a Commercial Earning
 * Commission. One Settlement can have at most one Commercial Earning
 * Commission.
 *
 * CommercialEarningCommissionEntity.create() is responsible for:
 *
 * - entity creation;
 * - creation invariant enforcement;
 * - initializing the commission lifecycle in PENDING state.
 *
 * CommercialEarningCommissionAggregate.create() is responsible for:
 *
 * - aggregate creation;
 * - recording CommercialEarningCommissionCreatedEvent.
 *
 * The handler does not modify or own:
 *
 * - Journey;
 * - Journey Settlement;
 * - Identity / Provider;
 * - Commercial Commission Rule;
 * - Wallet;
 * - Disbursement;
 * - Treasury;
 * - Accounting.
 *
 * Those concepts remain independent aggregates or bounded contexts and are
 * referenced through public identifiers.
 */
@Injectable()
export class CreateCommercialEarningCommissionHandler implements CommandHandler<
  CreateCommercialEarningCommissionCommand,
  CommercialEarningCommissionAggregate
> {
  public constructor(
    @Inject(COMMERCIAL_EARNING_COMMISSION_TOKENS.REPOSITORY)
    private readonly repository: CommercialEarningCommissionRepository,
  ) {}

  public async execute(
    command: CreateCommercialEarningCommissionCommand,
  ): Promise<CommercialEarningCommissionAggregate> {
    const alreadyExists = await this.repository.existsBySettlementPublicId(
      command.settlementPublicId,
    );

    if (alreadyExists) {
      throw new CommercialEarningCommissionAlreadyExistsException(
        command.settlementPublicId.value,
      );
    }

    const commercialEarningCommissionPublicId =
      new CommercialEarningCommissionPublicId();

    const commercialEarningCommission =
      CommercialEarningCommissionEntity.create({
        publicId: commercialEarningCommissionPublicId,
        journeyPublicId: command.journeyPublicId,
        settlementPublicId: command.settlementPublicId,
        providerPublicId: command.providerPublicId,
        commissionRulePublicId: command.commissionRulePublicId,
        percentage: command.percentage,
        baseAmount: command.baseAmount,
        commissionAmount: command.commissionAmount,
        netAmount: command.netAmount,
        currency: command.currency,
      });

    const aggregate = CommercialEarningCommissionAggregate.create(
      commercialEarningCommission,
      command.correlationId,
    );

    await this.repository.save(aggregate);

    return aggregate;
  }
}

export default CreateCommercialEarningCommissionHandler;
