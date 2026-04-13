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
    throw new Error(extractErrorMessage(payload) || "Request failed");
  }

  // Guard against HTML fallback responses (common when /api is not wired in dev).
  if (!contentType.includes("application/json") || payload === null) {
    throw new Error("Invalid API response");
  }
  return payload as T;
}

function extractErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const asObj = payload as Record<string, unknown>;
  const errorValue = asObj.error;

  if (typeof errorValue === "string") return errorValue;
  if (!errorValue || typeof errorValue !== "object") return null;

  // Supports zod flatten shape:
  // { fieldErrors: { title: ["..."] }, formErrors: ["..."] }
  const zodLike = errorValue as {
    formErrors?: unknown;
    fieldErrors?: unknown;
  };

  if (Array.isArray(zodLike.formErrors) && zodLike.formErrors.length > 0) {
    const first = zodLike.formErrors[0];
    if (typeof first === "string") return first;
  }

  if (
    zodLike.fieldErrors &&
    typeof zodLike.fieldErrors === "object" &&
    !Array.isArray(zodLike.fieldErrors)
  ) {
    const entries = Object.entries(
      zodLike.fieldErrors as Record<string, unknown>
    );
    for (const [field, value] of entries) {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
        return `${field}: ${value[0]}`;
      }
    }
  }

  try {
    return JSON.stringify(errorValue);
  } catch {
    return "Request failed";
  }
}
