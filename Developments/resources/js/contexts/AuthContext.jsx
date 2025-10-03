import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

// user = { AccountID, AName, Email, ARole }
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let live = true;
        api.get("/me")
            .then((r) => live && setUser(r.data || null))
            .catch(() => live && setUser(null))
            .finally(() => live && setLoading(false));
        return () => {
            live = false;
        };
    }, []);

    const login = async (email, password) => {
        const r = await api.post("/auth/login", { email, password });
        setUser(r.data.user); // backend trả {user:{AccountID,...}}
        return r.data;
    };

    const logout = async () => {
        await api.post("/auth/logout").catch(() => {});
        setUser(null);
    };

    return (
        <AuthCtx.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}

export function useAuth() {
    return useContext(AuthCtx);
}
