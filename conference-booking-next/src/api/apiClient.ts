
import axios from 'axios';


const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5151',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor with traceability
apiClient.interceptors.request.use(
  (config) => {
    // Add request ID for tracing
    const requestId = Math.random().toString(36).substring(7);
    config.headers['X-Request-ID'] = requestId;

    // Log request lifecycle start
    console.log(`[${requestId}]  Request Lifecycle Started:`, {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      timestamp: new Date().toISOString(),
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    });

    // Attach auth token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[${requestId}]  Auth token attached`);
      }
    }

    return config;
  },
  (error) => {
    console.error(' Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with full lifecycle tracing
apiClient.interceptors.response.use(
  (response) => {
    const requestId = response.config.headers?.["X-Request-ID"];

    // Read start time from header
    const startTime = Number(response.config.headers?.["X-Request-Start"]);
    const duration = startTime ? `${Date.now() - startTime}ms` : "unknown";

    console.log(`[${requestId}]  Request Lifecycle Complete:`, {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      duration,
      timestamp: new Date().toISOString(),
    });

    // Log database interaction point (simulated - actual DB logging happens in .NET)
    console.log(`[${requestId}]  Database query executed (logged in .NET)`);

    return response.data;
  },
  (error) => {
    const requestId = error.config?.headers?.['X-Request-ID'] || 'unknown';
    
    console.error(`[${requestId}]  Request Lifecycle Failed:`, {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      timestamp: new Date().toISOString(),
    });

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      console.log(`[${requestId}]  Session expired, redirecting to login`);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;