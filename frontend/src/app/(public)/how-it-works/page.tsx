// -----------------------------------------------------------------------------
// SisiMove — How It Works Route
// -----------------------------------------------------------------------------
//
// Public informational route explaining how SisiMove works.
//
// The route itself contains no marketplace logic. Presentation belongs to the
// existing How It Works section component.
//
// URL:
//   /how-it-works
//
// -----------------------------------------------------------------------------

import { HowItWorksSection } from '@/components/landing/how-it-works';

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function HowItWorksPage() {
  return (
    <div className="w-full min-w-0">
      <HowItWorksSection />
    </div>
  );
}
