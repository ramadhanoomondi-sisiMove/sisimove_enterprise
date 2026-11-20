// -----------------------------------------------------------------------------
// Financial Payment — Create Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';
import { randomInt } from 'node:crypto';

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';

import { UNIT_OF_WORK } from '../../../../foundation/persistence/unit-of-work.token';
import type { UnitOfWork } from '../../../../foundation/persistence/unit-of-work.interface';

import { EVENT_PUBLISHER } from '../../../../foundation/events/event-publisher.token';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { CreateFinancialPaymentCommand } from '../commands/create-financial-payment.command';

import { FinancialPaymentAggregate } from '../../domain/aggregates/financial-payment.aggregate';
import { FinancialPaymentEntity } from '../../domain/entities/financial-payment.entity';
import { FinancialC2BReference } from '../../domain/value-objects/financial-c2b-reference.vo';

import type { FinancialPaymentRepository } from '../../domain/repositories/financial-payment.repository';

const C2B_REFERENCE_PREFIX = 'SM';
const C2B_REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const C2B_REFERENCE_SUFFIX_LENGTH = 8;
const C2B_REFERENCE_GENERATION_ATTEMPTS = 5;

@Injectable()
export class CreateFinancialPaymentHandler implements CommandHandler<
  CreateFinancialPaymentCommand,
  FinancialPaymentAggregate
> {
  public constructor(
    @Inject(FINANCIAL_PAYMENT_TOKENS.REPOSITORY)
    private readonly repository: FinancialPaymentRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: UnitOfWork,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  public async execute(
    command: CreateFinancialPaymentCommand,
  ): Promise<FinancialPaymentAggregate> {
    return this.unitOfWork.execute(async () => {
      // 1. Validate payment-channel requirements and generate a C2B reference.
      let c2bReference: FinancialC2BReference | undefined;

      if (command.channel.isStkPush()) {
        if (command.methodId === undefined) {
          throw new Error(
            'STK Push Financial Payments require a selected payment method.',
          );
        }
      } else if (command.channel.isC2B()) {
        if (command.methodId !== undefined) {
          throw new Error(
            'C2B Financial Payments must not use a saved payment method.',
          );
        }

        c2bReference = await this.generateUniqueC2BReference();
      } else {
        throw new Error(
          `Unsupported Financial Payment channel: ${command.channel.value}`,
        );
      }

      // 2. Validate business-reference completeness.
      const hasReferenceType = command.referenceType !== undefined;
      const hasReferencePublicId = command.referencePublicId !== undefined;

      if (hasReferenceType !== hasReferencePublicId) {
        throw new Error(
          'Financial Payment referenceType and referencePublicId must be supplied together.',
        );
      }

      // 3. Validate optional business-reference uniqueness.
      if (hasReferenceType && hasReferencePublicId) {
        const alreadyExists = await this.repository.existsByReference(
          command.referenceType,
          command.referencePublicId,
        );

        if (alreadyExists) {
          throw new Error(
            `A Financial Payment already exists for reference "${command.referencePublicId.value}"`,
          );
        }
      }

      // 4. Create the Financial Payment entity.
      const payment = FinancialPaymentEntity.create(
        command.accountId,
        command.amount,
        command.channel,
        command.methodId,
        command.referenceType,
        command.referencePublicId,
        c2bReference,
      );

      // 5. Create the aggregate and record its creation event.
      const aggregate = FinancialPaymentAggregate.create(payment);
      aggregate.emitCreatedEvent(command.correlationId, command.causationId);

      // 6. Persist the aggregate.
      await this.repository.create(aggregate);

      // 7. Persist domain events through the transactional outbox.
      const domainEvents = aggregate.pullDomainEvents();

      if (domainEvents.length > 0) {
        await this.eventPublisher.publishAll(domainEvents);
      }

      return aggregate;
    });
  }

  /**
   * Generates a payment-specific PayBill reference.
   *
   * The client never supplies this value. Cryptographically secure random
   * selection is used instead of Math.random(). The repository lookup avoids
   * known collisions; the database unique constraint remains the final
   * concurrency-safe guarantee.
   */
  private async generateUniqueC2BReference(): Promise<FinancialC2BReference> {
    for (
      let attempt = 1;
      attempt <= C2B_REFERENCE_GENERATION_ATTEMPTS;
      attempt += 1
    ) {
      let suffix = '';

      for (let index = 0; index < C2B_REFERENCE_SUFFIX_LENGTH; index += 1) {
        suffix +=
          C2B_REFERENCE_ALPHABET[randomInt(0, C2B_REFERENCE_ALPHABET.length)];
      }

      const reference = FinancialC2BReference.create(
        `${C2B_REFERENCE_PREFIX}${suffix}`,
      );

      const alreadyExists =
        await this.repository.existsByC2BReference(reference);

      if (!alreadyExists) {
        return reference;
      }
    }

    throw new Error(
      'Unable to generate a unique C2B PayBill reference. Please retry the payment creation.',
    );
  }
}

export default CreateFinancialPaymentHandler;
