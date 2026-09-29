// -----------------------------------------------------------------------------
// sisiMove — Journey Asset Editor
// -----------------------------------------------------------------------------
//
// Presentation-only editor for a Journey Asset association.
//
// The parent workflow owns:
// - Asset selection source;
// - Journey API mutation;
// - domain validation;
// - persistence;
// - refetch/invalidation;
// - navigation;
// - error handling.
//
// Asset upload/replacement/deletion belongs to the Asset feature.
// -----------------------------------------------------------------------------

"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui";
import type { JourneyAssetType } from "@/features/journey/models";
import { cn } from "@/foundation/utils/cn";

import {
  JourneyAssetPicker,
  type JourneyAssetPickerOption,
} from "./journey-asset-picker";

// -----------------------------------------------------------------------------
// Field Values
// -----------------------------------------------------------------------------

export interface JourneyAssetFieldValues {
  readonly assetPublicId: string;
  readonly type: JourneyAssetType;
  readonly sortOrder: string;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyAssetEditorProps {
  readonly options: readonly JourneyAssetPickerOption[];

  readonly initialValue?: Partial<JourneyAssetFieldValues>;

  readonly onSubmit: (values: JourneyAssetFieldValues) => void;

  readonly onCancel?: () => void;

  readonly submitting?: boolean;

  readonly submitLabel?: string;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const EMPTY_VALUES = {
  assetPublicId: "",
  type: "OTHER",
  sortOrder: "0",
} satisfies JourneyAssetFieldValues;

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyAssetEditor({
  options,
  initialValue,
  onSubmit,
  onCancel,
  submitting = false,
  submitLabel = "Save asset",
  className,
}: JourneyAssetEditorProps) {
  const [values, setValues] = useState<JourneyAssetFieldValues>(() => ({
    ...EMPTY_VALUES,
    ...initialValue,
  }));

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form
      className={cn("space-y-6", className)}
      onSubmit={handleSubmit}
    >
      <JourneyAssetPicker
        options={options}
        selectedAssetPublicId={values.assetPublicId}
        assetType={values.type}
        disabled={submitting}
        onSelect={(assetPublicId) => {
          setValues((current) => ({
            ...current,
            assetPublicId,
          }));
        }}
      />

      <div className="space-y-2">
        <label
          htmlFor="journey-asset-type"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Asset type
        </label>

        <select
          id="journey-asset-type"
          value={values.type}
          disabled={submitting}
          onChange={(event) => {
            setValues((current) => ({
              ...current,
              type: event.target.value as JourneyAssetType,
            }));
          }}
          className={cn(
            "w-full",
            "rounded-[var(--radius-md)]",
            "border",
            "border-[var(--border)]",
            "bg-[var(--background)]",
            "px-3",
            "py-2",
            "text-sm",
            "text-[var(--foreground)]",
          )}
        >
          <option value="VEHICLE">Vehicle</option>
          <option value="ROUTE">Route</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="journey-asset-sort-order"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Display order
        </label>

        <input
          id="journey-asset-sort-order"
          type="number"
          min="0"
          inputMode="numeric"
          value={values.sortOrder}
          disabled={submitting}
          onChange={(event) => {
            setValues((current) => ({
              ...current,
              sortOrder: event.target.value,
            }));
          }}
          className={cn(
            "w-full",
            "rounded-[var(--radius-md)]",
            "border",
            "border-[var(--border)]",
            "bg-[var(--background)]",
            "px-3",
            "py-2",
            "text-sm",
            "text-[var(--foreground)]",
          )}
        />
      </div>

      <div
        className={cn(
          "flex",
          "flex-col-reverse",
          "gap-3",
          "sm:flex-row",
          "sm:justify-end",
        )}
      >
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            disabled={submitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          variant="primary"
          loading={submitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}