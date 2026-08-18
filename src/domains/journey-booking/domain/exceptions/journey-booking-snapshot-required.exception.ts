// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation requires a Journey Booking snapshot that has not
 * yet been created.
 */
export class JourneyBookingSnapshotRequiredException extends JourneyBookingException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey booking "${publicId}" requires a snapshot.`
        : 'Journey booking requires a snapshot.',
    );
  }
}
