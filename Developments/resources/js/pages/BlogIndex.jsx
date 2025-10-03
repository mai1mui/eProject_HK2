import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useSearchParams } from "react-router-dom";
import "../../css/blogindex.css";

// === Helpers ===
const CATEGORIES = [
  { key: "all", label: "Tất cả" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "mobile", label: "Mobile" },
  { key: "data", label: "Data/AI" },
  { key: "devops", label: "DevOps/Cloud" },
];

const TAGS = ["React", "Laravel", "SQL", "Docker", "Kubernetes", "Flutter", "Django", "Next.js", "Tailwind"];

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return iso?.slice(0, 10) || "";
  }
}

// Demo dataset (khi nối DB, thay phần này bằng dữ liệu API)
const DEMO_POSTS = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  title: [
    "Tối ưu hiệu năng React 19",
    "Xây REST API với Laravel 10",
    "Bí kíp SQL cho báo cáo",
    "CI/CD khởi đầu nhanh với GitHub Actions",
    "Docker Compose cho dev team",
    "Kubernetes – từ zero đến hero",
    "Xây app Flutter 3 trong 7 ngày",
    "Xử lý data pipeline bằng Airflow",
    "Next.js App Router – best practices",
  ][i],
  excerpt:
    "Bài viết hướng dẫn chi tiết, ví dụ thực chiến, checklist triển khai, kèm repo mẫu để bạn áp dụng ngay vào dự án.",
  cover: `https://picsum.photos/seed/blog${i}/640/360`,
  category: CATEGORIES[(i % (CATEGORIES.length - 1)) + 1].key,
  tags: [TAGS[i % TAGS.length], TAGS[(i + 3) % TAGS.length]],
  author: ["Mai H.", "Linh T.", "An P.", "Duy N."][i % 4],
  created_at: `2025-09-${(i + 10).toString().padStart(2, "0")}T10:00:00Z`,
  read_mins: 6 + (i % 5),
}));

// === Components ===
function PostCard({ p }) {
  return (
    <article className="post-card">
      <Link to={`/blog/${p.id}`} className="cover-wrap">
        <img src={p.cover} alt={p.title} className="cover" loading="lazy" />
        <span className={`cat cat-${p.category}`}>{p.category}</span>
      </Link>
      <div className="pc-body">
        <h3 className="pc-title">
          <Link to={`/blog/${p.id}`}>{p.title}</Link>
        </h3>
        <p className="pc-excerpt">{p.excerpt}</p>
        <div className="pc-meta">
          <span>{formatDate(p.created_at)}</span>
          <span>•</span>
          <span>{p.read_mins} phút đọc</span>
          <span>•</span>
          <span className="author">{p.author}</span>
        </div>
        <div className="pc-tags">
          {p.tags.map((t) => (
            <Link key={t} to={`/blog?tag=${encodeURIComponent(t)}`} className="tag">#{t}</Link>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function BlogIndex() {
  const [params, setParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const q = params.get("q") || "";
  const cat = params.get("cat") || "all";
  const tag = params.get("tag") || "";
  const page = Number(params.get("page") || 1);
  const perPage = 6;

  // TODO: Kết nối API khi backend sẵn sàng
  // useEffect(() => {
  //   setLoading(true);
  //   api.get("/blog", { params: { q, cat, tag, page, perPage }})
  //     .then(r => setPosts(r.data.items))
  //     .finally(() => setLoading(false));
  // }, [q, cat, tag, page]);

  // Demo local filter
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      let arr = DEMO_POSTS;
      if (cat !== "all") arr = arr.filter(p => p.category === cat);
      if (tag) arr = arr.filter(p => p.tags.includes(tag));
      if (q) {
        const qq = q.toLowerCase();
        arr = arr.filter(p => p.title.toLowerCase().includes(qq) || p.excerpt.toLowerCase().includes(qq));
      }
      setPosts(arr);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [q, cat, tag]);

  const total = posts.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const paged = useMemo(() => {
    const start = (page - 1) * perPage;
    return posts.slice(start, start + perPage);
  }, [posts, page, perPage]);

  const setParam = (key, val) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) next.set(key, val);
      else next.delete(key);
      next.set("page", "1");
      return next;
    });
  };

  const onSearch = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setParam("q", (fd.get("q") || "").trim());
  };

  return (
    <div className="blog-index">
      {/* NAV */}
      <nav className="navbar">
        <div className="logo">E-Learning Management System</div>
        <ul className="nav-links">
          <li><NavLink to="/" end className={({isActive}) => isActive ? "active" : ""}>Home</NavLink></li>
          <li><NavLink to="/about" className={({isActive}) => isActive ? "active" : ""}>About</NavLink></li>
          <li><NavLink to="/courses" className={({isActive}) => isActive ? "active" : ""}>Courses</NavLink></li>
          <li><NavLink to="/blog" className={({isActive}) => isActive ? "active" : ""}>Blog</NavLink></li>
          <li><NavLink to="/contact" className={({isActive}) => isActive ? "active" : ""}>Contact</NavLink></li>
        </ul>
        <div className="auth">
          <Link to="/login" className="btn ghost">Login</Link>
          <Link to="/register" className="btn">Register</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="blog-hero">
        <div className="bh-bg" aria-hidden="true" />
        <div className="container">
          <h1 className="bh-title">Blog kỹ thuật – chia sẻ thật, làm thật</h1>
          <p className="bh-subtitle">Kiến thức lập trình, kiến trúc hệ thống, DevOps, Data/AI… tinh gọn và thực chiến.</p>
          <form className="bh-search" onSubmit={onSearch}>
            <input name="q" defaultValue={q} placeholder="Tìm bài viết (React, Laravel, Docker…)" />
            <button className="btn">Tìm</button>
          </form>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="blog-filters container">
        <div className="cats">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              className={`chip ${cat === c.key ? "on" : ""}`}
              onClick={() => setParam("cat", c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="tags">
          {TAGS.map((t) => (
            <button
              key={t}
              className={`tag-chip ${tag === t ? "on" : ""}`}
              onClick={() => setParam("tag", t)}
            >
              #{t}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED (top 3) */}
      <section className="blog-featured container">
        <h2>Nổi bật</h2>
        <div className="feat-grid">
          {(loading ? [] : posts.slice(0, 3)).map((p) => (
            <Link to={`/blog/${p.id}`} className="feat-card" key={p.id}>
              <img src={p.cover} alt={p.title} />
              <div className="fc-body">
                <span className="fc-cat">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
              </div>
            </Link>
          ))}
          {loading && <div className="feat-skel" />}
          {loading && <div className="feat-skel" />}
          {loading && <div className="feat-skel" />}
        </div>
      </section>

      {/* GRID POSTS */}
      <section className="blog-grid container">
        <h2>Tất cả bài viết</h2>
        {loading ? (
          <div className="grid-skeleton">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="post-skel" />
            ))}
          </div>
        ) : paged.length === 0 ? (
          <div className="empty">Không có bài viết phù hợp.</div>
        ) : (
          <div className="grid">
            {paged.map((p) => <PostCard key={p.id} p={p} />)}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && lastPage > 1 && (
          <div className="pagination">
            {Array.from({ length: lastPage }).map((_, i) => {
              const n = i + 1;
              return (
                <button
                  key={n}
                  className={`page-btn ${n === page ? "on" : ""}`}
                  onClick={() => setParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set("page", String(n));
                    return next;
                  })}
                >
                  {n}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* NEWSLETTER CTA */}
      <section className="blog-cta">
        <div className="container cta-inner">
          <h3>Nhận bài mới mỗi tuần</h3>
          <p>Chúng tôi chỉ gửi những nội dung giá trị – không spam.</p>
          <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email của bạn" required />
            <button className="btn primary">Đăng ký</button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
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
              <li><Link to="#">Upload course</Link></li>
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
