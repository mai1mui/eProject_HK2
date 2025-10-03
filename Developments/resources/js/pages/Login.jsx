import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import "../../css/login.css";

export default function Login() {
    // ================== State ==================
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [message, setMessage] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // [ADD] loading
    const [capsLockOn, setCapsLockOn] = useState(false); // [ADD] caps lock
    const [emailError, setEmailError] = useState(""); // [ADD] validate
    const [passwordError, setPasswordError] = useState(""); // [ADD] validate

    const navigate = useNavigate();
    const [params] = useSearchParams();
    const next = params.get("next");

    // ================== API client (cục bộ) ==================
    const api = useMemo(() => {
        const instance = axios.create({
            baseURL:
                import.meta?.env?.VITE_API_URL || "http://127.0.0.1:8000/api",
            headers: { Accept: "application/json" },
        });
        instance.interceptors.request.use((cfg) => {
            const t = localStorage.getItem("token");
            if (t) cfg.headers.Authorization = `Bearer ${t}`;
            return cfg;
        });
        return instance;
    }, []);

    // ================== Effects ==================
    useEffect(() => {
        const savedEmail = localStorage.getItem("remember_email");
        if (savedEmail) {
            setEmail(savedEmail);
            setRemember(true);
        }
    }, []);

    // ================== Helpers ==================
    const safeNext = useMemo(() => {
        // [ADD] Chỉ cho phép next là path nội bộ (bắt đầu bằng "/")
        if (!next) return null;
        try {
            const url = new URL(next, window.location.origin);
            if (url.origin === window.location.origin && next.startsWith("/")) {
                return next;
            }
        } catch (_) {}
        return null;
    }, [next]);

    const validate = () => {
        let ok = true;
        setEmailError("");
        setPasswordError("");

        // Email cơ bản
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
        if (!emailOk) {
            setEmailError("Email không hợp lệ.");
            ok = false;
        }
        // Mật khẩu tối thiểu
        if (!password || password.length < 4) {
            setPasswordError("Mật khẩu tối thiểu 4 ký tự.");
            ok = false;
        }
        return ok;
    };

    const normalizeRole = (u) =>
        (u?.ARole ?? u?.role ?? "").toString().trim().toLowerCase();

    const routeByRole = {
        admin: "/admin",
        instructor: "/instructor",
        learner: "/learner",
    };

    // ================== Handlers ==================
    const handleKeyUpPassword = (e) => {
        // [ADD] phát hiện CapsLock
        // eslint-disable-next-line no-unsafe-optional-chaining
        if (e?.getModifierState) {
            setCapsLockOn(e.getModifierState("CapsLock"));
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!validate()) return;

        try {
            setIsLoading(true);

            // Xoá token/user cũ
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            const res = await api.post("/login", {
                email: String(email || "").trim(),
                password,
            });

            const { token, user } = res.data || {};
            if (!token || !user) {
                throw new Error("Dữ liệu đăng nhập không hợp lệ.");
            }

            // Lưu token và user
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            axios.defaults.headers.common.Authorization = `Bearer ${token}`; // vẫn set global để tương thích code cũ

            // Remember me
            if (remember) {
                localStorage.setItem("remember_email", email);
            } else {
                localStorage.removeItem("remember_email");
            }

            // Chuẩn hoá role + điều hướng
            const rawRole = normalizeRole(user);

            if (rawRole === "learner" && safeNext) {
                // Nếu learner mua khoá học -> quay lại next
                navigate(safeNext, { replace: true });
                return;
            }

            const roleRoute = routeByRole[rawRole] || "/learner";
            navigate(roleRoute, { replace: true });
        } catch (err) {
            console.error(err);
            const apiMsg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Login failed!";
            setMessage(apiMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // ================== Render ==================
    return (
        <div className={`login-wrapper ${isLoading ? "is-loading" : ""}`}>
            <div className="login-left">
                <img
                    src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-2-x1.webp"
                    alt="Login illustration"
                />
            </div>

            <div className="login-right">
                <div
                    className="login-card"
                    role="dialog"
                    aria-labelledby="loginTitle"
                >
                    <h1 id="loginTitle" className="login-title">
                        E-Learning Login
                    </h1>
                    <p className="login-subtitle">
                        Sign in to manage courses and users
                    </p>

                    {/* [ADD] Loading bar nhỏ */}
                    {isLoading && <div className="login-loading-bar" />}

                    {/* Thông báo lỗi (giữ nguyên biến message) */}
                    {message && (
                        <p className="login-message" role="alert">
                            {message}
                        </p>
                    )}

                    <form onSubmit={handleLogin} aria-describedby="loginHelp">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className={`form-input ${
                                    emailError ? "has-error" : ""
                                }`}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="username"
                                aria-invalid={!!emailError}
                                aria-describedby={
                                    emailError ? "emailError" : undefined
                                }
                            />
                            {emailError && (
                                <div
                                    id="emailError"
                                    className="input-error-text"
                                >
                                    {emailError}
                                </div>
                            )}
                        </div>

                        {/* Password với icon SVG 👁️ */}
                        <div className="form-group password-group">
                            <label>Password</label>
                            <div
                                className={`password-wrapper ${
                                    passwordError ? "has-error" : ""
                                }`}
                            >
                                <input
                                    type={showPass ? "text" : "password"}
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    onKeyUp={handleKeyUpPassword} // [ADD] detect caps
                                    required
                                    autoComplete="current-password"
                                    aria-invalid={!!passwordError}
                                    aria-describedby={
                                        passwordError || capsLockOn
                                            ? "passwordHint"
                                            : undefined
                                    }
                                />
                                <span
                                    className="toggle-password"
                                    onClick={() => setShowPass(!showPass)}
                                    role="button"
                                    aria-label={
                                        showPass
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPass ? (
                                        // Icon con mắt mở
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="icon"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    ) : (
                                        // Icon con mắt gạch chéo
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="icon"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.64-4.362M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1L18 18"
                                            />
                                        </svg>
                                    )}
                                </span>
                            </div>

                            {/* [ADD] gợi ý lỗi + CapsLock */}
                            {(passwordError || capsLockOn) && (
                                <div
                                    id="passwordHint"
                                    className="input-hint-row"
                                >
                                    {passwordError && (
                                        <span className="input-error-text">
                                            {passwordError}
                                        </span>
                                    )}
                                    {capsLockOn && (
                                        <span className="capslock-hint">
                                            ⚠️ Caps Lock đang bật
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="form-extra">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) =>
                                        setRemember(e.target.checked)
                                    }
                                />{" "}
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="forgot-link">
                                Forgot password?
                            </Link>
                        </div>

                        <div className="register-divider">
                            <div className="register-divider-line"></div>
                            <span className="register-divider-text">
                                Or sign up with
                            </span>
                            <div className="register-divider-line"></div>
                        </div>

                        {/* Social login (nút để sẵn – backend tuỳ bạn) */}
                        <div className="register-social">
                            <button
                                type="button"
                                className="register-social-btn"
                                title="Continue with Google"
                                onClick={() =>
                                    setMessage(
                                        "Google OAuth chưa được cấu hình."
                                    )
                                }
                            >
                                <img
                                    src="https://www.svgrepo.com/show/355037/google.svg"
                                    alt="Google"
                                />
                            </button>
                            <button
                                type="button"
                                className="register-social-btn facebook"
                                title="Continue with Facebook"
                                onClick={() =>
                                    setMessage(
                                        "Facebook OAuth chưa được cấu hình."
                                    )
                                }
                            >
                                <img
                                    src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                                    alt="Facebook"
                                />
                            </button>
                            <button
                                type="button"
                                className="register-social-btn apple"
                                title="Continue with Apple"
                                onClick={() =>
                                    setMessage(
                                        "Apple Sign in chưa được cấu hình."
                                    )
                                }
                            >
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                                    alt="Apple"
                                />
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={isLoading} // [ADD] chặn spam
                            aria-busy={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Login"}
                        </button>
                        <div id="loginHelp" className="sr-only">
                            Press Enter to submit.
                        </div>
                    </form>

                    <div className="login-links">
                        Don’t have an account?
                        <Link to="/register"> Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
