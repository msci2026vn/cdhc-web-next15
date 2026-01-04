"use client";

interface Option {
  value: string;
  label: string;
}

interface SelectWithOtherProps {
  label: string;
  name: string;
  value: string;
  otherValue: string;
  onChange: (value: string) => void;
  onOtherChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  error?: string;
}

export function SelectWithOther({
  label,
  name,
  value,
  otherValue,
  onChange,
  onOtherChange,
  options,
  required = false,
  error,
}: SelectWithOtherProps) {
  const hasOtherOption = options.some((opt) => opt.value === "other");
  const showOtherInput = value === "other";

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
          onChange(e.target.value);
          if (e.target.value !== "other") {
            onOtherChange("");
          }
        }}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-colors focus:outline-none focus:border-green-500 appearance-none bg-white ${
          error ? "border-red-300 bg-red-50" : "border-slate-200"
        }`}
      >
        <option value="">-- Chọn --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hasOtherOption && showOtherInput && (
        <input
          type="text"
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder="Nhập thông tin khác..."
          className="mt-2 w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-colors focus:outline-none focus:border-green-500"
        />
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
