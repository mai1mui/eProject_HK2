import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/** Nút mua: nếu chưa login => ép login; nếu đã login => đi checkout */
export default function BuyButton({
    courseId,
    className,
    children = "Buy this course",
}) {
    const { user } = useAuth();
    const nav = useNavigate();
    const loc = useLocation();

    const go = () => {
        if (!user) {
            nav(`/login?next=${encodeURIComponent(loc.pathname + loc.search)}`);
            return;
        }
        nav(`/checkout?course_id=${courseId}`);
    };

    return (
        <button className={className} onClick={go}>
            {children}
        </button>
    );
}
