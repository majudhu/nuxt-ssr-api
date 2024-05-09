import type { UseFetchOptions } from '#app';

export function useApiFetch<T>(path: string, options?: UseFetchOptions<T>) {
  const headers = useRequestHeaders(['cookie']);

  return useFetch(path, { ...options, headers });
}
