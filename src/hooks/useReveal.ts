import { useEffect } from "react";

const SELECTOR = ".reveal";
const VISIBLE = "is-visible";

export function useReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(SELECTOR).forEach((el) => el.classList.add(VISIBLE));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add(VISIBLE);
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    const observe = (el: Element) => {
      if (!el.classList.contains(VISIBLE)) io.observe(el);
    };
    const scan = (root: ParentNode) => root.querySelectorAll(SELECTOR).forEach(observe);

    scan(document);

    // Catches nodes mounted after the first scan: route changes, filtered lists, lazy sections.
    const mo = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(SELECTOR)) observe(node);
          scan(node);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
