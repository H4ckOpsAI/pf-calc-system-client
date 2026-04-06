import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error(err);
        }
        setUser(null);
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        // window.location.href = '/login'; // Don't force reload, React Router handles it
    };

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { user: userData, refreshToken } = res.data;
        setUser(userData);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    };

    useEffect(() => {
        const initAuth = async () => {
            const refreshToken = localStorage.getItem('refreshToken');
            const storedUser = localStorage.getItem('user');

            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    if (parsedUser && parsedUser.name && parsedUser.email) {
                        setUser(parsedUser);
                    } else {
                        // Invalid user data
                        localStorage.removeItem('user');
                    }
                } catch (e) {
                    console.error("Failed to parse user from local storage", e);
                    localStorage.removeItem('user');
                }
            }

            if (refreshToken) {
                try {
                    await api.post('/auth/refresh-token', { refreshToken });
                } catch (error) {
                    // Token invalid?
                    console.error("Token refresh failed", error);
                    // logout(); // Logout might trigger state update on unmounted component if strict mode? No, safe here.
                    // Actually, if refresh fails, we should clear user.
                    setUser(null);
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
