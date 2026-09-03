// src/infrastructure/events/events.module.ts

// -----------------------------------------------------------------------------
// Infrastructure — Events Module
// -----------------------------------------------------------------------------
//
// Registers and exposes the application's event infrastructure.
//
// Components:
//
// EventBus
// └── Dispatches domain events to subscribed handlers.
//
// EventStore
// └── Stores published domain events.
//
// EventPublisher
// └── Coordinates event persistence and event dispatch.
//
// EventPublisher flow:
//
//     EventPublisher
//          │
//          ├──► EventStore
//          │      └── append events
//          │
//          └──► EventBus
//                 └── publish events to handlers
//
// The event infrastructure is generic and is therefore intentionally
// independent from specific domains such as Identity or Authentication.
//
// No domain-specific event-publisher token is required here.
//
// -----------------------------------------------------------------------------

import { Global, Module } from '@nestjs/common';

import { EventBus } from './event-bus';
import { EventPublisher } from './event-publisher';
import { EventStore } from './event-store';

@Global()
@Module({
  providers: [EventBus, EventStore, EventPublisher],

  exports: [EventBus, EventStore, EventPublisher],
})
export class EventsModule {}
