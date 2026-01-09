"use client";

import { memo } from "react";

type TabId = "exchange" | "team" | "history";

interface Tab {
  id: TabId;
  icon: string;
  label: string;
}

interface DashboardTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  variant?: "mobile" | "desktop";
}

const tabs: Tab[] = [
  { id: "exchange", icon: "🔄", label: "Đổi điểm" },
  { id: "team", icon: "👥", label: "Đồng đội" },
  { id: "history", icon: "📋", label: "Hồ sơ" },
];

// PERFORMANCE: Memoize to prevent re-renders when parent state changes
export const DashboardTabs = memo(function DashboardTabs({
  activeTab,
  onTabChange,
  variant = "mobile",
}: DashboardTabsProps) {
  const isMobile = variant === "mobile";

  if (isMobile) {
    return (
      <div className="flex bg-gray-50 p-2 gap-2" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            aria-selected={activeTab === tab.id}
            role="tab"
            className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? "bg-white shadow-md text-green-700"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>
    );
  }

  // Desktop variant
  return (
    <div className="flex border-b border-gray-200" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          aria-selected={activeTab === tab.id}
          role="tab"
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "border-b-2 border-green-600 text-green-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
});

export type { TabId };
