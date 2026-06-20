type ApiEnvelope<T> = { data: T } | { error: string };

export async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = (await response
    .json()
    .catch(() => ({ error: "Invalid server response" }))) as ApiEnvelope<T>;

  if (!response.ok || "error" in payload) {
    throw new Error("error" in payload ? payload.error : "Request failed");
  }

  return payload.data;
}

export const jsonRequest = (method: "POST" | "PATCH", body: unknown): RequestInit => ({
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});
