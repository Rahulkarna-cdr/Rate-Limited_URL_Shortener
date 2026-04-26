const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const toJson = async (response) => response.json().catch(() => ({}));

const createApiError = (status, body, headers) => {
  const message = body?.msg || `Request failed (${status})`;
  const retryAfter = headers.get("Retry-After");
  return {
    status,
    message,
    retryAfter: retryAfter ? Number(retryAfter) : null,
  };
};

export const buildShortLink = (shortCode) =>
  `${API_BASE.replace(/\/$/, "")}/${shortCode}`;

export const shortenUrl = async (originalUrl) => {
  const response = await fetch(`${API_BASE}/api/shorten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ originalUrl }),
  });
  const body = await toJson(response);

  if (!response.ok) {
    throw createApiError(response.status, body, response.headers);
  }

  return body;
};

export const fetchAnalytics = async (shortCode) => {
  const response = await fetch(
    `${API_BASE}/api/analytics/${encodeURIComponent(shortCode)}`
  );
  const body = await toJson(response);

  if (!response.ok) {
    throw createApiError(response.status, body, response.headers);
  }

  return body;
};
