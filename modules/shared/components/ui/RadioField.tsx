"use client";

interface Option {
  value: string;
  label: string;
}

interface RadioFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  error?: string;
  layout?: "horizontal" | "vertical";
}

export function RadioField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error,
  layout = "horizontal",
}: RadioFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        className={`flex ${layout === "vertical" ? "flex-col gap-2" : "flex-wrap gap-3"}`}
      >
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? "border-green-500 bg-green-50"
                  : "border-slate-200 hover:border-green-300"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                className="w-4 h-4 text-green-500 focus:ring-green-500"
              />
              <span
                className={`text-sm ${isSelected ? "text-green-700 font-medium" : "text-slate-600"}`}
              >
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
