/**
 *
 * @descriptions
 * this helper is to accomodate callback has been removed from v5
 * references: https://github.com/TanStack/query/discussions/5279#discussioncomment-6846119
 */

import { useEffect } from "react";
import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

interface Callbacks<TData = unknown, TError = unknown> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

export const useQueryWithCallbacks = <TData = unknown, TError = unknown>(
  options: UseQueryOptions<TData, TError> & Callbacks<TData, TError>
): UseQueryResult<TData, TError> => {
  const result = useQuery<TData, TError>(options);

  useEffect(() => {
    if (result.isSuccess && options?.onSuccess) {
      options.onSuccess(result.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data, result.isSuccess]);

  useEffect(() => {
    if (result.isError && options?.onError) {
      options.onError(result.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.error, result.isError]);

  return result;
};
