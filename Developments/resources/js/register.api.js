// src/services/register.api.js

import axios from "axios";

// ========== CONFIG ==========
export const API_URL =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    "http://127.0.0.1:8000/api";

// ========== API CALLS ==========
/**
 * Chỉ cho Learner đăng ký. Backend nên enforce lại.
 * @param {{name:string, email:string, password:string, marketing:boolean}} payload
 */
export async function registerLearner(payload) {
    const { name, email, password, marketing } = payload;

    // KHÔNG gửi AccountID từ client; để server tự sinh
    const body = {
        AName: name,
        Email: email,
        Pass: password,
        ARole: "Learner",          // 🔒 khóa role
        AStatus: "Active",
        ApprovalStatus: "Approved",
        email_marketing_consent: !!marketing,
    };

    const res = await axios.post(`${API_URL}/register`, body);
    return res?.data ?? {};
}

/**
 * (Optional) Kiểm tra email đã tồn tại chưa — tuỳ backend của bạn.
 * Ví dụ endpoint: GET /auth/check-email?email=...
 */
export async function checkEmailExists(email) {
    if (!email) return false;
    try {
        const res = await axios.get(`${API_URL}/auth/check-email`, {
            params: { email },
        });
        return !!res?.data?.exists; // backend trả { exists: true/false }
    } catch {
        return false; // không chặn nếu API check lỗi
    }
}

// ========== HELPERS ==========
/** Trả về object các điều kiện mật khẩu */
export function passwordReqs(pwd = "") {
    return {
        len: /.{8,}/.test(pwd),
        up: /[A-Z]/.test(pwd),
        low: /[a-z]/.test(pwd),
        num: /\d/.test(pwd),
        sp: /[^A-Za-z0-9]/.test(pwd),
    };
}

/** Điểm strength 0..5 */
export function passwordScore(pwd = "") {
    const r = passwordReqs(pwd);
    return ["len", "up", "low", "num", "sp"].reduce((s, k) => s + (r[k] ? 1 : 0), 0);
}

/** Debounce nhỏ cho input email (dùng với onChange) */
export function debounce(fn, ms = 400) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
}
