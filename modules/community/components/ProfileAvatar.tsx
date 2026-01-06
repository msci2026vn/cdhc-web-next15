"use client";

import Image from "next/image";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  fallbackInitial: string;
  size?: "sm" | "md" | "lg";
  showGradientRing?: boolean;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-20 h-20",
  lg: "w-24 h-24",
};

const imageSizes = {
  sm: 64,
  md: 80,
  lg: 96,
};

const textSizes = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

export function ProfileAvatar({
  avatarUrl,
  fallbackInitial,
  size = "md",
  showGradientRing = true,
}: ProfileAvatarProps) {
  const sizeClass = sizeClasses[size];
  const imageSize = imageSizes[size];
  const textSize = textSizes[size];

  return (
    <div className="relative">
      {showGradientRing && (
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-purple-500 p-0.5" />
      )}
      <div
        className={`relative ${sizeClass} rounded-full border-4 border-white bg-gradient-to-br from-green-600 to-green-800 overflow-hidden shadow-xl`}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`Avatar của ${fallbackInitial}`}
            width={imageSize}
            height={imageSize}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center text-white ${textSize} font-bold`}
          >
            {fallbackInitial}
          </div>
        )}
      </div>
    </div>
  );
}
