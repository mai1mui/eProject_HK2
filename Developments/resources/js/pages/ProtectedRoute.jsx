import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const location = useLocation();

    // Lấy user/token đã lưu khi login
    const rawUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const user = rawUser ? JSON.parse(rawUser) : null;

    // Chưa đăng nhập -> về login kèm ?next= để quay lại đúng trang
    if (!user || !token) {
        const next = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?next=${next}`} replace />;
    }

    // Chuẩn hoá role
    const role = (user?.ARole ?? user?.role ?? "")
        .toString()
        .trim()
        .toLowerCase();

    // Suy role yêu cầu từ đường dẫn
    const p = location.pathname.toLowerCase();
    let requireRole = null;
    if (p.startsWith("/admin")) requireRole = "admin";
    else if (p.startsWith("/instructor")) requireRole = "instructor";
    else if (p.startsWith("/learner")) requireRole = "learner";

    // Admin có full quyền
    if (role === "admin") return children;

    if (requireRole) {
        const ok =
            (requireRole === "instructor" && role === "instructor") ||
            (requireRole === "learner" && role === "learner") ||
            (requireRole === "admin" && role === "admin");

        if (!ok) return <Navigate to="/" replace />;
    }

    return children;
}
