"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * Toast notification provider
 * Wraps the Sonner Toaster with custom styling
 */
export function ToastProvider() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#18181b",
          color: "#F5F5F7",
          border: "1px solid #27272a",
        },
        className: "sonner-toast",
      }}
      theme="dark"
      richColors
      closeButton
      duration={4000}
    />
  );
}
