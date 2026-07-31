import { useCallback, useSyncExternalStore } from 'react';

/* Subscribes to a media query and re-renders on change.
   Used where the two layouts are structurally different enough that a CSS-only
   swap would mean shipping both DOM trees (e.g. the climbing timeline's
   horizontal SVG curve vs. its vertical mobile rail).

   useSyncExternalStore rather than useState + useEffect: matchMedia is an
   external store, so this reads the correct value on the first render instead
   of painting the wrong layout and correcting it a frame later. */
export default function useMediaQuery(query) {
  const subscribe = useCallback(
    (onStoreChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onStoreChange);
      return () => mql.removeEventListener('change', onStoreChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  // Server/prerender has no matchMedia; assume the desktop layout.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
