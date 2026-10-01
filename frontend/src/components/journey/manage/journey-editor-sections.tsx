// -----------------------------------------------------------------------------
// sisiMove — Journey Editor Sections
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - compose the existing Journey component editors;
// - provide each editor with its current Journey projection as initial state;
// - forward submit callbacks to the parent JourneyEditor;
// - provide a compact, mobile-first SisiMove presentation;
// - expose one shared submitting/disabled state;
// - pass the resolved vehicle Asset to the vehicle editor;
// - allow the parent JourneyEditor to initiate vehicle-photo replacement.
//
// Non-responsibilities:
// - no Journey API calls;
// - no mutation handling;
// - no Journey aggregate reconstruction;
// - no lifecycle handling;
// - no authorization decisions;
// - no domain validation;
// - no duplicate editor implementations;
// - no Asset upload or URL resolution.
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
//
// Vehicle photos are intentionally managed as part of the Vehicle editor.
// A separate Journey Assets section would duplicate that responsibility.
//
// Visual direction:
// - mobile-first;
// - compact and comfortable on small screens;
// - restrained SisiMove blue branding;
// - strong hierarchy without oversized sections;
// - generous touch targets;
// - subtle surfaces and borders;
// - no unnecessary visual noise.
//
// -----------------------------------------------------------------------------

"use client";

import type { ReactNode } from "react";

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
   */
  readonly preferencesInitialValue: JourneyPreferencesFieldValues;

  /**
   * Persists the preferences after the presentation editor is submitted.
   */
  readonly onPreferencesSubmit: (
    values: JourneyPreferencesFieldValues,
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
      {/* ------------------------------------------------------------------ */}
      {/* Section Header                                                     */}
      {/* ------------------------------------------------------------------ */}

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

      {/* ------------------------------------------------------------------ */}
      {/* Section Content                                                    */}
      {/* ------------------------------------------------------------------ */}

      <Divider className="my-3 sm:my-4" />

      <div className="min-w-0">{children}</div>
    </Card>
  );
}

// =============================================================================
// Component
// =============================================================================

export function JourneyEditorSections({
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
        description="Your departure and arrival."
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
        description="The vehicle your passengers will ride in."
      >
        <JourneyVehicleEditor
          initialValue={vehicleInitialValue}
          selectedAsset={vehicleSelectedAsset}
          onSubmit={onVehicleSubmit}
          onChangeAsset={onChangeVehicleAsset}
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
        description="Passenger seats available."
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
        description="Your cost-sharing amount."
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
        description="What passengers should know before joining."
      >
        <JourneyPreferencesEditor
          initialValue={preferencesInitialValue}
          onSubmit={onPreferencesSubmit}
          onCancel={onCancel}
          submitting={submitting}
          submitLabel="Save Preferences"
        />
      </JourneyEditorSection>
    </div>
  );
}