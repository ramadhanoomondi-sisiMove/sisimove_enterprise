// -----------------------------------------------------------------------------
// sisiMove — Journey Schedule Schema
// -----------------------------------------------------------------------------

import { z } from 'zod';

// -----------------------------------------------------------------------------
// ISO date/time validation
// -----------------------------------------------------------------------------

const isoDateTimeSchema = z
  .string()
  .datetime({
    offset: true,
    message: 'A valid date and time is required',
  });

// -----------------------------------------------------------------------------
// Schedule
// -----------------------------------------------------------------------------

export const journeyScheduleSchema = z
  .object({
    departureAt: isoDateTimeSchema,

    arrivalAt: isoDateTimeSchema
      .nullable()
      .optional(),

    timezone: z
      .string()
      .trim()
      .min(1, 'Timezone is required')
      .default('Africa/Nairobi'),
  })
  .refine(
    (value) => {
      if (!value.arrivalAt) {
        return true;
      }

      return (
        new Date(value.arrivalAt).getTime() >
        new Date(value.departureAt).getTime()
      );
    },
    {
      path: ['arrivalAt'],
      message: 'Arrival time must be after departure time',
    },
  );

export type JourneyScheduleInput = z.infer<
  typeof journeyScheduleSchema
>;