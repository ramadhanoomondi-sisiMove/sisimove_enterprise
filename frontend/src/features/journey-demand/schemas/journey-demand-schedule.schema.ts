// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Schedule Schema
// -----------------------------------------------------------------------------
//
// Validation schema for the flexible JourneyDemand departure/arrival window.
//
// The backend expects DateTime values. The frontend form may use datetime-local
// controls, but the API adapter should convert them to ISO strings before
// transmission where necessary.
//
// -----------------------------------------------------------------------------

import { z } from 'zod';

const dateTimeSchema = z
  .string()
  .trim()
  .min(1, 'Date and time is required.')
  .refine(
    (value) => !Number.isNaN(Date.parse(value)),
    'Enter a valid date and time.',
  );

export const journeyDemandScheduleSchema = z
  .object({
    earliestDeparture: dateTimeSchema,

    latestDeparture: dateTimeSchema,

    targetArrival: dateTimeSchema
      .optional()
      .nullable()
      .or(z.literal('')),

    maximumArrival: dateTimeSchema
      .optional()
      .nullable()
      .or(z.literal('')),

    timezone: z
      .string()
      .trim()
      .min(1, 'Timezone is required.')
      .default('Africa/Nairobi'),
  })
  .superRefine((value, context) => {
    const earliestDeparture = Date.parse(value.earliestDeparture);
    const latestDeparture = Date.parse(value.latestDeparture);

    if (latestDeparture < earliestDeparture) {
      context.addIssue({
        code: 'custom',
        path: ['latestDeparture'],
        message: 'Latest departure cannot be before earliest departure.',
      });
    }

    if (value.targetArrival) {
      const targetArrival = Date.parse(value.targetArrival);

      if (targetArrival < earliestDeparture) {
        context.addIssue({
          code: 'custom',
          path: ['targetArrival'],
          message: 'Target arrival cannot be before earliest departure.',
        });
      }
    }

    if (value.maximumArrival) {
      const maximumArrival = Date.parse(value.maximumArrival);

      if (maximumArrival < earliestDeparture) {
        context.addIssue({
          code: 'custom',
          path: ['maximumArrival'],
          message: 'Maximum arrival cannot be before earliest departure.',
        });
      }

      if (
        value.targetArrival &&
        maximumArrival < Date.parse(value.targetArrival)
      ) {
        context.addIssue({
          code: 'custom',
          path: ['maximumArrival'],
          message: 'Maximum arrival cannot be before target arrival.',
        });
      }
    }
  });

export type JourneyDemandScheduleInput = z.infer<
  typeof journeyDemandScheduleSchema
>;