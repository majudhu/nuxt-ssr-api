import type { NitroFetchOptions } from 'nitropack';

export function apiFetch<T>(path: string, options?: NitroFetchOptions<string>) {
  const headers = useRequestHeaders(['cookie']);

  return $fetch<T>(path, { ...options, headers });
}
