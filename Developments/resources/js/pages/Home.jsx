import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeNav from "./HomeNav";
import s from "../../css/Home.module.css";

/* Tiny inline icons */
const StarSolid = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3l2.9 6.1 6.6.9-4.8 4.6 1.2 6.5L12 18.7 6.1 21l1.2-6.5L2.5 10l6.6-.9L12 3z" />
    </svg>
);
const BookMini = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
            d="M4 5h11a3 3 0 013 3v11H7a3 3 0 01-3-3V5z"
            stroke="currentColor"
            strokeWidth="1.6"
        />
        <path
            d="M4 5h11v11H7a3 3 0 01-3-3V5z"
            stroke="currentColor"
            strokeWidth="1.6"
        />
    </svg>
);
const LockMini = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect
            x="4"
            y="10"
            width="16"
            height="10"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
        />
        <path
            d="M8 10V8a4 4 0 118 0v2"
            stroke="currentColor"
            strokeWidth="1.6"
        />
    </svg>
);
const Users = () => (
    <svg className={s.icon} viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path
            d="M15 11a3 3 0 100-6 3 3 0 000 6z"
            stroke="currentColor"
            strokeWidth="1.6"
        />
        <path
            d="M2.8 19a6.2 6.2 0 0112.4 0"
            stroke="currentColor"
            strokeWidth="1.6"
        />
        <path
            d="M14.8 16.5A5 5 0 0121.2 19"
            stroke="currentColor"
            strokeWidth="1.6"
        />
    </svg>
);
const Pen = () => (
    <svg className={s.icon} viewBox="0 0 24 24" fill="none">
        <path
            d="M13 6l5 5-8 8H5v-5l8-8z"
            stroke="currentColor"
            strokeWidth="1.6"
        />
    </svg>
);
const Shield = () => (
    <svg className={s.icon} viewBox="0 0 24 24" fill="none">
        <path
            d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z"
            stroke="currentColor"
            strokeWidth="1.6"
        />
    </svg>
);

export default function HomeUltra() {
    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme") || "dark"
    );
    useEffect(() => {
        document.body.classList.toggle("light", theme === "light");
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <div className={s.page}>
            {/* NAV */}
            <HomeNav theme={theme}onToggleTheme={() => setTheme(t => (t === "dark" ? "light" : "dark"))}/>
            {/* HERO */}
            <main className={`${s.container} ${s.hero}`}>
                <section>
                    <div className={s.badges}>
                        <span className={s.badge}>Fast</span>
                        <span className={s.badge}>Secure</span>
                        <span className={s.badge}>Accessible</span>
                    </div>

                    <h1 className={s.title}>E-Learning Management System</h1>
                    <p className={s.subtitle}>
                        Learn, teach, and manage courses in one modern platform.
                    </p>

                    <div className={s.cta}>
                        <Link className={`${s.btn} ${s.primary}`} to="/login">
                            Login
                        </Link>
                        <Link
                            className={`${s.btn} ${s.primary}`}
                            to="/register"
                        >
                            Register
                        </Link>
                        <Link className={`${s.btn} ${s.primary}`} to="/courses">
                            View Public Courses
                        </Link>
                    </div>

                    {/* Metrics */}
                    <div className={s.metrics}>
                        <div className={s.metric}>
                            <div className={`${s.metricIcon} ${s.gold}`}>
                                <StarSolid />
                            </div>
                            <div className={s.metricText}>
                                <div className={s.metricVal}>4.9★</div>
                                <div className={s.metricLabel}>
                                    student rating
                                </div>
                            </div>
                        </div>
                        <div className={s.metric}>
                            <div className={s.metricIcon}>
                                <BookMini />
                            </div>
                            <div className={s.metricText}>
                                <div className={s.metricVal}>120+</div>
                                <div className={s.metricLabel}>courses</div>
                            </div>
                        </div>
                        <div className={s.metric}>
                            <div className={s.metricIcon}>
                                <LockMini />
                            </div>
                            <div className={s.metricText}>
                                <div className={s.metricVal}>SSO & 2FA</div>
                                <div className={s.metricLabel}>
                                    enterprise-ready
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature panel */}
                <aside className={s.panel} aria-label="Feature preview">
                    <div className={s.grid}>
                        <article className={s.card}>
                            <div className={s.cardHeader}>
                                <span className={s.kicker}>ADMIN</span>
                                <Users />
                            </div>
                            <div className={s.divider} />
                            <h3>User &amp; Course Management</h3>
                            <p>
                                Create roles, approve instructors, manage
                                catalog.
                            </p>
                        </article>
                        <article className={s.card}>
                            <div className={s.cardHeader}>
                                <span className={s.kicker}>TEACHER</span>
                                <Pen />
                            </div>
                            <div className={s.divider} />
                            <h3>Create Lessons &amp; Grade</h3>
                            <p>
                                Build lessons, assignments, and grade
                                efficiently.
                            </p>
                        </article>
                        <article className={s.card}>
                            <div className={s.cardHeader}>
                                <span className={s.kicker}>STUDENT</span>
                                <BookMini />
                            </div>
                            <div className={s.divider} />
                            <h3>Enroll &amp; Track Progress</h3>
                            <p>Learn at your pace with clear milestones.</p>
                        </article>
                        <article className={s.card}>
                            <div className={s.cardHeader}>
                                <span className={s.kicker}>SECURITY</span>
                                <Shield />
                            </div>
                            <div className={s.divider} />
                            <h3>2-step checks &amp; roles</h3>
                            <p>Fine-grained permissions, audit trail, SSO.</p>
                        </article>
                    </div>
                </aside>
            </main>
        </div>
    );
}
