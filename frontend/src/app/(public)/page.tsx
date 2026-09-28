// -----------------------------------------------------------------------------
// sisiMove — Public Landing Route
// -----------------------------------------------------------------------------
//
// The route entry point delegates the landing-page composition to LandingPage.
//
// The public route layout owns the public shell:
//
// - SiteHeader;
// - <main>;
// - SiteFooter.
//
// This route therefore contains no marketplace logic.
//
// -----------------------------------------------------------------------------

import { LandingPage } from "@/components/landing/landing-page";

export default function Page() {
  return <LandingPage />;
}