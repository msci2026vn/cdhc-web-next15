"use client";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  required = false,
  error,
}: SelectFieldProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.value);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={`w-full px-4 py-3 pr-10 border-2 rounded-xl transition-colors focus:outline-none focus:border-green-500 bg-white cursor-pointer ${
          error ? "border-red-300 bg-red-50" : "border-slate-200"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
