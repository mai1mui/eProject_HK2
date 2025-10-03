import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../lib/api";

import { motion } from "framer-motion";
import "../../css/AdminDashboard.css";

export default function InstructorDashboard() {
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/instructor/overview");
                // setState(res.data);
            } catch (e) {
                // 401/419 đã bị chuyển hướng ở interceptor; các lỗi khác xử lý tại đây
                console.error(e);
            }
        })();
    }, []);
    return (
        <div>
            <p>hello instructor</p>
        </div>
    );
}
