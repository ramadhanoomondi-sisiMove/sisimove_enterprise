// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Components
// -----------------------------------------------------------------------------
//
// Public barrel export for journey vehicle presentation components.
//
// Vehicle components are responsible only for rendering and capturing
// presentation-level selections. API calls, ownership checks, and persistence
// remain outside the component layer.
// -----------------------------------------------------------------------------

export {
  JourneyVehicleForm,
  type JourneyVehicleFormProps,
  type JourneyVehicleFormValue,
  type JourneyVehicleOption,
} from './journey-vehicle-form';