// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Creation Components
// -----------------------------------------------------------------------------
//
// Public barrel for the Preferences step of Journey creation.
//
// Exposes:
// - JourneyPreferencesStep — shared step presentation boundary.
// - JourneyPreferencesForm — Preferences configuration form.
// -----------------------------------------------------------------------------

export {
  JourneyPreferencesStep,
  type JourneyPreferencesStepProps,
} from './journey-preferences-step';

export {
  JourneyPreferencesForm,
  type JourneyPreferencesFormProps,
  type JourneyPreferencesFormInitialValue,
  type JourneyPreferencesFormSubmitValue,
} from './journey-preferences-form';