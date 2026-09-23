// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Components
// -----------------------------------------------------------------------------
//
// Public barrel export for journey preference presentation components.
//
// Preference components are responsible only for rendering and capturing
// presentation-level selections. API calls, validation, persistence, and
// backend business rules remain outside the component layer.
// -----------------------------------------------------------------------------

export {
  JourneyPreferencesForm,
  type JourneyPreferencesFormProps,
  type JourneyPreferencesFormValue,
   type JourneySmokingPolicy,
  type JourneyPetsPolicy,
  type JourneyLuggagePolicy,
  type JourneyConversationPreference,
  type JourneyMusicPreference,
} from './journey-preferences-form';