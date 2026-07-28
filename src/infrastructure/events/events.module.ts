// src/infrastructure/events/events.module.ts

import { Global, Module } from '@nestjs/common';

import { EventBus } from './event-bus';
import { EventPublisher } from './event-publisher';
import { EventStore } from './event-store';

@Global()
@Module({
  providers: [
    EventBus,
    EventStore,
    {
      provide: 'EventPublisher',
      useClass: EventPublisher,
    },
  ],
  exports: ['EventPublisher', EventBus, EventStore],
})
export class EventsModule {}
