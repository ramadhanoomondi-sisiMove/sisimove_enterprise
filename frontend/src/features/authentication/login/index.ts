// -----------------------------------------------------------------------------
// sisiMove — Authentication Login Feature Barrel
// -----------------------------------------------------------------------------
//
// Public entry point for the Authentication Login feature.
//
// The login feature exposes:
//
//     API
//     ├── authenticateLogin
//
//     Models
//     ├── AuthenticateLoginRequest
//     └── AuthenticateLoginResponse
//
//     Validation
//     ├── authenticateLoginSchema
//     └── AuthenticateLoginFormValues
//
//     Hooks
//     ├── useAuthenticateLogin
//     ├── UseAuthenticateLoginState
//     └── UseAuthenticateLoginResult
//
// Lower-level implementation details remain behind their respective feature
// boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export {
  authenticateLogin,
} from './api';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export type {
  AuthenticateLoginRequest,
  AuthenticateLoginResponse,
} from './models';

// -----------------------------------------------------------------------------
// Schemas
// -----------------------------------------------------------------------------

export {
  authenticateLoginSchema,
} from './schemas';

export type {
  AuthenticateLoginFormValues,
} from './schemas';

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

export {
  useAuthenticateLogin,
} from './hooks';

export type {
  UseAuthenticateLoginState,
  UseAuthenticateLoginResult,
} from './hooks';

