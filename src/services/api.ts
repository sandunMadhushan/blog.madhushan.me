const API_BASE = "/.netlify/functions/api";

type RequestOptions = RequestInit & {
  params?: Record<string, string>;
};

function buildUrl(path: string, params?: Record<string, string>) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.set(key, value)
    );
  }
  return url.toString();
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(buildUrl(path, options.params), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error((payload as { error?: string } | null)?.error || "Request failed");
  }

  // Guard against HTML fallback responses (common when /api is not wired in dev).
  if (!contentType.includes("application/json") || payload === null) {
    throw new Error("Invalid API response");
  }
  return payload as T;
}
