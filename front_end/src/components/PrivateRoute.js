import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './authContext';

const PrivateRoute = ({ children, isAuthenticated }) => { // Accept isAuthenticated as a prop
    const { isLoggedIn } = useContext(AuthContext); // Or use the context if you prefer

    if (!isAuthenticated && !isLoggedIn) { // Check both props and context
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;