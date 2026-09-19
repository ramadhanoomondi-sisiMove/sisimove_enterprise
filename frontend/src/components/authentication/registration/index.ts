// -----------------------------------------------------------------------------
// sisiMove — Registration Components Barrel
// -----------------------------------------------------------------------------
//
// Public presentation boundary for the registration experience.
//
// This barrel exposes the complete registration composition:
//
//     RegisterPage
//         └── RegisterForm
//               ├── RegisterFormHeader
//               ├── RegisterFormFields
//               ├── RegisterPasswordFields
//               ├── RegisterTerms
//               ├── RegisterSubmit
//               ├── RegisterError
//               └── RegisterSuccess
//
// Authentication feature logic remains under:
//     features/authentication/registration
//
// This layer is responsible only for composing and presenting the registration
// experience.
//
// -----------------------------------------------------------------------------

export {
  RegisterPage,
} from './register-page';

export type {
  RegisterPageProps,
} from './register-page';

export {
  RegisterForm,
} from './register-form';

export type {
  RegisterFormProps,
} from './register-form';

export {
  RegisterFormHeader,
} from './register-form-header';

export type {
  RegisterFormHeaderProps,
} from './register-form-header';

export {
  RegisterFormFields,
} from './register-form-fields';

export type {
  RegisterFormFieldsProps,
} from './register-form-fields';

export {
  RegisterPasswordFields,
} from './register-password-fields';

export type {
  RegisterPasswordFieldsProps,
} from './register-password-fields';

export {
  RegisterTerms,
} from './register-terms';

export type {
  RegisterTermsProps,
} from './register-terms';

export {
  RegisterSubmit,
} from './register-submit';

export type {
  RegisterSubmitProps,
} from './register-submit';

export {
  RegisterSuccess,
} from './register-success';

export type {
  RegisterSuccessProps,
} from './register-success';

export {
  RegisterError,
} from './register-error';

export type {
  RegisterErrorProps,
} from './register-error';

