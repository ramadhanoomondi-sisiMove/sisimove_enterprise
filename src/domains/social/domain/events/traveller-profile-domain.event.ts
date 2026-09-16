// src/domains/social/domain/events/traveller-profile-domain.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

/**
 * -----------------------------------------------------------------------------
 * sisiMove — Traveller Profile Domain Event
 * -----------------------------------------------------------------------------
 *
 * Base event for all Traveller Profile domain events.
 *
 * IMPORTANT:
 * This class must NOT freeze `this` in its constructor.
 *
 * JavaScript initializes subclass instance fields only after `super()` returns.
 * Concrete events such as TravellerProfileCreatedEvent may therefore still need
 * to define their own fields after this constructor has completed.
 *
 * Freezing the object here would make the object non-extensible before those
 * subclass fields are initialized and results in:
 *
 *     TypeError: Cannot define property <field>, object is not extensible
 *
 * Event immutability must therefore be applied only after the concrete event
 * has completed construction.
 */
export abstract class TravellerProfileDomainEvent extends DomainEvent {
  protected constructor(
    public readonly travellerProfileId: string,
    public readonly publicId: string,
    eventName: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      travellerProfileId,
      'TravellerProfile',
      eventName,
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    // DO NOT freeze here.
    //
    // Subclass instance fields are initialized after super() returns.
    // Freezing here prevents those fields from being defined.
  }

  protected getBasePayload(): Record<string, unknown> {
    return {
      travellerProfileId: this.travellerProfileId,
      publicId: this.publicId,
    };
  }
}
