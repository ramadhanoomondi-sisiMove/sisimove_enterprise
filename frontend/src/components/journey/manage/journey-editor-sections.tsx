// -----------------------------------------------------------------------------
// sisiMove — Journey Editor Sections
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - compose the existing Journey component editors;
// - provide each editor with its current Journey projection as initial state;
// - own no Journey location state;
// - forward controlled location state to JourneyCorridorEditor;
// - forward submit callbacks to the parent JourneyEditor;
// - provide a compact, mobile-first SisiMove presentation;
// - expose one shared submitting/disabled state;
// - pass the resolved vehicle Asset to the vehicle editor;
// - allow the parent JourneyEditor to initiate vehicle-photo replacement;
// - present published Journey components as read-only.
//
// Non-responsibilities:
// - no Journey API calls;
// - no mutation handling;
// - no Journey aggregate reconstruction;
// - no lifecycle decisions;
// - no authorization decisions;
// - no domain validation;
// - no location state ownership;
// - no corridor resolution;
// - no corridor catalogue duplication;
// - no Asset upload or URL resolution;
// - no duplicate editor implementations.
//
// Location architecture:
//
//   JourneyEditor
//        │
//        ├── owns origin/destination state
//        ├── owns queries
//        ├── owns suggestions
//        └── owns supported-corridor resolution
//                 │
//                 ▼
//        JourneyEditorSections
//                 │
//                 ▼
//        JourneyCorridorEditor
//                 │
//                 ▼
//        LocationSelector
//
// JourneyEditorSections is therefore only a composition boundary.
//
// Physical-world location model:
//
//   Corridor
//      ├── From → ResolvedLocation
//      └── To   → ResolvedLocation
//
// This component does not expose or present latitude/longitude as separate
// Journey fields. Geographic details remain encapsulated by ResolvedLocation
// and are handled by the owning application/domain boundary.
//
// Lifecycle presentation:
//
//   DRAFT
//      ↓
//   editable Journey component editors
//
//   PUBLISHED
//      ↓
//   read-only Journey component presentation
//
// The parent JourneyEditor determines the lifecycle state and passes
// `readOnly` to this component.
//
// Vehicle photos remain part of the Vehicle presentation. There is no
// standalone Journey Assets section.
//
// Location directionality is intentionally not handled here. The parent
// JourneyEditor owns the controlled location state and the supported-corridor
// resolver owns canonical/reverse direction resolution.
//
// -----------------------------------------------------------------------------

"use client";

import type { ReactNode } from "react";

import { Card, Divider } from "@/components/ui";

import type { ResolvedLocation } from "@/foundation/location";

import { cn } from "@/foundation/utils/cn";

import {
  JourneyCorridorEditor,
  type JourneyCorridorFormValues,
} from "../corridor/journey-corridor-editor";

import {
  JourneyScheduleEditor,
  type JourneyScheduleFieldValues,
} from "../schedule";

import {
  JourneyVehicleEditor,
  type JourneyVehicleAssetOption,
  type JourneyVehicleFieldValues,
} from "../vehicle";

import {
  JourneyCapacityEditor,
  type JourneyCapacityFieldValues,
} from "../capacity";

import {
  JourneyPricingEditor,
  type JourneyPriceFieldValues,
} from "../pricing";

import {
  JourneyPreferencesEditor,
  type JourneyPreferencesFieldValues,
} from "../preferences";

// =============================================================================
// Props
// =============================================================================

export interface JourneyEditorSectionsProps {
  // ---------------------------------------------------------------------------
  // Corridor / Where
  // ---------------------------------------------------------------------------

  /**
   * Currently selected Journey origin.
   *
   * Location state is owned by JourneyEditor.
   */
  readonly origin: ResolvedLocation | null;

  /**
   * Currently selected Journey destination.
   *
   * Location state is owned by JourneyEditor.
   */
  readonly destination: ResolvedLocation | null;

  /**
   * Current controlled origin search/query value.
   */
  readonly originQuery: string;

  /**
   * Current controlled destination search/query value.
   */
  readonly destinationQuery: string;

  /**
   * Supported origin suggestions resolved by JourneyEditor.
   */
  readonly originSuggestions: readonly ResolvedLocation[];

  /**
   * Supported destination suggestions resolved by JourneyEditor.
   *
   * These are derived from the selected origin and therefore already respect
   * the supported-corridor directionality rules.
   */
  readonly destinationSuggestions: readonly ResolvedLocation[];

  /**
   * Optional presentation-level origin error.
   */
  readonly originError?: string | null;

  /**
   * Optional presentation-level destination error.
   */
  readonly destinationError?: string | null;

  /**
   * Handles changes to the controlled origin query.
   */
  readonly onOriginQueryChange: (query: string) => void;

  /**
   * Handles selection of a supported origin.
   */
  readonly onOriginSelect: (location: ResolvedLocation) => void;

  /**
   * Handles changes to the controlled destination query.
   */
  readonly onDestinationQueryChange: (query: string) => void;

  /**
   * Handles selection of a supported destination.
   */
  readonly onDestinationSelect: (location: ResolvedLocation) => void;

  /**
   * Current Journey corridor projection represented using physical locations.
   *
   * Geographic details remain encapsulated by ResolvedLocation.
   */
  readonly corridorInitialValue: JourneyCorridorFormValues;

  /**
   * Persists the corridor after the presentation editor is submitted.
   *
   * Corridor resolution and persistence remain owned by JourneyEditor.
   */
  readonly onCorridorSubmit: (
    values: JourneyCorridorFormValues,
  ) => Promise<void>;

  // ---------------------------------------------------------------------------
  // Schedule
  // ---------------------------------------------------------------------------

  /**
   * Initial schedule values supplied by the current Journey projection.
   */
  readonly scheduleInitialValue: JourneyScheduleFieldValues;

  /**
   * Persists the schedule after the presentation editor is submitted.
   */
  readonly onScheduleSubmit: (
    values: JourneyScheduleFieldValues,
  ) => Promise<void>;

  // ---------------------------------------------------------------------------
  // Vehicle
  // ---------------------------------------------------------------------------

  /**
   * Initial vehicle values supplied by the current Journey projection.
   */
  readonly vehicleInitialValue: JourneyVehicleFieldValues;

  /**
   * Currently resolved vehicle Asset.
   *
   * The parent JourneyEditor obtains this from the Asset presentation
   * boundary. This component does not resolve URLs or query Assets.
   */
  readonly vehicleSelectedAsset?: JourneyVehicleAssetOption | null;

  /**
   * Persists the vehicle after the presentation editor is submitted.
   */
  readonly onVehicleSubmit: (
    values: JourneyVehicleFieldValues,
  ) => Promise<void>;

  /**
   * Requests the parent JourneyEditor to open the vehicle Asset upload or
   * replacement workflow.
   */
  readonly onChangeVehicleAsset?: () => void;

  // ---------------------------------------------------------------------------
  // Capacity
  // ---------------------------------------------------------------------------

  /**
   * Initial capacity values supplied by the current Journey projection.
   */
  readonly capacityInitialValue: JourneyCapacityFieldValues;

  /**
   * Persists the capacity after the presentation editor is submitted.
   */
  readonly onCapacitySubmit: (
    values: JourneyCapacityFieldValues,
  ) => Promise<void>;

  // ---------------------------------------------------------------------------
  // Pricing
  // ---------------------------------------------------------------------------

  /**
   * Initial pricing values supplied by the current Journey projection.
   */
  readonly pricingInitialValue: JourneyPriceFieldValues;

  /**
   * Persists the pricing after the presentation editor is submitted.
   */
  readonly onPricingSubmit: (
    values: JourneyPriceFieldValues,
  ) => Promise<void>;

  // ---------------------------------------------------------------------------
  // Preferences
  // ---------------------------------------------------------------------------

  /**
   * Initial preference values supplied by the current Journey projection.
   */
  readonly preferencesInitialValue: JourneyPreferencesFieldValues;

  /**
   * Persists the preferences after the presentation editor is submitted.
   */
  readonly onPreferencesSubmit: (
    values: JourneyPreferencesFieldValues,
  ) => Promise<void>;

  // ---------------------------------------------------------------------------
  // Shared presentation state
  // ---------------------------------------------------------------------------

  /**
   * Called when an individual editor is cancelled.
   */
  readonly onCancel?: () => void;

  /**
   * Disables all editor interactions while a Journey mutation is running.
   */
  readonly submitting?: boolean;

  /**
   * Published Journeys are immutable through this editing surface.
   *
   * When true, component editors are replaced with read-only presentation.
   */
  readonly readOnly?: boolean;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// =============================================================================
// Section
// =============================================================================

interface JourneyEditorSectionProps {
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
}

function JourneyEditorSection({
  title,
  description,
  children,
}: JourneyEditorSectionProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        "shadow-[var(--shadow-sm)]",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className="mt-1 h-8 w-1 shrink-0 rounded-full bg-[var(--brand)]"
        />

        <div className="min-w-0 flex-1 space-y-0.5">
          <h2 className="text-base font-semibold leading-6 text-[var(--foreground)] sm:text-[1.05rem]">
            {title}
          </h2>

          <p className="text-sm leading-5 text-[var(--foreground-muted)]">
            {description}
          </p>
        </div>
      </div>

      <Divider className="my-3 sm:my-4" />

      <div className="min-w-0">{children}</div>
    </Card>
  );
}

// =============================================================================
// Read-only primitives
// =============================================================================

interface ReadOnlyFieldProps {
  readonly label: string;
  readonly value: ReactNode;
}

function ReadOnlyField({
  label,
  value,
}: ReadOnlyFieldProps) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
        {label}
      </p>

      <div className="text-sm leading-6 text-[var(--foreground)]">
        {value || "—"}
      </div>
    </div>
  );
}

interface ReadOnlyGridProps {
  readonly children: ReactNode;
}

function ReadOnlyGrid({
  children,
}: ReadOnlyGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {children}
    </div>
  );
}

function ReadOnlyNotice() {
  return (
    <div
      className={cn(
        "mb-4",
        "rounded-[var(--radius-lg)]",
        "border border-[var(--border)]",
        "bg-[var(--background-brand)]",
        "px-3 py-2.5",
        "text-sm",
        "text-[var(--foreground-muted)]",
      )}
    >
      This Journey is published. Its details can no longer be edited.
    </div>
  );
}

// =============================================================================
// Read-only sections
// =============================================================================

function ReadOnlyCorridor({
  value,
}: {
  readonly value: JourneyCorridorFormValues;
}) {
  return (
    <>
      <ReadOnlyNotice />

      <ReadOnlyGrid>
        <ReadOnlyField
          label="From"
          value={value.origin.name}
        />

        <ReadOnlyField
          label="To"
          value={value.destination.name}
        />
      </ReadOnlyGrid>
    </>
  );
}

function ReadOnlySchedule({
  value,
}: {
  readonly value: JourneyScheduleFieldValues;
}) {
  return (
    <>
      <ReadOnlyNotice />

      <ReadOnlyGrid>
        <ReadOnlyField
          label="Departure"
          value={value.departureAt || "—"}
        />

        <ReadOnlyField
          label="Arrival"
          value={value.arrivalAt || "—"}
        />

        <ReadOnlyField
          label="Timezone"
          value={value.timezone}
        />
      </ReadOnlyGrid>
    </>
  );
}

function ReadOnlyVehicle({
  value,
  selectedAsset,
}: {
  readonly value: JourneyVehicleFieldValues;
  readonly selectedAsset: JourneyVehicleAssetOption | null;
}) {
  return (
    <>
      <ReadOnlyNotice />

      {selectedAsset !== null && (
        <div className="mb-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background-brand)]">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedAsset.url}
              alt="Vehicle photo"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="px-3 py-2 text-xs text-[var(--foreground-muted)]">
            Vehicle photo
          </div>
        </div>
      )}

      <ReadOnlyGrid>
        <ReadOnlyField
          label="Make"
          value={value.make}
        />

        <ReadOnlyField
          label="Model"
          value={value.model}
        />

        <ReadOnlyField
          label="Year"
          value={value.year}
        />

        <ReadOnlyField
          label="Color"
          value={value.color}
        />

        <ReadOnlyField
          label="Registration"
          value={value.registration}
        />
      </ReadOnlyGrid>
    </>
  );
}

function ReadOnlyCapacity({
  value,
}: {
  readonly value: JourneyCapacityFieldValues;
}) {
  return (
    <>
      <ReadOnlyNotice />

      <ReadOnlyField
        label="Passenger seats"
        value={value.totalSeats}
      />
    </>
  );
}

function ReadOnlyPricing({
  value,
}: {
  readonly value: JourneyPriceFieldValues;
}) {
  return (
    <>
      <ReadOnlyNotice />

      <ReadOnlyGrid>
        <ReadOnlyField
          label="Price"
          value={value.amount}
        />

        <ReadOnlyField
          label="Currency"
          value={value.currency}
        />
      </ReadOnlyGrid>
    </>
  );
}

function ReadOnlyPreferences({
  value,
}: {
  readonly value: JourneyPreferencesFieldValues;
}) {
  return (
    <>
      <ReadOnlyNotice />

      <ReadOnlyGrid>
        <ReadOnlyField
          label="Smoking"
          value={value.smoking}
        />

        <ReadOnlyField
          label="Pets"
          value={value.pets}
        />

        <ReadOnlyField
          label="Luggage"
          value={value.luggage}
        />

        <ReadOnlyField
          label="Conversation"
          value={value.conversation}
        />

        <ReadOnlyField
          label="Music"
          value={value.music}
        />
      </ReadOnlyGrid>
    </>
  );
}

// =============================================================================
// Component
// =============================================================================

export function JourneyEditorSections({
  origin,
  destination,
  originQuery,
  destinationQuery,
  originSuggestions,
  destinationSuggestions,
  originError = null,
  destinationError = null,
  onOriginQueryChange,
  onDestinationQueryChange,
  onOriginSelect,
  onDestinationSelect,
  corridorInitialValue,
  onCorridorSubmit,
  scheduleInitialValue,
  onScheduleSubmit,
  vehicleInitialValue,
  vehicleSelectedAsset = null,
  onVehicleSubmit,
  onChangeVehicleAsset,
  capacityInitialValue,
  onCapacitySubmit,
  pricingInitialValue,
  onPricingSubmit,
  preferencesInitialValue,
  onPreferencesSubmit,
  onCancel,
  submitting = false,
  readOnly = false,
  className,
}: JourneyEditorSectionsProps) {
  return (
    <div
      className={cn(
        "w-full",
        "space-y-4",
        "sm:space-y-5",
        "lg:space-y-6",
        className,
      )}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Where                                                              */}
      {/* ------------------------------------------------------------------ */}

      <JourneyEditorSection
        title="Where"
        description="Your Journey route."
      >
        {readOnly ? (
          <ReadOnlyCorridor
            value={corridorInitialValue}
          />
        ) : (
          <JourneyCorridorEditor
            origin={origin}
            destination={destination}
            originQuery={originQuery}
            destinationQuery={destinationQuery}
            originSuggestions={originSuggestions}
            destinationSuggestions={destinationSuggestions}
            originError={originError}
            destinationError={destinationError}
            disabled={submitting}
            onSubmit={onCorridorSubmit}
            onCancel={onCancel}
            submitting={submitting}
            submitLabel="Save Where"
            onOriginQueryChange={onOriginQueryChange}
            onDestinationQueryChange={onDestinationQueryChange}
            onOriginSelect={onOriginSelect}
            onDestinationSelect={onDestinationSelect}
          />
        )}
      </JourneyEditorSection>

      {/* ------------------------------------------------------------------ */}
      {/* When                                                               */}
      {/* ------------------------------------------------------------------ */}

      <JourneyEditorSection
        title="When"
        description="Your departure and arrival."
      >
        {readOnly ? (
          <ReadOnlySchedule
            value={scheduleInitialValue}
          />
        ) : (
          <JourneyScheduleEditor
            initialValue={scheduleInitialValue}
            onSubmit={onScheduleSubmit}
            onCancel={onCancel}
            submitting={submitting}
            submitLabel="Save When"
          />
        )}
      </JourneyEditorSection>

      {/* ------------------------------------------------------------------ */}
      {/* Vehicle                                                            */}
      {/* ------------------------------------------------------------------ */}

      <JourneyEditorSection
        title="Vehicle"
        description="The vehicle your passengers will ride in."
      >
        {readOnly ? (
          <ReadOnlyVehicle
            value={vehicleInitialValue}
            selectedAsset={vehicleSelectedAsset}
          />
        ) : (
          <JourneyVehicleEditor
            initialValue={vehicleInitialValue}
            selectedAsset={vehicleSelectedAsset}
            onSubmit={onVehicleSubmit}
            onChangeAsset={onChangeVehicleAsset}
            onCancel={onCancel}
            submitting={submitting}
            submitLabel="Save Vehicle"
          />
        )}
      </JourneyEditorSection>

      {/* ------------------------------------------------------------------ */}
      {/* Seats                                                              */}
      {/* ------------------------------------------------------------------ */}

      <JourneyEditorSection
        title="Seats"
        description="Passenger seats available."
      >
        {readOnly ? (
          <ReadOnlyCapacity
            value={capacityInitialValue}
          />
        ) : (
          <JourneyCapacityEditor
            initialValue={capacityInitialValue}
            onSubmit={onCapacitySubmit}
            onCancel={onCancel}
            submitting={submitting}
            submitLabel="Save Seats"
          />
        )}
      </JourneyEditorSection>

      {/* ------------------------------------------------------------------ */}
      {/* Price                                                              */}
      {/* ------------------------------------------------------------------ */}

      <JourneyEditorSection
        title="Price"
        description="Your cost-sharing amount."
      >
        {readOnly ? (
          <ReadOnlyPricing
            value={pricingInitialValue}
          />
        ) : (
          <JourneyPricingEditor
            initialValue={pricingInitialValue}
            onSubmit={onPricingSubmit}
            onCancel={onCancel}
            submitting={submitting}
            submitLabel="Save Price"
          />
        )}
      </JourneyEditorSection>

      {/* ------------------------------------------------------------------ */}
      {/* Preferences                                                        */}
      {/* ------------------------------------------------------------------ */}

      <JourneyEditorSection
        title="Preferences"
        description="What passengers should know before joining."
      >
        {readOnly ? (
          <ReadOnlyPreferences
            value={preferencesInitialValue}
          />
        ) : (
          <JourneyPreferencesEditor
            initialValue={preferencesInitialValue}
            onSubmit={onPreferencesSubmit}
            onCancel={onCancel}
            submitting={submitting}
            submitLabel="Save Preferences"
          />
        )}
      </JourneyEditorSection>
    </div>
  );
}
