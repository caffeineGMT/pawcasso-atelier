/**
 * Async hook with loading, error, and data states
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { parseError, AppError } from '@/lib/errors';

export interface AsyncState<T> {
  data: T | null;
  error: AppError | null;
  loading: boolean;
  called: boolean;
}

export interface AsyncHookOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: AppError) => void;
  immediate?: boolean;
}

/**
 * Hook for handling async operations with automatic error handling
 */
export function useAsync<T, Args extends unknown[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: AsyncHookOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: false,
    called: false,
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: Args) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        called: true,
      }));

      try {
        const data = await asyncFunction(...args);

        if (isMountedRef.current) {
          setState({
            data,
            error: null,
            loading: false,
            called: true,
          });

          options.onSuccess?.(data);
        }

        return data;
      } catch (error) {
        const appError = parseError(error);

        if (isMountedRef.current) {
          setState({
            data: null,
            error: appError,
            loading: false,
            called: true,
          });

          options.onError?.(appError);
        }

        throw appError;
      }
    },
    [asyncFunction, options]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      loading: false,
      called: false,
    });
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (options.immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.immediate]);

  return {
    ...state,
    execute,
    reset,
  };
}
