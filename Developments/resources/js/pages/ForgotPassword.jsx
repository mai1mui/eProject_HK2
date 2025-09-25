import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../css/forgot.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await axios.post(`${API_URL}/reset-password`, {
                Email: email,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error occurred");
        }
    };

    return (
        <div className="forgot-wrapper">
            {/* Left illustration */}
            <div className="forgot-left">
                <img
                    src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-2-x1.webp"
                    alt="Forgot illustration"
                />
            </div>

            {/* Right form */}
            <div className="forgot-right">
                <div className="forgot-card">
                    <h1 className="forgot-title">Reset Password</h1>
                    <p className="forgot-subtitle">
                        Enter your email and new password
                    </p>

                    {message && <p className="forgot-message">{message}</p>}

                    <form onSubmit={handleSubmit} className="forgot-form">
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

                        {/* New password */}
                        <div className="form-group password-group">
                            <label>New Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    className="form-input"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    required
                                />
                                <span
                                    className="toggle-password"
                                    onClick={() =>
                                        setShowNewPassword(!showNewPassword)
                                    }
                                >
                                    {showNewPassword ? (
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
                        </div>

                        {/* Confirm password */}
                        <div className="form-group password-group">
                            <label>Confirm New Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="form-input"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />
                                <span
                                    className="toggle-password"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword ? (
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
                        </div>

                        <button type="submit" className="btn forgot-btn">
                            Reset Password
                        </button>
                    </form>

                    <div className="forgot-links">
                        <Link to="/login">Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
