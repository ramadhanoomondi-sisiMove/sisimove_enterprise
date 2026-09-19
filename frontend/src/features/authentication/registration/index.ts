// -----------------------------------------------------------------------------
// sisiMove — Registration Feature Public Exports
// -----------------------------------------------------------------------------
//
// Public entry point for the registration feature.
//
// Consumers should import registration functionality from this file rather
// than reaching into individual implementation directories.
//
// Registration
// ├── api
// │   └── registerUser
// ├── models
// │   ├── RegisterUserRequest
// │   └── RegisterUserResponse
// ├── schemas
// │   ├── registerUserSchema
// │   └── RegisterUserFormValues
// └── hooks
//     ├── useRegisterUser
//     ├── UseRegisterUserState
//     └── UseRegisterUserResult
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export {
  registerUser,
} from './api';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export type {
  RegisterUserRequest,
  RegisterUserResponse,
} from './models';

// -----------------------------------------------------------------------------
// Schemas
// -----------------------------------------------------------------------------

export {
  registerUserSchema,
} from './schemas';

export type {
  RegisterUserFormValues,
} from './schemas';

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

export {
  useRegisterUser,
} from './hooks';

export type {
  UseRegisterUserState,
  UseRegisterUserResult,
} from './hooks';

