import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../css/login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [message, setMessage] = useState("");
    const [showPass, setShowPass] = useState(false); // 👀 trạng thái ẩn/hiện
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem("remember_email");
        if (savedEmail) {
            setEmail(savedEmail);
            setRemember(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // 🆕 Xóa token/user cũ trước khi login mới
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            const res = await axios.post("http://127.0.0.1:8000/api/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            if (remember) {
                localStorage.setItem("remember_email", email);
            } else {
                localStorage.removeItem("remember_email");
            }

            // 🆕 Điều hướng theo role (Admin, Instructor, Learner)
            if (res.data.user.ARole === "Admin") {
                navigate("/admin");
            } else if (res.data.user.ARole === "Instructor") {
                navigate("/instructor"); // sau này bạn tạo route Instructor
            } else {
                navigate("/learner"); // sau này bạn tạo route Learner
            }
        } catch (err) {
            console.error(err);

            // 🆕 Xử lý lỗi rõ ràng hơn
            if (err.response) {
                setMessage(err.response.data.message || "Login failed!");
            } else {
                setMessage("Server error, please try again later.");
            }
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-left">
                <img
                    src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-2-x1.webp"
                    alt="Login illustration"
                />
            </div>

            <div className="login-right">
                <div className="login-card">
                    <h1 className="login-title">E-Learning Login</h1>
                    <p className="login-subtitle">
                        Sign in to manage courses and users
                    </p>

                    {message && <p className="login-message">{message}</p>}

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password với icon SVG 👁️ */}
                        <div className="form-group password-group">
                            <label>Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPass ? "text" : "password"}
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                                <span
                                    className="toggle-password"
                                    onClick={() => setShowPass(!showPass)}
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

                        {/* Social login */}
                        <div className="register-social">
                            <button className="register-social-btn">
                                <img
                                    src="https://www.svgrepo.com/show/355037/google.svg"
                                    alt="Google"
                                />
                            </button>
                            <button className="register-social-btn facebook">
                                <img
                                    src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                                    alt="Facebook"
                                />
                            </button>
                            <button className="register-social-btn apple">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                                    alt="Apple"
                                />
                            </button>
                        </div>
                        <button type="submit" className="login-btn">
                            Login
                        </button>
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
