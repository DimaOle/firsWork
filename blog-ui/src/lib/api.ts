export async function apiFetch(path: string, options?: RequestInit) {
  return fetch(`http://localhost:3001/api${path}`, {
    credentials: "include",
    ...options,
  });
}
