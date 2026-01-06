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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (newValue !== "other") {
      onOtherChange("");
    }
  };

  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          className={`w-full px-4 py-3 pr-10 border-2 rounded-xl transition-colors focus:outline-none focus:border-green-500 bg-white cursor-pointer ${
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
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
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
