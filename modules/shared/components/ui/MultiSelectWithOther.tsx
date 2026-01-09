"use client";

import { type ChangeEvent, memo, useCallback } from "react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectWithOtherProps {
  label: string;
  name: string;
  value: string[];
  otherValue: string;
  onChange: (value: string[]) => void;
  onOtherChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  maxSelect?: number;
  error?: string;
}

export const MultiSelectWithOther = memo(function MultiSelectWithOther({
  label,
  name,
  value,
  otherValue,
  onChange,
  onOtherChange,
  options,
  required = false,
  maxSelect,
  error,
}: MultiSelectWithOtherProps) {
  const hasOtherOption = options.some((opt) => opt.value === "other");
  const showOtherInput = value.includes("other");

  // Memoize toggle handler - uses data attribute to avoid inline closure
  const handleToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const optValue = e.currentTarget.dataset.value;
      if (!optValue) return;

      if (value.includes(optValue)) {
        onChange(value.filter((v) => v !== optValue));
        if (optValue === "other") {
          onOtherChange("");
        }
      } else {
        if (maxSelect && value.length >= maxSelect) {
          return;
        }
        onChange([...value, optValue]);
      }
    },
    [value, onChange, onOtherChange, maxSelect]
  );

  // Memoize other input handler
  const handleOtherChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onOtherChange(e.target.value);
    },
    [onOtherChange]
  );

  const otherInputId = `${name}-other`;

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
      {hasOtherOption && showOtherInput && (
        <>
          <label htmlFor={otherInputId} className="sr-only">
            Nhập thông tin khác
          </label>
          <input
            id={otherInputId}
            type="text"
            value={otherValue}
            onChange={handleOtherChange}
            placeholder="Nhập thông tin khác..."
            className="mt-2 w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-colors focus:outline-none focus:border-green-500"
          />
        </>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </fieldset>
  );
});
