// src/infrastructure/events/events.module.ts

import { Global, Module } from '@nestjs/common';

import { AUTHORIZATION_EVENT_PUBLISHER } from '../../domains/identity/application/authorization.tokens';

import { EventBus } from './event-bus';
import { EventPublisher } from './event-publisher';
import { EventStore } from './event-store';

@Global()
@Module({
  providers: [
    EventBus,
    EventStore,

    // Concrete implementation
    EventPublisher,

    // Legacy application token
    {
      provide: 'EventPublisher',
      useExisting: EventPublisher,
    },

    // Authorization domain token
    {
      provide: AUTHORIZATION_EVENT_PUBLISHER,
      useExisting: EventPublisher,
    },
  ],

  exports: [
    EventBus,
    EventStore,

    EventPublisher,

    // Export both aliases
    'EventPublisher',
    AUTHORIZATION_EVENT_PUBLISHER,
  ],
})
export class EventsModule {}
