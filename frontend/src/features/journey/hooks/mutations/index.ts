// -----------------------------------------------------------------------------
// sisiMove — Journey Mutation Hooks
// -----------------------------------------------------------------------------
//
// Barrel exports for all Journey mutation hooks.
//
// Mutation hooks are intentionally thin:
// - they expose the UI-facing mutation operation;
// - they delegate to the exact Journey HTTP command;
// - they do not recreate Journey domain logic;
// - they do not locally mutate Journey state;
// - successful mutations should be followed by refetching the relevant Journey
//   projection at the consuming component/query boundary.
//
// The individual hooks remain responsible for their own loading/error state.
// -----------------------------------------------------------------------------

// Lifecycle mutations.
export * from "./use-create-journey";
export * from "./use-publish-journey";
export * from "./use-start-journey";
export * from "./use-complete-journey";
export * from "./use-cancel-journey";
export * from "./use-expire-journey";

// Corridor mutations.
export * from "./use-attach-journey-corridor";
export * from "./use-remove-journey-corridor";

// Waypoint mutations.
export * from "./use-add-journey-waypoint";
export * from "./use-remove-journey-waypoint";

// Schedule mutations.
export * from "./use-attach-journey-schedule";
export * from "./use-remove-journey-schedule";

// Vehicle mutations.
export * from "./use-attach-journey-vehicle";
export * from "./use-remove-journey-vehicle";

// Capacity mutations.
export * from "./use-attach-journey-capacity";
export * from "./use-remove-journey-capacity";

// Pricing mutations.
export * from "./use-attach-journey-pricing";
export * from "./use-remove-journey-pricing";

// Preferences mutations.
export * from "./use-attach-journey-preferences";
export * from "./use-remove-journey-preferences";

// Journey asset mutations.
export * from "./use-attach-journey-asset";
export * from "./use-remove-journey-asset";