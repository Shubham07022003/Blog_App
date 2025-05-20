const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  POSTS: {
    LIST: `${API_BASE_URL}/api/posts`,
    DETAIL: (id) => `${API_BASE_URL}/api/posts/${id}`,
    CREATE: `${API_BASE_URL}/api/posts`,
    UPDATE: (id) => `${API_BASE_URL}/api/posts/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/posts/${id}`,
    MY_POSTS: `${API_BASE_URL}/api/posts/my-posts`,
    COMMENTS: (id) => `${API_BASE_URL}/api/posts/${id}/comments`,
  },
  USERS: {
    ME: `${API_BASE_URL}/api/users/me`,
  },
};

export default API_ENDPOINTS; 