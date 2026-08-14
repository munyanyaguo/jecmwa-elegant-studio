import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Restores scroll on navigation, and honours in-page hashes when present.
 * `scroll-behavior: smooth` is disabled for the jump so route changes land
 * instantly rather than animating the whole page.
 */
export const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previous;
  }, [pathname, hash]);

  return null;
};
