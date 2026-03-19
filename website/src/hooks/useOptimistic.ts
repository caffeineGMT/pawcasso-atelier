import { useState, useCallback, useTransition } from 'react';

export interface OptimisticState<T> {
  data: T | null;
  isPending: boolean;
  error: Error | null;
}

export function useOptimisticAction<T, Args extends any[]>(
  action: (...args: Args) => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: Error) => void
) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<OptimisticState<T>>({
    data: null,
    isPending: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState((prev) => ({ ...prev, isPending: true, error: null }));

      startTransition(() => {
        // Execute async operation
        (async () => {
          try {
            const result = await action(...args);
            setState({ data: result, isPending: false, error: null });
            onSuccess?.(result);
            return result;
          } catch (error) {
            const err = error instanceof Error ? error : new Error('Unknown error');
            setState({ data: null, isPending: false, error: err });
            onError?.(err);
            throw err;
          }
        })();
      });
    },
    [action, onSuccess, onError]
  );

  return {
    execute,
    isPending: isPending || state.isPending,
    data: state.data,
    error: state.error,
    reset: () => setState({ data: null, isPending: false, error: null }),
  };
}

export function useOptimisticList<T extends { id: string | number }>(
  initialItems: T[] = []
) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [optimisticIds, setOptimisticIds] = useState<Set<string | number>>(new Set());

  const addOptimistic = useCallback((item: T) => {
    setOptimisticIds((prev) => new Set(prev).add(item.id));
    setItems((prev) => [item, ...prev]);
  }, []);

  const removeOptimistic = useCallback((id: string | number) => {
    setOptimisticIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const confirmOptimistic = useCallback((id: string | number, actualItem?: T) => {
    setOptimisticIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (actualItem) {
      setItems((prev) => prev.map((item) => (item.id === id ? actualItem : item)));
    }
  }, []);

  const isOptimistic = useCallback(
    (id: string | number) => optimisticIds.has(id),
    [optimisticIds]
  );

  return {
    items,
    setItems,
    addOptimistic,
    removeOptimistic,
    confirmOptimistic,
    isOptimistic,
  };
}
