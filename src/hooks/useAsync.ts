import { type DependencyList, useCallback, useEffect, useState } from "react";

type AsyncState<T> = {
  data: T | undefined;
  error: unknown;
  loading: boolean;
};

/**
 * Runs an async function when deps change and tracks loading/error.
 * Keeps the previous data while reloading, so lists don't flash empty between pages.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, error: undefined, loading: true });
  const [version, setVersion] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: the caller's deps decide when to re-run
  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, error: undefined, loading: true }));
    fn().then(
      (data) => !cancelled && setState({ data, error: undefined, loading: false }),
      (error: unknown) => !cancelled && setState((s) => ({ ...s, error, loading: false })),
    );
    return () => {
      cancelled = true;
    };
  }, [...deps, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { ...state, reload };
}
