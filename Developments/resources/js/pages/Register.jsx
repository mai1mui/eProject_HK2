import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/register.css";

/* ====== Eye icon button (hiện/ẩn mật khẩu) ====== */
function EyeToggleButton({
    shown,
    onClick,
    labelShown = "Hide password",
    labelHidden = "Show password",
}) {
    return (
        <button
            type="button"
            className="toggle-password"
            aria-label={shown ? labelShown : labelHidden}
            onClick={onClick}
        >
            {shown ? (
                // eye-off (lucide-like)
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M3 3l18 18" />
                    <path d="M10.73 5.08A10.78 10.78 0 0 1 12 5c7 0 10 7 10 7a14.5 14.5 0 0 1-2.36 3.35" />
                    <path d="M6.61 6.61A14.5 14.5 0 0 0 2 12s3 7 10 7a10.7 10.7 0 0 0 4.39-.9" />
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                </svg>
            ) : (
                // eye
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            )}
        </button>
    );
}

/* ====== Helpers ====== */
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const pwdReqs = (p = "") => ({
    len: /.{8,}/.test(p),
    up: /[A-Z]/.test(p),
    low: /[a-z]/.test(p),
    num: /\d/.test(p),
    sp: /[^A-Za-z0-9]/.test(p),
});
const pwdScore = (p = "") => Object.values(pwdReqs(p)).filter(Boolean).length;

export default function Register() {
    const navigate = useNavigate();

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [confirm, setConfirm] = useState("");
    const [agree, setAgree] = useState(false);
    const [marketing, setMarketing] = useState(false);

    // UI state
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Error state
    const [formError, setFormError] = useState("");
    const [fieldErr, setFieldErr] = useState({});

    // Derived
    const reqs = useMemo(() => pwdReqs(pwd), [pwd]);
    const score = useMemo(() => pwdScore(pwd), [pwd]);

    const validate = () => {
        const errs = {};
        if (!name.trim()) errs.name = "Please enter your full name.";
        if (!email.trim()) errs.email = "Please enter your email.";
        if (!pwd) errs.pwd = "Please enter your password.";
        if (pwd && score < 3) errs.pwd = "Password is too weak.";
        if (pwd !== confirm) errs.confirm = "Passwords do not match.";
        if (!agree)
            errs.agree = "You must agree to the Terms and Privacy Policy.";
        setFieldErr(errs);
        return Object.keys(errs).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setFormError("");
        if (!validate()) return;

        try {
            setLoading(true);
            await axios.post(`${API_URL}/register`, {
                // KHÔNG gửi AccountID từ client; để server sinh
                AName: name,
                Email: email,
                Pass: pwd,
                ARole: "Learner", // khóa Learner
                AStatus: "Active",
                ApprovalStatus: "Approved", // Learner auto approved
                email_marketing_consent: !!marketing,
            });

            localStorage.setItem(
                "register_success",
                "Registration successful! Please verify your email."
            );
            navigate("/verify-email", { state: { email } });
        } catch (err) {
            setFormError(err?.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-wrapper">
            {/* Left illustration */}
            <div className="register-left">
                <img
                    src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-2-x1.webp"
                    alt="Register illustration"
                    loading="lazy"
                />
            </div>

            {/* Right form */}
            <div className="register-right">
                <div className="register-card">
                    <h1 className="register-title">
                        Create your learner account
                    </h1>
                    <p className="register-subtitle">
                        Start learning with our e-learning platform
                    </p>

                    <form onSubmit={handleRegister} noValidate>
                        <div className="form-grid">
                            {/* Full name */}
                            <div className="form-item">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    id="fullName"
                                    name="name"
                                    type="text"
                                    className={`register-input ${
                                        fieldErr.name ? "invalid" : ""
                                    }`}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                    required
                                    aria-invalid={!!fieldErr.name}
                                    aria-describedby={
                                        fieldErr.name ? "err-name" : undefined
                                    }
                                />
                                {fieldErr.name && (
                                    <small
                                        id="err-name"
                                        className="field-error"
                                    >
                                        {fieldErr.name}
                                    </small>
                                )}
                            </div>

                            {/* Email */}
                            <div className="form-item">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className={`register-input ${
                                        fieldErr.email ? "invalid" : ""
                                    }`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                    aria-invalid={!!fieldErr.email}
                                    aria-describedby={
                                        fieldErr.email ? "err-email" : undefined
                                    }
                                />
                                {fieldErr.email && (
                                    <small
                                        id="err-email"
                                        className="field-error"
                                    >
                                        {fieldErr.email}
                                    </small>
                                )}
                            </div>

                            {/* Password */}
                            <div className="form-item">
                                <label htmlFor="pwd">Password</label>
                                <div
                                    className={`password-wrapper ${
                                        fieldErr.pwd ? "invalid" : ""
                                    }`}
                                >
                                    <input
                                        id="pwd"
                                        name="pwd"
                                        type={showPwd ? "text" : "password"}
                                        className="register-input"
                                        value={pwd}
                                        onChange={(e) => setPwd(e.target.value)}
                                        autoComplete="new-password"
                                        required
                                        aria-invalid={!!fieldErr.pwd}
                                        aria-describedby="pwd-reqs"
                                    />
                                    <EyeToggleButton
                                        shown={showPwd}
                                        onClick={() => setShowPwd((v) => !v)}
                                    />
                                </div>
                                {fieldErr.pwd && (
                                    <small className="field-error">
                                        {fieldErr.pwd}
                                    </small>
                                )}
                            </div>

                            {/* Confirm password */}
                            <div className="form-item">
                                <label htmlFor="confirm">
                                    Confirm Password
                                </label>
                                <div
                                    className={`password-wrapper ${
                                        fieldErr.confirm ? "invalid" : ""
                                    }`}
                                >
                                    <input
                                        id="confirm"
                                        name="confirm"
                                        type={showConfirm ? "text" : "password"}
                                        className="register-input"
                                        value={confirm}
                                        onChange={(e) =>
                                            setConfirm(e.target.value)
                                        }
                                        autoComplete="new-password"
                                        required
                                        aria-invalid={!!fieldErr.confirm}
                                    />
                                    <EyeToggleButton
                                        shown={showConfirm}
                                        onClick={() =>
                                            setShowConfirm((v) => !v)
                                        }
                                    />
                                </div>
                                {fieldErr.confirm && (
                                    <small className="field-error">
                                        {fieldErr.confirm}
                                    </small>
                                )}
                            </div>

                            {/* Password checklist + meter (full width) */}
                            <div className="span-2">
                                <div className="pwd-reqs" id="pwd-reqs">
                                    <small className={reqs.len ? "ok" : ""}>
                                        • ≥ 8 characters
                                    </small>
                                    <small className={reqs.up ? "ok" : ""}>
                                        • Uppercase
                                    </small>
                                    <small className={reqs.low ? "ok" : ""}>
                                        • Lowercase
                                    </small>
                                    <small className={reqs.num ? "ok" : ""}>
                                        • Number
                                    </small>
                                    <small className={reqs.sp ? "ok" : ""}>
                                        • Special symbol
                                    </small>
                                </div>
                                <div
                                    className={`pwd-meter s${score}`}
                                    aria-hidden
                                />
                            </div>

                            {/* Role (read-only) */}
                            <div className="form-item">
                                <label>Role</label>
                                <input
                                    className="register-input"
                                    value="Learner"
                                    readOnly
                                />
                                <small className="hint">
                                    Role is fixed to Learner.
                                </small>
                            </div>

                            {/* Terms + Marketing */}
                            <div className="form-item">
                                <label
                                    className={`agree-row ${
                                        fieldErr.agree ? "invalid" : ""
                                    }`}
                                >
                                    <input
                                        name="agree"
                                        type="checkbox"
                                        checked={agree}
                                        onChange={(e) =>
                                            setAgree(e.target.checked)
                                        }
                                        required
                                    />
                                    <span>
                                        I agree to the{" "}
                                        <Link to="/terms" target="_blank">
                                            Terms
                                        </Link>{" "}
                                        and{" "}
                                        <Link to="/privacy" target="_blank">
                                            Privacy Policy
                                        </Link>
                                        .
                                    </span>
                                </label>
                                <label className="marketing-row">
                                    <input
                                        type="checkbox"
                                        checked={marketing}
                                        onChange={(e) =>
                                            setMarketing(e.target.checked)
                                        }
                                    />
                                    <span>
                                        Send me updates about new courses &
                                        promotions
                                    </span>
                                </label>
                            </div>

                            {/* Error chung */}
                            {formError && (
                                <p className="register-message span-2">
                                    {formError}
                                </p>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                className="register-btn span-2"
                                disabled={loading || !agree}
                            >
                                {loading
                                    ? "Creating account…"
                                    : "Create account"}
                            </button>

                            {/* Divider + Social */}
                            <div className="register-divider span-2">
                                <div className="register-divider-line"></div>
                                <span className="register-divider-text">
                                    Or continue with
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

                            <p className="register-footer span-2">
                                Already have an account?
                                <Link to="/login"> Login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
