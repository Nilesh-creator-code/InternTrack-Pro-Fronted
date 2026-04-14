import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const PrivateRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        // Not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // Check if route requires specific roles, and if user has one of them
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // User logged in but doesn't have required role, redirect to unauthorized or home
        // Fallback depending on user role
        if (user.role === "INDUSTRY") {
            return <Navigate to="/industry/dashboard" replace />;
        } else {
            return <Navigate to="/student/dashboard" replace />;
        }
    }

    // Authorized
    return <Outlet />;
};

export default PrivateRoute;
