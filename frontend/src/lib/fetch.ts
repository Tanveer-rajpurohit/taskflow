import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = Cookies.get('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('429_TOO_MANY_REQUESTS');
    }
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};
