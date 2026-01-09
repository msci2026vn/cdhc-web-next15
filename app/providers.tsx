"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { memo } from "react";
import { Toaster } from "sonner";

// Google Client ID must be set via environment variable
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/**
 * Root Providers Component
 * Memoized to prevent unnecessary re-renders of the entire app
 */
export const Providers = memo(function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Show error in development if missing, fail silently in production
  if (!GOOGLE_CLIENT_ID) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "[Security] NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable is not set"
      );
    }
    return (
      <>
        {children}
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
      <Toaster position="top-right" richColors />
    </GoogleOAuthProvider>
  );
});
