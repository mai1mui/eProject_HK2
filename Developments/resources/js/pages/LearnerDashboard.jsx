import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../css/LearnerDashboard.css"; // <-- CSS riêng cho Learner

export default function LearnerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // ===== API client (giống Admin, có token + bắt 401) =====
  const API_BASE = import.meta?.env?.VITE_API_URL || "http://127.0.0.1:8000/api";
  const apiRef = useRef(null);
  if (!apiRef.current) {
    const instance = axios.create({
      baseURL: API_BASE,
      headers: { Accept: "application/json" },
    });
    instance.interceptors.request.use((cfg) => {
      const t = localStorage.getItem("token");
      if (t) cfg.headers.Authorization = `Bearer ${t}`;
      return cfg;
    });
    let loggingOut = false;
    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401 && !loggingOut) {
          loggingOut = true;
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => navigate("/login"), 0);
        }
        return Promise.reject(err);
      }
    );
    apiRef.current = instance;
  }
  const api = apiRef.current;

  // ===== State chung =====
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; } catch { return null; }
  });
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDark);
  }, [isDark]);

  // ===== Helpers =====
  const isActive = (path) => location.pathname.startsWith(path);
  const fmt = (n) => new Intl.NumberFormat().format(Number(n || 0));
  const money = (n) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(n || 0));
  const computedAvatarUrl =
    (user?.avatarUrl || user?.AvatarUrl || "storage/avatars/avatar.jpg") + "?v=1";

  const displayCreatedAt = useMemo(() => {
    const raw = user?.CreatedAt ?? user?.created_at ?? user?.createdAt ?? null;
    if (!raw) return "-";
    const s = typeof raw === "string" && raw.includes(" ") ? raw.replace(" ", "T") : raw;
    const d = new Date(s);
    return isNaN(d.getTime()) ? String(raw) : d.toLocaleString();
  }, [user]);

  async function getJSON(path, params) {
    const r = await api.get(path, { params });
    return r;
  }
  function arr(res) {
    if (Array.isArray(res?.data?.data)) return res.data.data;
    if (Array.isArray(res?.data?.items)) return res.data.items;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res)) return res;
    return [];
  }

  // ===== Data cho learner =====
  const [kpi, setKpi] = useState(null);
  const [enrolled, setEnrolled] = useState([]);          // các khoá đã ghi danh
  const [recommended, setRecommended] = useState([]);    // tutorial gợi ý
  const [spaces, setSpaces] = useState([]);              // “spaces” của learner (nếu có)
  const [certs, setCerts] = useState([]);                // certificate đã có / recommend
  const [assess, setAssess] = useState([]);              // bài kiểm tra/quiz gần đây

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      // Summary của learner
      try {
        // ưu tiên /learner/summary
        const r = await getJSON("/learner/summary");
        setKpi(r?.data || null);
      } catch {
        // fallback nếu backend chưa có summary riêng
        try {
          // rút từ các nguồn chung rồi tính đơn giản
          const e = await getJSON("/my/enrollments", { per_page: 100 });
          const p = await getJSON("/payments", { per_page: 100 });
          const enrolls = arr(e);
          const pays = arr(p).filter((x) => String(x?.status || x?.Status) === "Paid");
          const totalSpent = pays.reduce((s, it) => s + Number(it?.amount || it?.Amount || 0), 0);
          setKpi({
            enrolled_courses: enrolls.length,
            completed_lessons: 0,
            xp: 0,
            total_spent: totalSpent,
          });
        } catch {
          setKpi(null);
        }
      }

      // Enrolled courses
      try {
        const r = await getJSON("/learner/courses", { per_page: 10 });
        setEnrolled(arr(r));
      } catch {
        try {
          const r2 = await getJSON("/my/enrollments", { per_page: 10 });
          setEnrolled(arr(r2));
        } catch {
          setEnrolled([]);
        }
      }

      // Recommended tutorials
      try {
        const r = await getJSON("/learner/recommended", { per_page: 6 });
        setRecommended(arr(r));
      } catch {
        setRecommended([]);
      }

      // Spaces
      try {
        const r = await getJSON("/learner/spaces", { per_page: 5 });
        setSpaces(arr(r));
      } catch {
        setSpaces([]);
      }

      // Certificates
      try {
        const r = await getJSON("/learner/certificates", { per_page: 4 });
        setCerts(arr(r));
      } catch {
        setCerts([]);
      }

      // Assessments gần đây
      try {
        const r = await getJSON("/learner/assessments/recent", { per_page: 6 });
        setAssess(arr(r));
      } catch {
        setAssess([]);
      }
    })();
  }, []);

  // ===== Logout =====
  const handleLogout = async () => {
    try { await api.post(`/logout`, {}); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="learner-container">
      {/* TOPBAR */}
      <header className="lr-topbar">
        <div className="lr-left">
          <button className="lr-brand" onClick={() => navigate("/")}>
            <span className="logo-dot">W</span> E-Learning
          </button>

          <nav className="lr-nav">
            <div className="nav-item">Tutorials ▾</div>
            <div className="nav-item">References ▾</div>
            <div className="nav-item">Exercises ▾</div>
            <div className="nav-item">Certificates ▾</div>
          </nav>

          <div className="lr-search">
            <input placeholder="Search..." />
            <button aria-label="Search">
              <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </div>

        <div className="lr-right">
          <Link className="mini-link" to="/spaces">Spaces</Link>
          <Link className="mini-link" to="/teach">For Teachers</Link>
          <Link className="mini-link" to="/upgrade">Upgrade</Link>
          <Link className="mini-link" to="/certified">Get Certified</Link>

          <div className="lr-profile" onClick={() => navigate("/profile")}>
            <img src={computedAvatarUrl} alt="avatar" />
            <div className="lr-profile-info">
              <div className="name">{user?.AName || user?.name || "Learner"}</div>
              <div className="meta">Joined: {displayCreatedAt}</div>
            </div>
          </div>

          <div
            className={`theme-toggle ${isDark ? "dark" : "light"}`}
            onClick={() => setIsDark((v) => !v)}
          >
            <div className="toggle-circle"></div>
          </div>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="lr-layout">
        {/* SIDEBAR */}
        <aside className="lr-sidebar">
          <div className="sb-group">
            <div className="sb-title">Overview</div>
            <Link className={`sb-item ${isActive("/learner") ? "active" : ""}`} to="/learner">
              Dashboard
            </Link>
            <Link className="sb-item" to="/leaderboard">Leaderboard</Link>
          </div>

          <div className="sb-group">
            <div className="sb-title">Learn</div>
            <Link className="sb-item" to="/tutorials">Tutorials</Link>
            <Link className="sb-item" to="/bookmarks">Bookmarks</Link>
            <Link className="sb-item" to="/paths">Learning Paths</Link>
          </div>

          <div className="sb-group">
            <div className="sb-title">Grow</div>
            <Link className="sb-item" to="/courses">Courses</Link>
            <Link className="sb-item" to="/career">Career Paths</Link>
            <Link className="sb-item" to="/certificates">Certificates</Link>
          </div>

          <div className="sb-group">
            <div className="sb-title">Practice</div>
            <Link className="sb-item" to="/assessments">Assessments</Link>
            <Link className="sb-item" to="/challenges">Challenges</Link>
            <Link className="sb-item" to="/interview">Interview Prep</Link>
          </div>

          <div className="sb-group">
            <div className="sb-title">Build</div>
            <Link className="sb-item" to="/spaces">Spaces</Link>
            <Link className="sb-item" to="/domains">Domains</Link>
          </div>

          <div className="sb-group">
            <div className="sb-title">Profile</div>
            <Link className="sb-item" to="/profile">Profile</Link>
            <Link className="sb-item" to="/billing">Billing & Plans</Link>
            <button className="sb-item danger" onClick={handleLogout}>Logout</button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="lr-main">
          {/* COURSES (enrolled) */}
          <section className="panel">
            <div className="panel-head between">
              <h3>Courses</h3>
              <Link to="/courses" className="muted">View all</Link>
            </div>

            <div className="course-list">
              {enrolled.length === 0 ? (
                <div className="muted">You haven’t enrolled any courses yet.</div>
              ) : (
                enrolled.map((c) => (
                  <div className="course-card" key={c?.CourseID ?? c?.id}>
                    <div className="icon">{(c?.slug || c?.Title || "C")[0]}</div>
                    <div className="content">
                      <div className="title">{c?.Title ?? c?.CName ?? c?.title}</div>
                      <div className="meta">
                        <span>Lessons</span>
                        <span>Exercises</span>
                        <span>Challenges</span>
                        <span>Assessment</span>
                        <span>Exam</span>
                      </div>
                    </div>
                    <Link to={`/courses/${c?.CourseID ?? c?.id}`} className="continue">Continue ›</Link>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* RECOMMENDED TUTORIALS */}
          <section className="panel">
            <div className="panel-head">
              <h3>Recommended Tutorials</h3>
            </div>
            <div className="recommend-grid">
              {(recommended.length ? recommended : new Array(3).fill({})).map((t, i) => (
                <div className="recommend-card" key={t?.id ?? i}>
                  <div className="title">{t?.title ?? "—"}</div>
                  <div className="desc">{t?.summary ?? "Personalized for you based on activity."}</div>
                  {t?.id ? <Link to={`/tutorials/${t.id}`} className="btn small">Start</Link> : <div className="skeleton" />}
                </div>
              ))}
            </div>
          </section>

          {/* SPACES & CERTIFICATES (2 cột) */}
          <section className="panel two-col">
            <div className="subpanel">
              <div className="panel-head">
                <h3>Spaces</h3>
              </div>
              {spaces.length === 0 ? (
                <div className="empty-box">
                  <div className="big">You have no spaces yet</div>
                  <div className="muted">Create one and start coding!</div>
                  <Link to="/spaces/create" className="btn">Create space</Link>
                </div>
              ) : (
                <ul className="space-list">
                  {spaces.map((s) => (
                    <li key={s?.id}>
                      <span className="mono">{s?.name ?? s?.id}</span>
                      <Link to={`/spaces/${s?.id}`} className="btn ghost small">Open</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="subpanel">
              <div className="panel-head">
                <h3>Certificates</h3>
              </div>
              {certs.length === 0 ? (
                <div className="empty-box">
                  <div className="big">Get certified!</div>
                  <div className="muted">Pass an exam and receive your certificate</div>
                  <Link to="/certificates" className="btn">Explore certificates</Link>
                </div>
              ) : (
                <ul className="cert-list">
                  {certs.map((c) => (
                    <li key={c?.id}>
                      <div>
                        <div className="strong">{c?.name ?? c?.title}</div>
                        <div className="muted small">
                          Issued:{" "}
                          {c?.issued_at
                            ? new Date(c.issued_at).toLocaleDateString()
                            : "—"}
                        </div>
                      </div>
                      <a className="btn ghost small" href={c?.url || "#"} target="_blank" rel="noreferrer">
                        View
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* ASSESSMENTS GẦN ĐÂY */}
          <section className="panel">
            <div className="panel-head between">
              <h3>Recent Assessments</h3>
              <Link to="/assessments" className="muted">All assessments</Link>
            </div>
            <div className="panel-body table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Assessment</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {assess.length === 0 ? (
                    <tr><td colSpan="5" className="muted">No data</td></tr>
                  ) : (
                    assess.map((a) => (
                      <tr key={a?.id}>
                        <td>{a?.course_title ?? a?.course ?? "—"}</td>
                        <td>{a?.title ?? "—"}</td>
                        <td>{a?.score != null ? `${a.score}%` : "—"}</td>
                        <td>
                          <span className={`badge ${
                            /passed|completed/i.test(String(a?.status)) ? "ok" :
                            /pending|in\-progress/i.test(String(a?.status)) ? "warn" : ""
                          }`}>{a?.status ?? "—"}</span>
                        </td>
                        <td>{a?.taken_at ? new Date(a.taken_at).toLocaleString() : "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {/* RIGHT SIDEBAR (profile summary widget giống ảnh) */}
        <aside className="lr-rightbar">
          <div className="profile-card">
            <div className="pc-head">
              <img src={computedAvatarUrl} alt="avatar" />
              <div>
                <div className="name">{user?.AName || user?.name || "Learner"}</div>
                <Link className="muted small" to="/profile">Open profile ›</Link>
              </div>
            </div>

            <div className="pc-stats">
              <div className="stat">
                <div className="tag violet">XP</div>
                <div className="val">{kpi ? fmt(kpi.xp ?? 0) : "…"}</div>
              </div>
              <div className="stat">
                <div className="tag green">W</div>
                <div className="val">{kpi ? fmt(kpi.badges ?? 0) : "…"}</div>
              </div>
              <div className="stat">
                <div className="tag gold">⚡</div>
                <div className="val">{kpi ? fmt(kpi.streak ?? 0) : "…"}</div>
              </div>
            </div>

            <div className="pc-meta">
              <div><span className="muted">Enrolled</span> <b>{kpi ? fmt(kpi.enrolled_courses ?? 0) : "…"}</b></div>
              <div><span className="muted">Completed lessons</span> <b>{kpi ? fmt(kpi.completed_lessons ?? 0) : "…"}</b></div>
              <div><span className="muted">Total spent</span> <b>{kpi ? money(kpi.total_spent ?? 0) : "…"}</b></div>
            </div>
          </div>

          {/* chỗ trống cho future widgets */}
          <div className="right-widget skeleton-block" />
          <div className="right-widget skeleton-block" />
        </aside>
      </div>
    </div>
  );
}
