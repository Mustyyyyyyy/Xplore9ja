const API_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit & {
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (options.auth && token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null
        ? (data as any).message || (data as any).error
        : undefined;

    throw new ApiError(
      message || response.statusText || `HTTP error ${response.status}` || "Something went wrong",
      response.status,
      data
    );
  }

  return data as T;
}