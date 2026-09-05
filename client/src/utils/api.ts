const API_BASE_URL = 'http://localhost:5000/api';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const activeUserId = localStorage.getItem('nex_active_user_id') || '';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(activeUserId ? { 'x-user-id': activeUserId } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson.error) errorMsg = errorJson.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
