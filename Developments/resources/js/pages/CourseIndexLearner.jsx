import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import "../../css/CourseLearner.css";

/* ===== Helpers ===== */
const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "a-z", label: "A → Z" },
  { value: "z-a", label: "Z → A" },
  { value: "top-rated", label: "Top rated" },
  { value: "most-students", label: "Most students" },
];

const formatNum = (n) => {
  if (n == null) return "0";
  const v = Number(n);
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (v >= 1_000) return (v / 1_000).toFixed(1) + "k";
  return v.toLocaleString();
};

function Stars({ value = 0 }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  const percent = (v / 5) * 100;
  return (
    <span className="starsbar">
      <span className="starsbar-bg">★★★★★</span>
      <span className="starsbar-fill" style={{ width: `${percent}%` }}>
        ★★★★★
      </span>
    </span>
  );
}

/* ===== Card ===== */
function CourseCard({ c }) {
  const title = c.CName || c.Title || "Untitled";
  const desc = c.CDescription || c.ShortDesc || "—";
  const rating = Number(c.rating_avg || 0);
  const ratingCount = Number(c.rating_count || 0);
  const students = Number(c.students_count || 0);

  return (
    <li className="course-card">
      <div className="card-top">
        <img
          className="cover"
          src={c.cover_url || "/default-cover.jpg"}
          alt={title}
        />
        <div className="rating-chip">★ {rating.toFixed(1)}</div>
      </div>
      <div className="card-body">
        <h3 className="course-title">
          <Link to={`/courses/${c.CourseID}`}>{title}</Link>
        </h3>
        <p className="desc">{desc}</p>
        <div className="meta">
          <div>
            <span className="muted">Instructor: </span>
            <strong>{c.InstructorName || c.CreatorID || "—"}</strong>
          </div>
          <div>
            <Stars value={rating} />
            <span className="rating-text">
              {rating.toFixed(1)}{" "}
              <span className="muted">({formatNum(ratingCount)})</span>
            </span>
          </div>
          <div>
            <span className="muted">{formatNum(students)} students</span>
          </div>
        </div>
        <div className="card-actions">
          <Link className="btn primary" to={`/courses/${c.CourseID}`}>
            View Detail
          </Link>
        </div>
      </div>
    </li>
  );
}

/* ===== Avatar + Menu (Learner) ===== */
function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const avatar =
    user?.avatar_url ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(user?.name || "User") +
      "&background=0D8ABC&color=fff";

  return (
    <div className="userbox" ref={boxRef}>
      <button className="userbtn" onClick={() => setOpen((o) => !o)}>
        <img className="avatar" src={avatar} alt={user?.name || "User"} />
        <span className="username">{user?.name || "Learner"}</span>
        <span className="chev">▾</span>
      </button>

      {open && (
        <div className="usermenu">
          <Link to="/profile">My Profile</Link>
          <Link to="/my-courses">My Courses</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/settings">Settings</Link>
          <button className="link danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

/* ===== Main Page (Learner) ===== */
export default function CourseIndexLearner() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const q = params.get("q") || "";
  const sort = params.get("sort") || "newest";

  // load current user
  useEffect(() => {
    let live = true;
    api
      .get("/me")
      .then((r) => {
        if (!live) return;
        setUser(r.data || null);
      })
      .catch(() => {
        // nếu token hết hạn, đưa về login
        // navigate("/login"); // bật nếu muốn ép đăng nhập lại
      });
    return () => (live = false);
  }, []);

  // load courses
  useEffect(() => {
    let live = true;
    setLoading(true);
    setErr("");
    api
      .get("/courses-public", { params: { q, sort } })
      .then((r) => {
        if (!live) return;
        const arr = Array.isArray(r.data?.items)
          ? r.data.items
          : r.data?.data || [];
        setItems(arr || []);
      })
      .catch((e) => {
        if (!live) return;
        setErr(e?.response?.data?.message || e.message || "Load failed");
      })
      .finally(() => live && setLoading(false));
    return () => (live = false);
  }, [q, sort]);

  const onSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const q2 = (form.get("q") || "").trim();
    setParams((p) => {
      const next = new URLSearchParams(p);
      if (q2) next.set("q", q2);
      else next.delete("q");
      next.set("sort", sort);
      return next;
    });
  };

  const onChangeSort = (e) => {
    setParams((p) => {
      const next = new URLSearchParams(p);
      next.set("sort", e.target.value);
      return next;
    });
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    // Xoá token local nếu bạn đang lưu
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="course-index">
      {/* ===== Navbar (Learner) ===== */}
      <nav className="navbar">
        <div className="logo">E-Learning Management System</div>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li className="active"><Link to="/courses">Courses</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/contact">ContactUs</Link></li>
        </ul>

        {/* Thay Login/Register bằng avatar + tên */}
        <div className="nav-right">
          <UserMenu user={user} onLogout={handleLogout} />
        </div>
      </nav>

      {/* ===== Toolbar ===== */}
      <div className="toolbar">
        <form onSubmit={onSubmit} className="searchbar">
          <input name="q" defaultValue={q} placeholder="Search courses..." />
          <select value={sort} onChange={onChangeSort}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button className="btn">Filter</button>
        </form>
      </div>

      {/* ===== Grid ===== */}
      {err && <div className="alert">{err}</div>}
      {loading ? (
        <ul className="grid skeleton">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="course-card sk" />
          ))}
        </ul>
      ) : items.length === 0 ? (
        <div className="empty">No courses found.</div>
      ) : (
        <ul className="grid">
          {items.map((c) => (
            <CourseCard key={c.CourseID} c={c} />
          ))}
        </ul>
      )}

      {/* ===== Footer (dùng lại css cũ) ===== */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <h4>For Learners</h4>
            <ul>
              <li><Link to="#">Top Tutorials</Link></li>
              <li><Link to="#">Certificates</Link></li>
              <li><Link to="#">Career Path</Link></li>
            </ul>
          </div>
          <div>
            <h4>For Teachers</h4>
            <ul>
              <li><Link to="#">Upload Course</Link></li>
              <li><Link to="#">Instructor Guide</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="#">About Us</Link></li>
              <li><Link to="#">Contact</Link></li>
              <li><Link to="#">Blog</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 E-Learning Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
