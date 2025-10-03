import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth({ children }) {
    const { user, loading } = useAuth();
    const loc = useLocation();
    if (loading) return null; // hoặc spinner
    if (!user) {
        const next = encodeURIComponent(loc.pathname + loc.search);
        return <Navigate to={`/login?next=${next}`} replace />;
    }
    return children;
}
