// -----------------------------------------------------------------------------
// sisiMove — Journey Editor Sections
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - compose the existing Journey component editors;
// - provide each editor with its current Journey projection as initial state;
// - forward submit callbacks to the parent JourneyEditor;
// - provide consistent section presentation;
// - expose one shared submitting/disabled state.
//
// Non-responsibilities:
// - no Journey API calls;
// - no mutation handling;
// - no Journey aggregate reconstruction;
// - no lifecycle handling;
// - no authorization decisions;
// - no domain validation;
// - no duplicate editor implementations.
//
// The parent JourneyEditor owns persistence and translates presentation values
// into the exact Journey bounded-context commands.
//
// Existing editors remain presentation/workflow components:
//
//   JourneyCorridorEditor
//   JourneyScheduleEditor
//   JourneyVehicleEditor
//   JourneyCapacityEditor
//   JourneyPricingEditor
//   JourneyPreferencesEditor
//   JourneyAssetEditor
//
// -----------------------------------------------------------------------------

"use client";

import { Card, Divider } from "@/components/ui";
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

import {
  JourneyAssetEditor,
  type JourneyAssetFieldValues,
  type JourneyAssetPickerOption,
} from "../assets";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyEditorSectionsProps {
  /**
   * Initial corridor values supplied by the current Journey projection.
   */
  readonly corridorInitialValue: JourneyCorridorFormValues;

  /**
   * Persists the corridor after the presentation editor is submitted.
   */
  readonly onCorridorSubmit: (
    values: JourneyCorridorFormValues,
  ) => Promise<void>;

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

  /**
   * Initial vehicle values supplied by the current Journey projection.
   */
  readonly vehicleInitialValue: JourneyVehicleFieldValues;

  /**
   * Persists the vehicle after the presentation editor is submitted.
   */
  readonly onVehicleSubmit: (
    values: JourneyVehicleFieldValues,
  ) => Promise<void>;

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

  /**
   * Initial preference values supplied by the current Journey projection.
   *
   * The editor intentionally uses presentation booleans. Translation to the
   * Journey preference unions belongs to JourneyEditor.
   */
  readonly preferencesInitialValue: JourneyPreferencesFieldValues;

  /**
   * Persists the preferences after the presentation editor is submitted.
   */
  readonly onPreferencesSubmit: (
    values: JourneyPreferencesFieldValues,
  ) => Promise<void>;

  /**
   * Initial asset values supplied by the current Journey projection.
   */
  readonly assetInitialValue: JourneyAssetFieldValues;

  /**
   * Existing Asset references available for selection.
   *
   * Asset retrieval/upload/delete remains outside the Journey feature.
   */
  readonly assetOptions?: readonly JourneyAssetPickerOption[];

  /**
   * Persists the Journey asset association after submission.
   */
  readonly onAssetSubmit: (
    values: JourneyAssetFieldValues,
  ) => Promise<void>;

  /**
   * Called when an individual editor is cancelled.
   *
   * Cancellation only closes/resets the presentation editor. It does not
   * cancel the Journey itself.
   */
  readonly onCancel?: () => void;

  /**
   * Disables all editor interactions while a Journey mutation is running.
   */
  readonly submitting?: boolean;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Section
// -----------------------------------------------------------------------------

interface JourneyEditorSectionProps {
  readonly title: string;
  readonly description: string;
  readonly children: React.ReactNode;
}

function JourneyEditorSection({
  title,
  description,
  children,
}: JourneyEditorSectionProps) {
  return (
    <Card>
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          {title}
        </h2>

        <p className="text-sm text-[var(--foreground-muted)]">
          {description}
        </p>
      </div>

      <Divider className="my-4" />

      {children}
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyEditorSections({
  corridorInitialValue,
  onCorridorSubmit,
  scheduleInitialValue,
  onScheduleSubmit,
  vehicleInitialValue,
  onVehicleSubmit,
  capacityInitialValue,
  onCapacitySubmit,
  pricingInitialValue,
  onPricingSubmit,
  preferencesInitialValue,
  onPreferencesSubmit,
  assetInitialValue,
  assetOptions = [],
  onAssetSubmit,
  onCancel,
  submitting = false,
  className,
}: JourneyEditorSectionsProps) {
  return (
    <div
      className={cn(
        "space-y-6",
        className,
      )}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Where                                                              */}
      {/* ------------------------------------------------------------------ */}

      <JourneyEditorSection
        title="Where"
        description="Update the Journey origin and destination."
      >
        <JourneyCorridorEditor
          initialValue={corridorInitialValue}
          onSubmit={onCorridorSubmit}
          onCancel={onCancel}
          submitting={submitting}
          submitLabel="Save Where"
        />
      </JourneyEditorSection>

      {/* ------------------------------------------------------------------ */}
      {/* When                                                               */}
      {/* ------------------------------------------------------------------ */}

      <JourneyEditorSection
        title="When"
        description="Update the Journey departure and arrival details."
      >
        <JourneyScheduleEditor
          initialValue={scheduleInitialValue}
          onSubmit={onScheduleSubmit}
          onCancel={onCancel}
          submitting={submitting}
          submitLabel="Save When"
        />
      </JourneyEditorSection>

      {/* ------------------------------------------------------------------ */}
      {/* Vehicle                                                            */}
      {/* ------------------------------------------------------------------ */}

      <JourneyEditorSection
        title="Vehicle"
        description="Update the vehicle used for this Journey."
      >
        <JourneyVehicleEditor
          initialValue={vehicleInitialValue}
          onSubmit={onVehicleSubmit}
          onCancel={onCancel}
          submitting={submitting}
          submitLabel="Save Vehicle"
        />
      </JourneyEditorSection>

      {/* ------------------------------------------------------------------ */}
      {/* Seats                                                              */}
      {/* ------------------------------------------------------------------ */}

      <JourneyEditorSection
        title="Seats"
        description="Update the number of passenger seats available."
      >
        <JourneyCapacityEditor
          initialValue={capacityInitialValue}
          onSubmit={onCapacitySubmit}
          onCancel={onCancel}
          submitting={submitting}
          submitLabel="Save Seats"
        />
      </JourneyEditorSection>

      {/* ------------------------------------------------------------------ */}
      {/* Price                                                              */}
      {/* ------------------------------------------------------------------ */}

      <JourneyEditorSection
        title="Price"
        description="Update the cost-sharing amount for this Journey."
      >
        <JourneyPricingEditor
          initialValue={pricingInitialValue}
          onSubmit={onPricingSubmit}
          onCancel={onCancel}
          submitting={submitting}
          submitLabel="Save Price"
        />
      </JourneyEditorSection>

      {/* ------------------------------------------------------------------ */}
      {/* Preferences                                                        */}
      {/* ------------------------------------------------------------------ */}

      <JourneyEditorSection
        title="Preferences"
        description="Update the preferences passengers should know about."
      >
        <JourneyPreferencesEditor
          initialValue={preferencesInitialValue}
          onSubmit={onPreferencesSubmit}
          onCancel={onCancel}
          submitting={submitting}
          submitLabel="Save Preferences"
        />
      </JourneyEditorSection>

      {/* ------------------------------------------------------------------ */}
      {/* Assets                                                             */}
      {/* ------------------------------------------------------------------ */}

      <JourneyEditorSection
        title="Assets"
        description="Associate an existing SisiMove asset with this Journey."
      >
        <JourneyAssetEditor
          initialValue={assetInitialValue}
          options={assetOptions}
          onSubmit={onAssetSubmit}
          onCancel={onCancel}
          submitting={submitting}
          submitLabel="Save Asset"
        />
      </JourneyEditorSection>
    </div>
  );
}

