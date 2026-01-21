import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial check (you might want to verify token with backend in a real app)
    useEffect(() => {
        const storedUser = localStorage.getItem('dsa_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (libraryId, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { libraryId, password });
            setUser(data);
            localStorage.setItem('dsa_user', JSON.stringify(data));
            localStorage.setItem('dsa_token', data.token);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const adminLogin = async (username, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/admin/login', { username, password });
            setUser({ ...data, role: 'admin' });
            localStorage.setItem('dsa_user', JSON.stringify({ ...data, role: 'admin' }));
            localStorage.setItem('dsa_token', data.token);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('dsa_user');
        localStorage.removeItem('dsa_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, adminLogin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
