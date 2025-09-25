import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "../../css/AdminDashboard.css";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [showSuggest, setShowSuggest] = useState(false);

    // 🔔 Notifications
    const [notifCount, setNotifCount] = useState(0);
    const [notifList, setNotifList] = useState([]);
    const [openNotif, setOpenNotif] = useState(false);

    // ✉️ Feedback
    const [fbCount, setFbCount] = useState(0);
    const [fbList, setFbList] = useState([]);
    const [openFb, setOpenFb] = useState(false);

    // 🌗 Dark mode
    const [isDark, setIsDark] = useState(true);

    // 👤 Profile dropdown
    const [openProfile, setOpenProfile] = useState(false);
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [openSettingsModal, setOpenSettingsModal] = useState(false);

    // Avatar
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // ảnh preview tạm
    // Refs
    const notifRef = useRef(null);
    const fbRef = useRef(null);
    const profileRef = useRef(null);

    // User state (thay cho đọc thẳng từ localStorage mỗi lần)
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || null;
        } catch {
            return null;
        }
    });

    // Cache-buster cho ảnh thật từ server
    const [avatarTick, setAvatarTick] = useState(0);

    // avatar hiển thị: ưu tiên preview nếu có, nếu không dùng ảnh thật + ?v=...
    const computedAvatarUrl =
        previewUrl ||
        (user?.avatarUrl || user?.AvatarUrl || "storage/avatars/avatar.jpg") +
            (previewUrl ? "" : `?v=${avatarTick}`);

    // dọn preview khi đổi hoặc unmount
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // dark mode
    useEffect(() => {
        if (isDark) document.body.classList.add("dark-mode");
        else document.body.classList.remove("dark-mode");
    }, [isDark]);
    // Khóa cuộn body khi mở modal Activity Log

    const isActive = (path) => location.pathname.startsWith(path);

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://127.0.0.1:8000/api/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    // Search
    const handleSearch = async () => {
        if (searchTerm.trim().length < 2) {
            setResults([]);
            setShowSuggest(false);
            return;
        }
        try {
            const res = await axios.get(
                `http://127.0.0.1:8000/api/search?query=${searchTerm}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            setResults(res.data);
            setShowSuggest(true);
        } catch (err) {
            console.error("Search error:", err);
        }
    };

    const handleSelect = (path) => {
        setSearchTerm("");
        setResults([]);
        setShowSuggest(false);
        navigate(path);
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
        }),
    };

    // 🔔 Fetch notifications (polling 10s)
    useEffect(() => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const fetchNotifications = async () => {
            try {
                const res1 = await axios.get(
                    "http://127.0.0.1:8000/api/notifications",
                    { headers }
                );
                setNotifCount(res1.data.unread || 0);
                setNotifList(res1.data.items || []);

                const res2 = await axios.get(
                    "http://127.0.0.1:8000/api/notifications/feedback",
                    { headers }
                );
                setFbCount(res2.data.unread || 0);
                setFbList(res2.data.items || []);
            } catch (err) {
                console.error("Fetch notifications error:", err);
            }
        };

        fetchNotifications();
        const t = setInterval(fetchNotifications, 10000);
        return () => clearInterval(t);
    }, []);

    const markAllRead = async () => {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        await axios.post(
            "http://127.0.0.1:8000/api/notifications/mark-all-read",
            {},
            { headers }
        );
        setNotifCount(0);
        const res = await axios.get("http://127.0.0.1:8000/api/notifications", {
            headers,
        });
        setNotifList(res.data.items || []);
    };

    const markAllFbRead = async () => {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        await axios.post(
            "http://127.0.0.1:8000/api/notifications/feedback/mark-all-read",
            {},
            { headers }
        );
        setFbCount(0);
        const res = await axios.get(
            "http://127.0.0.1:8000/api/notifications/feedback",
            { headers }
        );
        setFbList(res.data.items || []);
    };

    const markSingleAndNavigate = async (id, link, isFeedback = false) => {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        try {
            await axios.post(
                `http://127.0.0.1:8000/api/notifications/${id}/read`,
                {},
                { headers }
            );
            if (isFeedback) {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/notifications/feedback",
                    { headers }
                );
                setFbList(res.data.items || []);
                setFbCount(res.data.unread || 0);
            } else {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/notifications",
                    { headers }
                );
                setNotifList(res.data.items || []);
                setNotifCount(res.data.unread || 0);
            }
            navigate(link);
        } catch (err) {
            console.error("Mark single read error:", err);
            navigate(link); // fallback
        }
    };

    // Click outside để đóng dropdowns
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setOpenNotif(false);
            }
            if (fbRef.current && !fbRef.current.contains(e.target)) {
                setOpenFb(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setOpenProfile(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // === Format CreatedAt an toàn ===
    const rawCreatedAt =
        user?.CreatedAt ?? user?.created_at ?? user?.createdAt ?? null;

    const toDisplayDate = (s) => {
        if (!s) return "-";
        const isoish =
            typeof s === "string" && s.includes(" ") ? s.replace(" ", "T") : s;
        const d = new Date(isoish);
        return isNaN(d.getTime()) ? String(s) : d.toLocaleString();
    };

    const displayCreatedAt = toDisplayDate(rawCreatedAt);
    // --- thêm ngay dưới các state khác ---
    const [openActivityModal, setOpenActivityModal] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logPage, setLogPage] = useState(1);
    const [logTotal, setLogTotal] = useState(0);
    const [logPerPage, setLogPerPage] = useState(10);
    const [logLoading, setLogLoading] = useState(false);
    const [logFilter, setLogFilter] = useState(""); // all/login/profile.update/...
    useEffect(() => {
        if (openActivityModal) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
        return () => document.body.classList.remove("modal-open");
    }, [openActivityModal]);
    const fetchMyLogs = async (page = 1, filter = "") => {
        setLogLoading(true);
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            };
            const params = new URLSearchParams();
            params.set("page", page);
            params.set("per_page", logPerPage);
            if (filter) params.set("action", filter);

            const url = `http://127.0.0.1:8000/api/my/activity-logs?${params.toString()}`;
            const res = await axios.get(url, { headers });

            // backend trả kiểu:
            // { data: [], total: 0, per_page: 10, page: 1 }
            setLogs(res.data?.data || []);
            setLogTotal(res.data?.total || 0);
            setLogPerPage(res.data?.per_page || 10);
            setLogPage(res.data?.page || page);
        } catch (e) {
            console.error("Fetch logs error:", e);
        } finally {
            setLogLoading(false);
        }
    };

    const totalPages = Math.max(1, Math.ceil(logTotal / logPerPage));
    return (
        <div className="admin-container">
            {/* Topbar */}
            <header className="topbar">
                <h1 className="system-title">Admin Management</h1>

                {/* SEARCH */}
                <div className="top-search">
                    <input
                        type="text"
                        placeholder="Search accounts, courses, lessons..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                        type="button"
                        aria-label="Search"
                        className="search-btn"
                        onClick={handleSearch}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </button>

                    {showSuggest && results.length > 0 && (
                        <div className="search-suggest">
                            {results.map((r, i) => (
                                <div
                                    key={i}
                                    className="suggest-item"
                                    onClick={() => handleSelect(r.path)}
                                >
                                    <span
                                        className={`pill pill-${r.type?.toLowerCase()}`}
                                    >
                                        {r.type}
                                    </span>
                                    <span className="label">{r.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="profile">
                    {/* 🔔 Notifications */}
                    <div className="notif-wrap" ref={notifRef}>
                        <span
                            className="notification"
                            onClick={() => {
                                setOpenNotif(!openNotif);
                                setOpenFb(false);
                                setOpenProfile(false);
                            }}
                        >
                            🔔 <span className="badge">{notifCount}</span>
                        </span>
                        {openNotif && (
                            <div className="notif-dropdown">
                                <div className="notif-head">
                                    <strong>Notifications</strong>
                                    <button onClick={markAllRead}>
                                        Mark all read
                                    </button>
                                </div>
                                <ul>
                                    {notifList.map((n) => (
                                        <li
                                            key={n.id}
                                            className={
                                                n.read_at ? "read" : "unread"
                                            }
                                        >
                                            <div className="title">
                                                {n.title}
                                            </div>
                                            <div className="msg">
                                                {n.message}
                                            </div>
                                            {n.link && (
                                                <button
                                                    className="open-link"
                                                    onClick={() =>
                                                        markSingleAndNavigate(
                                                            n.id,
                                                            n.link,
                                                            false
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>
                                            )}
                                            <small>
                                                {new Date(
                                                    n.created_at
                                                ).toLocaleString()}
                                            </small>
                                        </li>
                                    ))}
                                    {notifList.length === 0 && (
                                        <li className="empty">
                                            No notifications
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* ✉️ Feedback */}
                    <div className="notif-wrap" ref={fbRef}>
                        <span
                            className="notification mail"
                            onClick={() => {
                                setOpenFb(!openFb);
                                setOpenNotif(false);
                                setOpenProfile(false);
                            }}
                        >
                            ✉️ <span className="badge">{fbCount}</span>
                        </span>
                        {openFb && (
                            <div className="notif-dropdown">
                                <div className="notif-head">
                                    <strong>Feedback</strong>
                                    <button onClick={markAllFbRead}>
                                        Mark all read
                                    </button>
                                </div>
                                <ul>
                                    {fbList.map((n) => (
                                        <li
                                            key={n.id}
                                            className={
                                                n.read_at ? "read" : "unread"
                                            }
                                        >
                                            <div className="title">
                                                {n.title}
                                            </div>
                                            <div className="msg">
                                                {n.message}
                                            </div>
                                            {n.link && (
                                                <button
                                                    className="open-link"
                                                    onClick={() =>
                                                        markSingleAndNavigate(
                                                            n.id,
                                                            n.link,
                                                            true
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>
                                            )}
                                            <small>
                                                {new Date(
                                                    n.created_at
                                                ).toLocaleString()}
                                            </small>
                                        </li>
                                    ))}
                                    {fbList.length === 0 && (
                                        <li className="empty">No feedback</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* 🌗 Dark mode toggle */}
                    <div
                        className={`theme-toggle ${isDark ? "dark" : "light"}`}
                        onClick={() => setIsDark(!isDark)}
                    >
                        <div className="toggle-circle"></div>
                    </div>

                    {/* 👤 Profile dropdown */}
                    <div className="profile-menu" ref={profileRef}>
                        <div
                            className="profile-trigger"
                            onClick={() => {
                                setOpenProfile(!openProfile);
                                setOpenNotif(false);
                                setOpenFb(false);
                            }}
                        >
                            <img
                                src={computedAvatarUrl}
                                alt="avatar"
                                className="avatar"
                            />
                            <span className="username">
                                {user?.AName || "Admin"}
                            </span>
                        </div>

                        {openProfile && (
                            <div className="profile-dropdown">
                                <div className="profile-header">
                                    <img
                                        src={computedAvatarUrl}
                                        alt="avatar"
                                        className="avatar large"
                                    />
                                    <div className="info">
                                        <strong>
                                            {user?.AName || "Admin"}
                                        </strong>
                                        <small>
                                            {user?.Email || "admin@example.com"}
                                        </small>
                                    </div>
                                </div>

                                <ul className="profile-list">
                                    <li
                                        onClick={() => {
                                            setOpenProfileModal(true);
                                            setOpenSettingsModal(false);
                                            setOpenProfile(false);
                                        }}
                                    >
                                        <i className="fas fa-user"></i> Profile
                                    </li>
                                    <li
                                        onClick={() => {
                                            setOpenSettingsModal(true);
                                            setOpenProfileModal(false);
                                            setOpenProfile(false);
                                        }}
                                    >
                                        <i className="fas fa-cog"></i> Settings
                                    </li>
                                    <li
                                        onClick={() => {
                                            setOpenActivityModal(true);
                                            setOpenProfile(false);
                                            setOpenProfileModal(false);
                                            setOpenSettingsModal(false);
                                            // load trang 1 khi mở
                                            fetchMyLogs(1, logFilter);
                                        }}
                                    >
                                        <i className="fas fa-list"></i> Activity
                                        Log
                                    </li>

                                    <hr className="divider" />

                                    <li
                                        onClick={handleLogout}
                                        className="danger"
                                    >
                                        <i className="fas fa-sign-out-alt"></i>{" "}
                                        Logout
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <aside className="sidebar">
                <ul>
                    <li className={isActive("/admin/users") ? "active" : ""}>
                        <Link to="/admin/users">
                            <i className="fas fa-user"></i> Account Management
                        </Link>
                    </li>
                    <li className={isActive("/admin/courses") ? "active" : ""}>
                        <Link to="/admin/courses">
                            <i className="fas fa-book"></i> Course Management
                        </Link>
                    </li>
                    <li className={isActive("/admin/lessons") ? "active" : ""}>
                        <Link to="/admin/lessons">
                            <i className="fas fa-chalkboard-teacher"></i>{" "}
                            Lessons Management
                        </Link>
                    </li>
                    <li
                        className={
                            isActive("/admin/enrollments") ? "active" : ""
                        }
                    >
                        <Link to="/admin/enrollments">
                            <i className="fas fa-clipboard-list"></i>{" "}
                            Enrollments Management
                        </Link>
                    </li>
                    <li
                        className={
                            isActive("/admin/submissions") ? "active" : ""
                        }
                    >
                        <Link to="/admin/submissions">
                            <i className="fas fa-folder-open"></i> Submissions
                            Management
                        </Link>
                    </li>
                    <li className={isActive("/admin/results") ? "active" : ""}>
                        <Link to="/admin/results">
                            <i className="fas fa-check-square"></i> Results
                            Management
                        </Link>
                    </li>
                    <li className={isActive("/admin/feedback") ? "active" : ""}>
                        <Link to="/admin/feedback">
                            <i className="fas fa-comments"></i> Feedback
                            Management
                        </Link>
                    </li>
                    <li className={isActive("/admin/payments") ? "active" : ""}>
                        <Link to="/admin/payments">
                            <i className="fas fa-credit-card"></i> Payments
                            Management
                        </Link>
                    </li>
                    <li className={isActive("/admin/reports") ? "active" : ""}>
                        <Link to="/admin/reports">
                            <i className="fas fa-chart-bar"></i> Reports
                            Management
                        </Link>
                    </li>
                </ul>
            </aside>

            {/* Main */}
            <div className="main">
                <div className="dashboard-content">
                    <section>
                        <h2>Manage Overview</h2>
                        <div className="card-grid">
                            {[
                                { label: "Total Users", value: "1,245" },
                                { label: "Active Courses", value: "32" },
                                { label: "Assignments", value: "87" },
                                { label: "Monthly Revenue", value: "$4,520" },
                            ].map((item, i) => (
                                <motion.div
                                    className="card"
                                    key={i}
                                    custom={i}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow:
                                            "0px 8px 20px rgba(0,0,0,0.25)",
                                    }}
                                >
                                    <p>{item.label}</p>
                                    <h2>{item.value}</h2>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* 🆕 Modal Profile */}
                {openProfileModal && (
                    <div
                        className="modal-overlay"
                        onClick={() => setOpenProfileModal(false)}
                    >
                        <div
                            className="modal-profile"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="profile-header-modal">
                                <img
                                    src={computedAvatarUrl}
                                    alt="avatar"
                                    className="profile-avatar"
                                />
                                <h2>{user?.AName}</h2>
                                <p>{user?.ARole}</p>
                            </div>
                            <div className="profile-info">
                                <div>
                                    <strong>UserID</strong>
                                    <span>{user?.AccountID}</span>
                                </div>
                                <div>
                                    <strong>Email</strong>
                                    <span>{user?.Email}</span>
                                </div>
                                <div>
                                    <strong>Role</strong>
                                    <span>{user?.ARole}</span>
                                </div>
                                <div>
                                    <strong>Status</strong>
                                    <span
                                        className={
                                            user?.AStatus === "Active"
                                                ? "active"
                                                : "inactive"
                                        }
                                    >
                                        {user?.AStatus}
                                    </span>
                                </div>
                                <div>
                                    <strong>Date Created</strong>
                                    <span>{displayCreatedAt}</span>
                                </div>
                            </div>
                            <div className="profile-actions">
                                <button
                                    className="btn-close"
                                    onClick={() => setOpenProfileModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Settings */}
                {openSettingsModal && (
                    <div
                        className="modal-overlay"
                        onClick={() => setOpenSettingsModal(false)}
                    >
                        <div
                            className="modal-profile wide"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="profile-header-modal">
                                <h2>Account Settings</h2>
                                <p>
                                    Manage your personal information and
                                    password
                                </p>
                            </div>

                            <form
                                className="settings-form"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);

                                    // gom dữ liệu form
                                    const payload = {
                                        AName: formData.get("AName"),
                                        Email: formData.get("Email"),
                                        new_password:
                                            formData.get("new_password"),
                                        new_password_confirmation: formData.get(
                                            "new_password_confirmation"
                                        ),
                                    };

                                    // password không bắt buộc
                                    if (!payload.new_password) {
                                        delete payload.new_password;
                                        delete payload.new_password_confirmation;
                                    }

                                    try {
                                        // 1) Nếu có file ảnh -> upload trước
                                        let uploadedAvatarUrl = null;
                                        if (avatarFile) {
                                            try {
                                                const fd = new FormData();
                                                fd.append("avatar", avatarFile);

                                                const avatarRes =
                                                    await axios.post(
                                                        `http://127.0.0.1:8000/api/accounts/${user?.AccountID}/avatar`,
                                                        fd,
                                                        {
                                                            headers: {
                                                                "Content-Type":
                                                                    "multipart/form-data",
                                                                Authorization: `Bearer ${localStorage.getItem(
                                                                    "token"
                                                                )}`,
                                                            },
                                                        }
                                                    );

                                                uploadedAvatarUrl =
                                                    avatarRes.data?.url || null; // URL ảnh thật từ server
                                            } catch (uploadErr) {
                                                console.error(
                                                    "Upload avatar failed:",
                                                    uploadErr
                                                );
                                                alert("Upload avatar failed!");
                                                // Không return; vẫn cho phép cập nhật các field khác nếu có
                                            }
                                        }

                                        // 2) Xác định có cần gọi PUT không (chỉ khi AName/Email hoặc password có thay đổi)
                                        const body = {};
                                        if (
                                            payload.AName &&
                                            payload.AName !== user?.AName
                                        )
                                            body.AName = payload.AName;
                                        if (
                                            payload.Email &&
                                            payload.Email !== user?.Email
                                        )
                                            body.Email = payload.Email;
                                        if (payload.new_password) {
                                            body.new_password =
                                                payload.new_password;
                                            body.new_password_confirmation =
                                                payload.new_password_confirmation;
                                        }

                                        // 3) Nếu có trường cần cập nhật -> gọi PUT, ngược lại bỏ qua (avatar-only)
                                        let serverUser = null;
                                        if (Object.keys(body).length > 0) {
                                            const res = await axios.put(
                                                `http://127.0.0.1:8000/api/accounts/${user?.AccountID}`,
                                                body,
                                                {
                                                    headers: {
                                                        Authorization: `Bearer ${localStorage.getItem(
                                                            "token"
                                                        )}`,
                                                    },
                                                }
                                            );
                                            alert(
                                                res.data?.message ||
                                                    "Profile updated successfully!"
                                            );
                                            serverUser =
                                                res.data?.user ??
                                                res.data?.account ??
                                                null;
                                        } else {
                                            // Không có gì để PUT => nếu vừa upload avatar thì vẫn báo OK
                                            if (uploadedAvatarUrl) {
                                                alert(
                                                    "Avatar updated successfully!"
                                                );
                                            } else {
                                                alert("No changes.");
                                            }
                                        }

                                        // 4) Cập nhật user local: ưu tiên serverUser; nếu không có thì merge thủ công
                                        const updatedUser = serverUser ?? {
                                            ...user,
                                            ...(body.AName
                                                ? { AName: body.AName }
                                                : {}),
                                            ...(body.Email
                                                ? { Email: body.Email }
                                                : {}),
                                            ...(uploadedAvatarUrl
                                                ? {
                                                      avatarUrl:
                                                          uploadedAvatarUrl,
                                                  }
                                                : {}),
                                            CreatedAt:
                                                user?.CreatedAt ??
                                                user?.created_at ??
                                                user?.createdAt ??
                                                null,
                                        };

                                        setUser(updatedUser);
                                        localStorage.setItem(
                                            "user",
                                            JSON.stringify(updatedUser)
                                        );

                                        // 5) Nếu có avatar mới -> bust cache + dọn preview/file
                                        if (uploadedAvatarUrl) {
                                            // cho tất cả nơi hiển thị ảnh tải lại
                                            // (vì computed URL đang thêm ?v=avatarTick)
                                            // => chỉ cần tăng tick
                                            setAvatarTick((t) => t + 1);
                                        }
                                        if (previewUrl) {
                                            URL.revokeObjectURL(previewUrl);
                                            setPreviewUrl(null);
                                        }
                                        setAvatarFile(null);

                                        setOpenSettingsModal(false);
                                    } catch (err) {
                                        console.error(err);
                                        alert(
                                            err.response?.data?.message ||
                                                "Update failed!"
                                        );
                                    }
                                }}
                            >
                                {/* Avatar */}
                                <div className="settings-avatar">
                                    <img src={computedAvatarUrl} alt="avatar" />
                                    <label className="upload-btn">
                                        Change
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0];
                                                if (!f) return;
                                                setAvatarFile(f);
                                                const url =
                                                    URL.createObjectURL(f);
                                                if (previewUrl)
                                                    URL.revokeObjectURL(
                                                        previewUrl
                                                    );
                                                setPreviewUrl(url);
                                                e.target.value = ""; // cho phép chọn lại cùng 1 file
                                            }}
                                        />
                                    </label>
                                </div>

                                {/* Personal info */}
                                <div className="form-section">
                                    <h3>Personal Information</h3>
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="AName"
                                            defaultValue={user?.AName}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="Email"
                                            defaultValue={user?.Email}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password change */}
                                <div className="form-section">
                                    <h3>Change Password</h3>
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            name="new_password"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm Password</label>
                                        <input
                                            type="password"
                                            name="new_password_confirmation"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="profile-actions">
                                    <button type="submit" className="btn-save">
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => {
                                            // nếu đóng modal khi đang có preview → dọn bộ nhớ
                                            if (previewUrl) {
                                                URL.revokeObjectURL(previewUrl);
                                                setPreviewUrl(null);
                                            }
                                            setAvatarFile(null);
                                            setOpenSettingsModal(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* Modal Activity Log (một khối duy nhất) */}
                {openActivityModal && (
                    <div
                        className="modal-overlay"
                        onClick={() => setOpenActivityModal(false)}
                    >
                        <div
                            className="modal-profile" // nhỏ gọn giống Profile modal (không .wide)
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="profile-header-modal">
                                <h2>Activity Log</h2>
                                <p>Nhật ký thao tác của bạn</p>
                            </div>

                            {/* Toolbar lọc + tổng số */}
                            <div className="activity-toolbar">
                                <select
                                    value={logFilter}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setLogFilter(val);
                                        fetchMyLogs(1, val); // load trang 1 theo filter mới
                                    }}
                                >
                                    <option value="">All actions</option>
                                    <option value="login">Login</option>
                                    <option value="logout">Logout</option>
                                    <option value="avatar.update">
                                        Avatar Updated
                                    </option>
                                    <option value="profile.update">
                                        Profile Updated
                                    </option>
                                    <option value="password.reset">
                                        Password Reset
                                    </option>
                                </select>

                                <span className="activity-count">
                                    {logTotal} records
                                </span>
                            </div>

                            {/* Danh sách log */}
                            <div className="log-list">
                                {logLoading ? (
                                    <div className="log-empty">Loading...</div>
                                ) : logs.length === 0 ? (
                                    <div className="log-empty">No activity</div>
                                ) : (
                                    <div className="log-grid">
                                        {logs.map((item) => (
                                            <div
                                                key={item.id}
                                                className="log-item"
                                            >
                                                <div className="log-row">
                                                    <span
                                                        className={`log-badge ${String(
                                                            item.action
                                                        ).replace(/\./g, "-")}`}
                                                    >
                                                        {item.action}
                                                    </span>
                                                    <span className="log-time">
                                                        {new Date(
                                                            item.created_at
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>

                                                {item.meta && (
                                                    <pre className="log-meta">
                                                        {typeof item.meta ===
                                                        "string"
                                                            ? item.meta
                                                            : JSON.stringify(
                                                                  item.meta,
                                                                  null,
                                                                  2
                                                              )}
                                                    </pre>
                                                )}

                                                <div className="log-aux">
                                                    {item.ip && (
                                                        <span className="log-chip">
                                                            IP: {item.ip}
                                                        </span>
                                                    )}
                                                    {item.agent && (
                                                        <span
                                                            className="log-chip log-agent"
                                                            title={item.agent}
                                                        >
                                                            Agent: {item.agent}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Phân trang */}
                            <div className="activity-paging">
                                <button
                                    type="button"
                                    className="btn-pager"
                                    disabled={logPage <= 1 || logLoading}
                                    onClick={() =>
                                        fetchMyLogs(logPage - 1, logFilter)
                                    }
                                >
                                    ← Prev
                                </button>
                                <span className="page-indicator">
                                    Page {logPage} /{" "}
                                    {Math.max(
                                        1,
                                        Math.ceil(logTotal / logPerPage)
                                    )}
                                </span>
                                <button
                                    type="button"
                                    className="btn-pager"
                                    disabled={
                                        logPage >=
                                            Math.max(
                                                1,
                                                Math.ceil(logTotal / logPerPage)
                                            ) || logLoading
                                    }
                                    onClick={() =>
                                        fetchMyLogs(logPage + 1, logFilter)
                                    }
                                >
                                    Next →
                                </button>
                            </div>

                            <div className="profile-actions">
                                <button
                                    className="btn-close"
                                    onClick={() => setOpenActivityModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
