// src/domains/journey/application/query-handlers/journey/search-published-journeys.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { SearchPublishedJourneysQuery } from '../../queries/journey/search-published-journeys.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyEntity } from '../../../domain/entities/journey.entity';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const KENYA_TIMEZONE_OFFSET = '+03:00';

const JOURNEY_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

@Injectable()
export class SearchPublishedJourneysQueryHandler implements QueryHandler<
  SearchPublishedJourneysQuery,
  JourneyEntity[]
> {
  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  public async execute(
    query: SearchPublishedJourneysQuery,
  ): Promise<JourneyEntity[]> {
    const origin = query.origin.trim();
    const destination = query.destination.trim();
    const date = query.date.trim();

    // -------------------------------------------------------------------------
    // Validate locations
    // -------------------------------------------------------------------------

    if (!origin) {
      throw new Error('Journey origin is required.');
    }

    if (!destination) {
      throw new Error('Journey destination is required.');
    }

    if (origin.toLowerCase() === destination.toLowerCase()) {
      throw new Error('Journey origin and destination must be different.');
    }

    // -------------------------------------------------------------------------
    // Validate date
    // -------------------------------------------------------------------------

    if (!date) {
      throw new Error('Journey date is required.');
    }

    if (!JOURNEY_DATE_PATTERN.test(date)) {
      throw new Error('Journey date must use the YYYY-MM-DD format.');
    }

    // -------------------------------------------------------------------------
    // Parse calendar date
    // -------------------------------------------------------------------------

    const dateParts = date.split('-');
    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]);
    const day = Number(dateParts[2]);

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(day) ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      throw new Error('Journey date is invalid.');
    }

    /**
     * Validate the calendar date independently of the timezone.
     *
     * The search date represents a Kenya-local calendar date, not a UTC date.
     * Therefore we must not compare getUTCDate() against the requested day
     * after constructing an Africa/Nairobi midnight instant.
     */
    const calendarDate = new Date(Date.UTC(year, month - 1, day));

    if (
      calendarDate.getUTCFullYear() !== year ||
      calendarDate.getUTCMonth() !== month - 1 ||
      calendarDate.getUTCDate() !== day
    ) {
      throw new Error('Journey date is invalid.');
    }

    /**
     * Build the actual Kenya-local search window.
     *
     * 2026-09-18 00:00 Africa/Nairobi
     *        =
     * 2026-09-17 21:00 UTC
     *
     * The repository therefore receives the correct absolute-time range while
     * the API continues to reason in terms of the user's Kenya calendar date.
     */
    const departureFrom = new Date(`${date}T00:00:00${KENYA_TIMEZONE_OFFSET}`);

    const departureTo = new Date(`${date}T00:00:00${KENYA_TIMEZONE_OFFSET}`);

    departureTo.setUTCDate(departureTo.getUTCDate() + 1);

    return this.repository.findPublishedJourneysByRouteAndDate(
      origin,
      destination,
      departureFrom,
      departureTo,
    );
  }
}
