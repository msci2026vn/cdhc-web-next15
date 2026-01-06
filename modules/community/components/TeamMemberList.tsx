"use client";

import { useState } from "react";

interface F1Member {
  id: string;
  n: string; // name
  p: string; // phone
}

interface TeamMemberListProps {
  members: F1Member[];
  variant?: "mobile" | "desktop";
}

export function TeamMemberList({
  members,
  variant = "mobile",
}: TeamMemberListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = members.filter(
    (f1) =>
      f1.n.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f1.p.includes(searchTerm)
  );

  const isMobile = variant === "mobile";

  return (
    <div className={isMobile ? "p-4 space-y-4" : "space-y-4"}>
      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          placeholder="Tìm kiếm đồng đội..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-12 pr-4 ${isMobile ? "py-3" : "py-2"} rounded-xl border border-gray-200 focus:border-green-500 focus:outline-none transition-colors`}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Tổng số đồng đội</span>
        <span className="font-bold text-green-700">{members.length} người</span>
      </div>

      {/* Member List */}
      <div
        className={`space-y-2 ${isMobile ? "max-h-[400px]" : "max-h-[300px]"} overflow-y-auto`}
      >
        {filteredMembers.length > 0 ? (
          filteredMembers.map((f1, index) => (
            <div
              key={f1.id}
              className={`flex items-center gap-3 ${isMobile ? "p-3" : "p-2"} bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors`}
            >
              <div
                className={`${isMobile ? "w-10 h-10" : "w-8 h-8"} rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold ${isMobile ? "text-sm" : "text-xs"}`}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`font-semibold text-gray-900 truncate ${isMobile ? "" : "text-sm"}`}
                >
                  {f1.n}
                </div>
                <div
                  className={`${isMobile ? "text-sm" : "text-xs"} text-gray-500`}
                >
                  {f1.p}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className={`${isMobile ? "text-4xl" : "text-3xl"} mb-2`}>
              👥
            </div>
            <p>{searchTerm ? "Không tìm thấy đồng đội" : "Chưa có đồng đội"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
