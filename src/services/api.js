const rawBaseUrl =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");
const TOKEN_STORAGE_KEY = "batteryguard_token";

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors in restricted environments
  }
}

function extractErrorMessage(data, fallback) {
  if (!data) return fallback;
  if (typeof data.detail === "string" && data.detail.trim()) {
    return data.detail;
  }
  if (Array.isArray(data.detail) && data.detail.length > 0) {
    return data.detail
      .map((item) => item?.msg || JSON.stringify(item))
      .join(" · ");
  }
  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }
  return fallback;
}

async function apiRequest(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = getStoredToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      `No se pudo conectar con el servidor (${API_BASE_URL}). Verifica que el backend esté encendido.`
    );
  }

  let data = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const error = new Error(
      extractErrorMessage(data, `Error del servidor (HTTP ${response.status}).`)
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

export function loginRequest({ email, password }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export function getMeRequest() {
  return apiRequest("/auth/me");
}

export function changePasswordRequest({ currentPassword, newPassword }) {
  const body = { newPassword };
  if (currentPassword) {
    body.currentPassword = currentPassword;
  }
  return apiRequest("/auth/change-password", {
    method: "POST",
    body,
  });
}

export function getEmployeesRequest() {
  return apiRequest("/employees");
}

export function createEmployeeRequest({ fullName, email, role, password }) {
  return apiRequest("/employees", {
    method: "POST",
    body: { fullName, email, role, password },
  });
}

export function resetEmployeePasswordRequest(employeeId) {
  return apiRequest(`/employees/${employeeId}/reset-password`, {
    method: "POST",
  });
}

export function getVehiclesRequest() {
  return apiRequest("/vehicles");
}

export function createVehicleRequest(payload) {
  return apiRequest("/vehicles", {
    method: "POST",
    body: {
      plate: payload.plate,
      brand: payload.brand,
      model: payload.model,
      year: payload.year,
      batteryType: payload.batteryType,
      packArchitecture: payload.packArchitecture,
      battery_capacity_kwh: payload.battery_capacity_kwh,
      cycle_count: payload.cycle_count,
      status: payload.status,
    },
  });
}

export function updateVehicleStatusRequest(vehicleId, status) {
  return apiRequest(`/vehicles/${vehicleId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function simulateBatteryRequest(payload) {
  return apiRequest("/simulate", {
    method: "POST",
    body: payload,
  });
}

export function getEvaluationsRequest(vehicleId) {
  const query = vehicleId ? `?vehicleId=${encodeURIComponent(vehicleId)}` : "";
  return apiRequest(`/evaluations${query}`);
}

export function getThresholdsRequest() {
  return apiRequest("/settings/thresholds");
}

export function updateThresholdsRequest(payload) {
  return apiRequest("/settings/thresholds", {
    method: "PUT",
    body: payload,
  });
}
