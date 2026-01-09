"use client";

import { memo, useCallback } from "react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label: string;
  name: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: Option[];
  required?: boolean;
  maxSelect?: number;
  error?: string;
}

export const MultiSelect = memo(function MultiSelect({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  maxSelect,
  error,
}: MultiSelectProps) {
  // Memoize toggle handler - uses data attribute to avoid inline closure
  const handleToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const optValue = e.currentTarget.dataset.value;
      if (!optValue) return;

      if (value.includes(optValue)) {
        onChange(value.filter((v) => v !== optValue));
      } else {
        if (maxSelect && value.length >= maxSelect) {
          return;
        }
        onChange([...value, optValue]);
      }
    },
    [value, onChange, maxSelect]
  );

  return (
    <fieldset className="mb-4 border-0 p-0 m-0">
      <legend className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {maxSelect && (
          <span className="text-slate-400 font-normal ml-2">
            (tối đa {maxSelect})
          </span>
        )}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = value.includes(opt.value);
          const isDisabled = Boolean(
            maxSelect && !isSelected && value.length >= maxSelect
          );
          return (
            <button
              key={opt.value}
              type="button"
              data-value={opt.value}
              onClick={handleToggle}
              disabled={isDisabled}
              aria-pressed={isSelected}
              className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-green-500 bg-green-50 text-green-700"
                  : isDisabled
                    ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                    : "border-slate-200 hover:border-green-300 text-slate-600"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </fieldset>
  );
});
