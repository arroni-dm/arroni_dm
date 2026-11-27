"use client";

import { useEffect } from "react";

/** Scrolls to the top when the page mounts (preserves the projects page's previous behaviour). */
export function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
