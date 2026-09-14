// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Empty State
// -----------------------------------------------------------------------------
//
// Empty-state presentation for the public marketplace.
//
// An empty marketplace result does not necessarily mean that sisiMove has no
// journeys or demands. It may mean that the visitor's current refinements do
// not match any publicly visible items.
//
// Examples:
//
// - a selected origin has no matching journeys;
// - a selected destination has no matching demands;
// - a date has no matching published items;
// - the selected marketplace stream has no available results;
// - secondary filters are too restrictive.
//
// The message should therefore explain the current state without making
// unsupported claims about the underlying domains.
//
// This component is intentionally presentation-only.
//
// It does NOT:
// - fetch marketplace data;
// - inspect Journey state;
// - inspect Journey Demand state;
// - modify filters;
// - create a Demand;
// - publish a Journey;
// - determine whether a visitor is authenticated;
// - contain marketplace business rules.
//
// The parent decides when this component should be rendered.
//
// -----------------------------------------------------------------------------


export interface MarketplaceEmptyStateProps {
  /**
   * Optional heading shown to the visitor.
   *
   * A default heading is provided for the normal empty-result case.
   */
  title?: string;

  /**
   * Optional explanatory message.
   *
   * A default message explains that the current marketplace view contains
   * no matching public items.
   */
  description?: string;

  /**
   * Optional action supplied by the parent.
   *
   * The empty state does not create or navigate to an action by itself.
   * The parent may provide a control for clearing filters, creating demand,
   * or another appropriate marketplace action.
   */
  action?: React.ReactNode;

  /**
   * Optional additional classes applied to the empty-state container.
   */
  className?: string;
}


// -----------------------------------------------------------------------------
// Marketplace Empty State
// -----------------------------------------------------------------------------


export function MarketplaceEmptyState({
  title = "Nothing matches this view yet",
  description = "Try adjusting your search or filters, or browse another marketplace stream.",
  action,
  className,
}: MarketplaceEmptyStateProps) {
  return (
    <section
      aria-live="polite"
      className={[
        "flex min-w-0 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] px-6 py-12 text-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex max-w-lg flex-col items-center gap-3">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          {title}
        </h3>

        <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
          {description}
        </p>

        {action ? (
          <div className="pt-2">
            {action}
          </div>
        ) : null}
      </div>
    </section>
  );
}

