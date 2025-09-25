import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/register.css"; // import css mới

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [role, setRole] = useState("Learner"); // mặc định Learner

    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        if (pwd !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/register`, {
                AccountID: "ACC" + Date.now(),
                AName: name,
                Email: email,
                Pass: pwd,
                ARole: role, // Learner hoặc Instructor
                AStatus: "Active", // ai đăng ký cũng mặc định Active (có thể login)
                ApprovalStatus: role === "Instructor" ? "Pending" : "Approved",
            });
            const msg = res.data.message || "Registration successful!";
            localStorage.setItem("register_success", msg);
            navigate("/"); // đăng ký xong → Home
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="register-wrapper">
            {/* Left illustration */}
            <div className="register-left">
                <img
                    src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-2-x1.webp"
                    alt="Register illustration"
                />
            </div>

            {/* Right form */}
            <div className="register-right">
                <div className="register-card">
                    <h1 className="register-title">E-Learning Register</h1>
                    <p className="register-subtitle">
                        Create an account to start learning
                    </p>

                    <form onSubmit={handleRegister}>
                        <input
                            type="text"
                            className="register-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            required
                        />
                        <input
                            type="email"
                            className="register-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />

                        {/* Password field */}
                        <div className="password-wrapper">
                            <input
                                type={showPwd ? "text" : "password"}
                                className="register-input"
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                                placeholder="Password"
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPwd(!showPwd)}
                            >
                                {showPwd ? (
                                    // 👁️ con mắt mở
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
                                    // 🙈 con mắt gạch chéo
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

                        {/* Confirm password */}
                        <div className="password-wrapper">
                            <input
                                type={showConfirm ? "text" : "password"}
                                className="register-input"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="Confirm Password"
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? (
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
                        {/* Role selection (Learner / Instructor) */}
                        <select
                            className="register-input"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="Learner">Learner</option>
                            <option value="Instructor">Instructor</option>
                        </select>
                        {error && <p className="register-message">{error}</p>}
                        <button type="submit" className="register-btn">
                            Register
                        </button>
                    </form>

                    {/* Divider */}
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

                    <p className="register-footer">
                        Already have an account?
                        <Link to="/login"> Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
