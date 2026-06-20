"use client";

import { AlertTriangle, X } from "lucide-react";
import { useEcoData } from "@/components/dashboard/data-provider";

export function DataErrorBanner() {
  const { error, clearError } = useEcoData();
  if (!error) return null;

  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800"
    >
      <AlertTriangle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
      <p className="flex-1">{error}</p>
      <button
        type="button"
        onClick={clearError}
        aria-label="Dismiss error"
        className="rounded p-1 hover:bg-red-100"
      >
        <X size={16} />
      </button>
    </div>
  );
}
