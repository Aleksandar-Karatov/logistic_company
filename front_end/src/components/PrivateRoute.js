import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './authContext';

const PrivateRoute = ({ children, isAuthenticated }) => { 
    const { isLoggedIn } = useContext(AuthContext); 

    if (!isAuthenticated && !isLoggedIn) { 
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;