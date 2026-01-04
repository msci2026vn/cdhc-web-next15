"use client";

interface PlatformOption {
  value: string;
  label: string;
}

interface FollowerOption {
  value: string;
  label: string;
}

export interface PlatformLink {
  platform: string;
  url: string;
  followers: string;
}

interface PlatformLinksProps {
  label: string;
  value: PlatformLink[];
  onChange: (value: PlatformLink[]) => void;
  platformOptions: PlatformOption[];
  followerOptions: FollowerOption[];
  required?: boolean;
  error?: string;
}

export function PlatformLinks({
  label,
  value,
  onChange,
  platformOptions,
  followerOptions,
  required = false,
  error,
}: PlatformLinksProps) {
  const handleAdd = () => {
    onChange([...value, { platform: "", url: "", followers: "" }]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof PlatformLink,
    fieldValue: string
  ) => {
    const newValue = [...value];
    newValue[index] = { ...newValue[index], [field]: fieldValue };
    onChange(newValue);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="space-y-3">
        {value.map((link, index) => (
          <div
            key={`platform-${index}-${link.platform || "empty"}`}
            className="p-3 border-2 border-slate-200 rounded-xl space-y-2"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">
                Kênh {index + 1}
              </span>
              {value.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Xóa
                </button>
              )}
            </div>

            <select
              value={link.platform}
              onChange={(e) => handleChange(index, "platform", e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-green-500 appearance-none bg-white text-sm"
            >
              <option value="">-- Chọn nền tảng --</option>
              {platformOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <input
              type="url"
              value={link.url}
              onChange={(e) => handleChange(index, "url", e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-green-500 text-sm"
            />

            <select
              value={link.followers}
              onChange={(e) => handleChange(index, "followers", e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-green-500 appearance-none bg-white text-sm"
            >
              <option value="">-- Số followers --</option>
              {followerOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 w-full py-2 border-2 border-dashed border-green-300 rounded-xl text-green-600 hover:bg-green-50 transition-colors text-sm font-medium"
      >
        + Thêm kênh
      </button>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
