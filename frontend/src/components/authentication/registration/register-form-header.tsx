// -----------------------------------------------------------------------------
// sisiMove — Registration Form Header
// -----------------------------------------------------------------------------
//
// Presentation component for the registration form.
//
// Responsibilities:
// - Introduce the registration experience.
// - Establish the sisiMove account-creation context.
//
// This component intentionally does NOT:
// - Own form state.
// - Perform validation.
// - Submit registration.
// - Call authentication APIs.
// - Manage navigation.
// - Know anything about verification, roles, or marketplace authorization.
//
// The parent registration form owns those concerns.
//
// -----------------------------------------------------------------------------

'use client';

export interface RegisterFormHeaderProps {
  readonly eyebrow?: string;
  readonly title?: string;
  readonly description?: string;
}

export function RegisterFormHeader({
  eyebrow = 'JOIN sisiMove',
  title = 'CREATE YOUR ACCOUNT',
  description = 'Create your sisiMove account to access the marketplace.',
}: RegisterFormHeaderProps) {
  return (
    <header className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
        {eyebrow}
      </p>

      <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {title}
      </h1>

      <p className="max-w-md text-sm leading-6 text-slate-600">
        {description}
      </p>
    </header>
  );
}

export default RegisterFormHeader;

