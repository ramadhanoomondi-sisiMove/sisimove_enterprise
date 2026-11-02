import { Global, Module } from '@nestjs/common';

import { EventBus } from './event-bus';
import { EventPublisher } from './event-publisher';
import { EventStore } from './event-store';
import { EventRehydratorRegistry } from './event-rehydrator.registry';
import { PrismaIdempotencyStore } from './prisma-idempotency.store';

import { OutboxMessageClaimer } from '../workers/outbox/outbox-message-claimer';
import { OutboxDispatcher } from '../workers/outbox/outbox-dispatcher';
import { OutboxWorker } from '../workers/outbox/outbox.worker';

@Global()
@Module({
  providers: [
    EventBus,
    EventPublisher,
    EventRehydratorRegistry,
    EventStore,
    PrismaIdempotencyStore,
    OutboxMessageClaimer,
    OutboxDispatcher,
    OutboxWorker,
    {
      provide: 'IdempotencyStore',
      useExisting: PrismaIdempotencyStore,
    },
  ],
  exports: [
    EventBus,
    EventPublisher,
    EventRehydratorRegistry,
    EventStore,
    PrismaIdempotencyStore,
    OutboxDispatcher,
    'IdempotencyStore',
  ],
})
export class EventsModule {}

export { EventBus } from './event-bus';
export { EventPublisher } from './event-publisher';
export { EventStore } from './event-store';
export { EventRehydratorRegistry } from './event-rehydrator.registry';
export { PrismaIdempotencyStore } from './prisma-idempotency.store';
export { OutboxDispatcher } from '../workers/outbox/outbox-dispatcher';

export type { IdempotencyStore } from '../../foundation/events/idempotency.interface';
