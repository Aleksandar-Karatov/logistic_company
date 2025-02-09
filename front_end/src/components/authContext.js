import React, { createContext, useState, useEffect } from 'react';
import { getAuthHeaders, getApiUrl } from './utils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwtToken')); 
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));
    const apiUrl = getApiUrl();

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('jwtToken');

            if (token) {
                try {
                    const response = await fetch(`${apiUrl}/api/v1/user-info`, { 
                        headers: getAuthHeaders(), 
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setIsLoggedIn(true);
                        setUserRole(data.role);
                        setUserEmail(data.email);
                    } else {
                      localStorage.removeItem('jwtToken')
                      localStorage.removeItem('userRole')
                      localStorage.removeItem('userEmail')
                      setIsLoggedIn(false);
                      setUserRole(null);
                      setUserEmail(null);
                    }
                } catch (error) {
                    console.error("Error checking auth status:", error);
                    localStorage.removeItem('jwtToken')
                    localStorage.removeItem('userRole')
                    localStorage.removeItem('userEmail')
                    setIsLoggedIn(false);
                    setUserRole(null);
                    setUserEmail(null);
                }
            }
        };

        checkAuthStatus();
    }, [apiUrl]); 

    const login = (userData) => {
        localStorage.setItem('jwtToken', userData.token); 
        localStorage.setItem('userRole', userData.role); 
        localStorage.setItem('userEmail', userData.email);
        setIsLoggedIn(true);
        setUserRole(userData.role);
        setUserEmail(userData.email);
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        setIsLoggedIn(false);
        setUserRole(null);
        setUserEmail(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userRole, setUserEmail, userEmail, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;