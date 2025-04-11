"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Generate a random visitor ID if one doesn't exist
const getVisitorId = (): string => {
  if (typeof window === "undefined") return "";

  const storageKey = "visitor_id";
  let visitorId = localStorage.getItem(storageKey);

  if (!visitorId) {
    // Generate a random ID
    visitorId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    localStorage.setItem(storageKey, visitorId);
  }

  return visitorId;
};

export function ViewTracker() {
  const recordView = useMutation(api.analytics.recordView);

  useEffect(() => {
    // Record a view when the component mounts
    const recordViewOnce = async () => {
      try {
        const visitorId = getVisitorId();
        if (!visitorId) return; // Skip if we couldn't get a visitor ID (SSR)

        await recordView({ visitorId });
      } catch (error) {
        console.error("Failed to record view:", error);
      }
    };

    recordViewOnce();
  }, [recordView]);

  // This component doesn't render anything
  return null;
}
