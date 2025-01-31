import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './authContext';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { isLoggedIn, userRole } = useContext(AuthContext);

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <div>You do not have permission to access this page.</div>; // Or redirect
    }

    return children;
};

export default PrivateRoute;