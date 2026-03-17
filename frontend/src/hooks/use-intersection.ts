import { useEffect, useRef, useState } from "react";

interface UseIntersectionOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersection(options: UseIntersectionOptions = {}) {
  const { freezeOnceVisible = false, ...observerOptions } = options;
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<Element | null>(null);

  const isVisible = entry?.isIntersecting ?? false;
  const frozen = isVisible && freezeOnceVisible;

  useEffect(() => {
    const node = ref.current;
    if (!node || frozen) return;

    const observer = new IntersectionObserver(
      ([e]) => setEntry(e),
      observerOptions
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [frozen, observerOptions]);

  return { ref, entry, isVisible };
}
