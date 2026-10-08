import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If sending FormData, delete Content-Type so browser/Axios sets multipart/form-data with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Return standard response structure directly
    return response.data;
  },
  (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;

      // 401 Unauthorized handling: notify AuthContext and clean credentials
      if (status === 401 && !originalRequest._retry) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-unauthorized'));
      }

      // Reject with custom error response structure
      return Promise.reject({
        message: data.message || 'Something went wrong',
        errorCode: data.errorCode || 'UNKNOWN_ERROR',
        status,
      });
    }

    return Promise.reject({
      message: 'Network error. Please check your connection.',
      errorCode: 'NETWORK_ERROR',
      status: 0,
    });
  }
);

export default axiosClient;
