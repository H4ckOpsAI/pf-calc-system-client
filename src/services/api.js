import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor for refresh token
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Attempt to refresh token
                // We assume there is an endpoint /auth/refresh-token that cookies handles
                // But wait, my refresh token logic in backend expects 'refreshToken' in body?
                // Let's check backend: keys: { refreshToken } = req.body.
                // But I also stored session in DB.
                // In my Login response, I sent `refreshToken`.
                // So I need to store refreshToken in localStorage or memory?
                // If I store in localStorage, I can send it.
                // Security wise, httpOnly cookie for refresh token is better, but requirement said "JWT stored in httpOnly cookies".
                // Usually Access Token in memory/header, Refresh Token in Cookie.
                // OR Access Token in Cookie (httpOnly).
                // My backend: `res.cookie('token', accessToken...`
                // So Access Token is in Cookie.
                // If Access Token expires, the Cookie is invalid/expired.
                // I need to hit /refresh-token.
                // Does /refresh-token require a specific input?
                // Backend: `const { refreshToken } = req.body;`
                // So I need to pass refreshToken.
                // Where do I get it?
                // Login response returns `refreshToken`.
                // I should store `refreshToken` in localStorage/Context.

                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    // No refresh token, logout
                    return Promise.reject(error);
                }

                const rs = await axios.post('http://localhost:5000/api/auth/refresh-token', {
                    refreshToken
                }, { withCredentials: true });

                const { accessToken } = rs.data;
                // The backend sets the new access token in cookie.
                // So we just retry the original request.
                return api(originalRequest);
            } catch (_error) {
                return Promise.reject(_error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
