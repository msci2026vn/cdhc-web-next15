"use client";

interface TextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "tel" | "email" | "url" | "date";
  error?: string;
  disabled?: boolean;
  className?: string;
  helperText?: string;
}

export function TextField({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  type = "text",
  error,
  disabled = false,
  className = "",
  helperText,
}: TextFieldProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-colors focus:outline-none focus:border-green-500 ${
          error ? "border-red-300 bg-red-50" : "border-slate-200"
        } ${disabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""} ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
}
