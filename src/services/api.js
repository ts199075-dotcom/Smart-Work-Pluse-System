const API_BASE_URL = "/api";
const STORAGE_KEY = "smart_workspace_auth";

const getAuthToken = () => {
  const savedAuth =
    localStorage.getItem(STORAGE_KEY) ||
    sessionStorage.getItem(STORAGE_KEY);

  if (!savedAuth) return null;

  try {
    const { token } = JSON.parse(savedAuth);
    return token || null;
  } catch {
    return null;
  }
};

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();

  const isFormData = options.body instanceof FormData;

  const headers = new Headers(options.headers || {});

  if (isFormData) {
    headers.delete("Content-Type");
  } else if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const responseText = await response.text();

  let data = null;

  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const validationErrors = data?.errors
      ? Object.values(data.errors).flat()
      : [];

    const errorMessage =
      validationErrors.length > 0
        ? validationErrors.join(" ")
        : data?.message ||
          data?.title ||
          `Request failed: ${response.status}`;

    throw new Error(errorMessage);
  }

  return data;
}

export default apiRequest;