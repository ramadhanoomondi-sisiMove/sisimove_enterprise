// -----------------------------------------------------------------------------
// sisiMove — Login Form Header
// -----------------------------------------------------------------------------
//
// Presentation-only header for the authentication login form.
//
// Responsibilities:
// - Present the login eyebrow, title, and supporting description.
// - Render the sisiMove brand with its canonical colour treatment.
// - Allow the parent form to override copy when needed.
//
// Non-responsibilities:
// - No authentication logic.
// - No validation.
// - No API calls.
// - No routing.
// - No session management.
//
// The component deliberately owns no authentication state.
// -----------------------------------------------------------------------------

'use client';

export interface LoginFormHeaderProps {
  readonly eyebrow?: string;
  readonly title?: string;
  readonly description?: string;
}

export function LoginFormHeader({
  eyebrow = 'WELCOME BACK',
  title = 'SIGN IN TO sisiMove',
  description = 'Sign in to access your account and continue exploring the marketplace.',
}: LoginFormHeaderProps) {
  const defaultTitle = title === 'SIGN IN TO sisiMove';

  return (
    <header className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
        {eyebrow}
      </p>

      <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {defaultTitle ? (
          <>
            SIGN IN TO{' '}
            <span className="text-slate-950">sisi</span>
            <span className="text-blue-600">Move</span>
          </>
        ) : (
          title
        )}
      </h1>

      <p className="max-w-md text-sm leading-6 text-slate-600">
        {description}
      </p>
    </header>
  );
}

export default LoginFormHeader;
