// -----------------------------------------------------------------------------
// sisiMove — Journey Creation
// Creation Navigation
// -----------------------------------------------------------------------------
//
// Navigation controls for the authenticated Journey creation workflow.
//
// Responsibilities:
// - Present Back / Continue navigation.
// - Present a final Review / Publish-oriented action when appropriate.
// - Respect disabled/loading states supplied by the creation workflow.
// - Keep route construction outside the component.
//
// Architectural boundaries:
// - Does NOT call router.push().
// - Does NOT create a Journey.
// - Does NOT publish a Journey.
// - Does NOT persist creation state.
// - Does NOT validate domain data.
// - Does NOT determine whether a step is complete.
//
// The parent creation shell owns workflow state, validation, navigation, and
// route construction.
//
// Route conventions are supplied by AUTHENTICATED_ROUTES:
//
//     AUTHENTICATED_ROUTES.JOURNEY_CREATE_ROUTE(id)
//     AUTHENTICATED_ROUTES.JOURNEY_CREATE_SCHEDULE(id)
//     AUTHENTICATED_ROUTES.JOURNEY_CREATE_VEHICLE(id)
//     AUTHENTICATED_ROUTES.JOURNEY_CREATE_SEATS(id)
//     AUTHENTICATED_ROUTES.JOURNEY_CREATE_PRICING(id)
//     AUTHENTICATED_ROUTES.JOURNEY_CREATE_PREFERENCES(id)
//     AUTHENTICATED_ROUTES.JOURNEY_CREATE_PHOTOS(id)
//     AUTHENTICATED_ROUTES.JOURNEY_CREATE_REVIEW(id)
//
// Design boundaries:
// - Mobile-first.
// - Compact.
// - Uses only frozen sisiMove design tokens.
// - No gradients.
// - No new colors.
// -----------------------------------------------------------------------------

import {
  Button,
} from '@/components/ui';


// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCreationNavigationProps {
  /**
   * Destination for the previous step.
   *
   * Null means the current step is the first step and therefore has no
   * previous destination.
   */
  previousHref?: string | null;

  /**
   * Destination for the next step.
   *
   * Null means the current step has no ordinary next destination.
   */
  nextHref?: string | null;

  /**
   * Called when the user chooses to go back.
   *
   * The parent owns the actual navigation operation.
   */
  onBack?: () => void;

  /**
   * Called when the user chooses to continue.
   *
   * The parent owns validation and the actual navigation operation.
   */
  onNext?: () => void;

  /**
   * Optional final-step action.
   *
   * The Review step can replace "Continue" with a publication/review action
   * supplied by the parent workflow.
   */
  finalAction?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Prevents the Back action while the workflow is busy.
   */
  backDisabled?: boolean;

  /**
   * Prevents the Continue action.
   *
   * Typically used when the current step has not satisfied its local
   * requirements.
   */
  nextDisabled?: boolean;

  /**
   * Indicates that the next operation is being performed.
   */
  nextLoading?: boolean;

  /**
   * Indicates that the final operation is being performed.
   */
  finalLoading?: boolean;

  /**
   * Optional additional classes.
   */
  className?: string;
}


// -----------------------------------------------------------------------------
// Journey Creation Navigation
// -----------------------------------------------------------------------------

export function JourneyCreationNavigation({
  previousHref,
  nextHref,
  onBack,
  onNext,
  finalAction,
  backDisabled = false,
  nextDisabled = false,
  nextLoading = false,
  finalLoading = false,
  className,
}: JourneyCreationNavigationProps) {
  const hasBack =
    Boolean(previousHref) ||
    Boolean(onBack);

  const hasNext =
    Boolean(nextHref) ||
    Boolean(onNext);

  const showFinalAction =
    Boolean(finalAction);

  return (
    <nav
      aria-label="Journey creation navigation"
      className={[
        'flex',
        'flex-col-reverse',
        'gap-3',
        'border-t',
        'border-[var(--border-subtle)]',
        'pt-4',
        'sm:flex-row',
        'sm:items-center',
        'sm:justify-between',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Back                                                                 */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex w-full sm:w-auto">
        {hasBack ? (
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={backDisabled}
            onClick={onBack}
          >
            Back
          </Button>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>


      {/* ------------------------------------------------------------------- */}
      {/* Forward actions                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex w-full items-center gap-2 sm:w-auto">
        {showFinalAction ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            loading={finalLoading}
            disabled={
              finalLoading ||
              nextDisabled
            }
            onClick={
              finalAction?.onClick
            }
            className="w-full sm:w-auto"
          >
            {finalAction?.label}
          </Button>
        ) : hasNext ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            loading={nextLoading}
            disabled={
              nextDisabled ||
              nextLoading
            }
            onClick={onNext}
            className="w-full sm:w-auto"
          >
            Continue
          </Button>
        ) : null}
      </div>
    </nav>
  );
}