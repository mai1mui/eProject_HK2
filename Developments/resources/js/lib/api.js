// resources/js/lib/api.js
import axios from "axios";

/** ========== Config cơ bản ========== */
export const API_BASE =
    import.meta?.env?.VITE_API_URL || "http://127.0.0.1:8000/api";

/** ========== Tạo instance ========== */
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        Accept: "application/json",
    },
    // timeout: 15000, // (bật nếu muốn)
});

/** ========== Helpers ========== */
export function getToken() {
    return localStorage.getItem("token");
}

export function setAuth(token, user) {
    if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    }
}

export function clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common.Authorization;
}

function buildNextParam() {
    try {
        const path = window.location.pathname + window.location.search;
        return encodeURIComponent(path || "/");
    } catch {
        return encodeURIComponent("/");
    }
}

function redirectToLoginWithNext() {
    const next = buildNextParam();
    window.location.replace(`/login?next=${next}`);
}

/** ========== Interceptors ========== */
// Request: tự gắn token
api.interceptors.request.use(
    (cfg) => {
        const t = getToken();
        if (t) cfg.headers.Authorization = `Bearer ${t}`;
        return cfg;
    },
    (err) => Promise.reject(err)
);

// Response: xử lý 401/419
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err?.response?.status;
        if (status === 401 || status === 419) {
            // Hết hạn / không hợp lệ -> logout & quay về login
            clearAuth();
            redirectToLoginWithNext();
            // dừng promise chain (tránh component xử lý tiếp lỗi này)
            return;
        }
        return Promise.reject(err);
    }
);

/** ========== Upload multipart tiện dụng ========== */
export async function apiUpload(url, dataObj = {}, method = "post", cfg = {}) {
    const form = new FormData();
    Object.entries(dataObj || {}).forEach(([k, v]) => {
        // Hỗ trợ mảng file hoặc 1 file
        if (Array.isArray(v)) {
            v.forEach((item) => form.append(`${k}[]`, item));
        } else {
            form.append(k, v);
        }
    });
    const headers = { ...(cfg.headers || {}), "Content-Type": "multipart/form-data" };
    const request = method.toLowerCase();

    switch (request) {
        case "post":
            return api.post(url, form, { ...cfg, headers });
        case "put":
            return api.put(url, form, { ...cfg, headers });
        case "patch":
            return api.patch(url, form, { ...cfg, headers });
        default:
            // fallback dùng POST
            return api.post(url, form, { ...cfg, headers });
    }
}

/** ========== Export mặc định ========== */
export default api;

/** ========== Gợi ý sử dụng ==========
 * import api, { setAuth, clearAuth, apiUpload } from "@/lib/api";
 *
 * // Sau login:
 * setAuth(token, user);
 *
 * // Gọi API:
 * const res = await api.get("/instructor/overview");
 *
 * // Upload:
 * await apiUpload("/lessons", { title, video: file }, "post");
 *
 * // Logout:
 * clearAuth();
 */
