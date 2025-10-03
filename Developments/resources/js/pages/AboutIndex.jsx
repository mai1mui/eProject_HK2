import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../../css/AboutIndex.css";

export default function AboutIndex() {
  return (
    <div className="about-index">
      {/* ===== Navbar ===== */}
      <nav className="navbar">
        <div className="logo">E-Learning Management System</div>

        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/courses" className={({ isActive }) => isActive ? "active" : ""}>
              Course
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" className={({ isActive }) => isActive ? "active" : ""}>
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>
              Contact
            </NavLink>
          </li>
        </ul>

        <div className="auth">
          <Link to="/login" className="btn ghost">Login</Link>
          <Link to="/register" className="btn">Register</Link>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="about-hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-inner container">
          <h1 className="hero-title">
            Chúng tôi xây dựng nền tảng học lập trình <span className="grad">hiện đại</span>, <span className="grad">thân thiện</span> và <span className="grad">hiệu quả</span>.
          </h1>
          <p className="hero-subtitle">
            E-Learning Management System giúp bạn học **nhanh hơn** với lộ trình rõ ràng, bài tập thực chiến, theo dõi tiến độ,
            chứng chỉ và mentor đồng hành. Tập trung vào trải nghiệm, chất lượng và hiệu quả đầu ra.
          </p>
          <div className="hero-cta">
            <Link to="/courses" className="btn primary">Khám phá khóa học</Link>
            <Link to="/contact" className="btn ghost">Liên hệ tư vấn</Link>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="about-stats container">
        <div className="stat">
          <div className="stat-num" data-upto="120+">120+</div>
          <div className="stat-cap">Khóa học chọn lọc</div>
        </div>
        <div className="stat">
          <div className="stat-num" data-upto="35K+">35K+</div>
          <div className="stat-cap">Học viên tin tưởng</div>
        </div>
        <div className="stat">
          <div className="stat-num" data-upto="95%">95%</div>
          <div className="stat-cap">Hoàn thành lộ trình</div>
        </div>
        <div className="stat">
          <div className="stat-num" data-upto="4.8/5">4.8/5</div>
          <div className="stat-cap">Mức độ hài lòng</div>
        </div>
      </section>

      {/* ===== VALUES / MISSION ===== */}
      <section className="about-values container">
        <div className="val-card">
          <div className="val-icon">⚡</div>
          <h3>Tốc độ & Hiệu quả</h3>
          <p>Học theo lộ trình tối ưu, rút ngắn thời gian tiếp cận công nghệ và nhanh chóng ứng dụng vào dự án thực tế.</p>
        </div>
        <div className="val-card">
          <div className="val-icon">🤝</div>
          <h3>Mentor đồng hành</h3>
          <p>Có người hướng dẫn, review bài thực chiến, định hướng nghề nghiệp, giúp bạn giữ nhịp và đi đúng hướng.</p>
        </div>
        <div className="val-card">
          <div className="val-icon">🧠</div>
          <h3>Thực chiến</h3>
          <p>Bài tập & project bám sát nhu cầu doanh nghiệp: web, backend, mobile, data, cloud, DevOps…</p>
        </div>
        <div className="val-card">
          <div className="val-icon">🔒</div>
          <h3>Tin cậy</h3>
          <p>Hạ tầng an toàn, dữ liệu minh bạch, chứng chỉ xác thực và lộ trình nâng cao liên tục.</p>
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="about-timeline container">
        <h2>Hành trình của chúng tôi</h2>
        <div className="timeline">
          <div className="t-item">
            <span className="t-dot" />
            <div className="t-content">
              <h4>2023 — Khởi nguồn</h4>
              <p>Ra mắt phiên bản đầu tiên, tập trung vào trải nghiệm học tập đơn giản, hiệu quả.</p>
            </div>
          </div>
          <div className="t-item">
            <span className="t-dot" />
            <div className="t-content">
              <h4>2024 — Mở rộng nội dung</h4>
              <p>Bổ sung lộ trình Full-stack, Data, Mobile, DevOps; tích hợp quiz, assignment, chứng chỉ.</p>
            </div>
          </div>
          <div className="t-item">
            <span className="t-dot" />
            <div className="t-content">
              <h4>2025 — Cá nhân hoá thông minh</h4>
              <p>Hệ thống gợi ý & dashboard tiến độ thông minh, tối ưu theo mục tiêu nghề nghiệp của từng học viên.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIAL ===== */}
      <section className="about-testis container">
        <h2>Học viên nói gì?</h2>
        <div className="testi-grid">
          <blockquote className="testi">
            <p>“Nội dung súc tích, bài thực hành bám sát công việc. Mentor phản hồi rất nhanh.”</p>
            <footer>— Minh Khoa, Frontend Dev</footer>
          </blockquote>
          <blockquote className="testi">
            <p>“Tính năng theo dõi tiến độ & quiz giúp mình giữ nhịp và hệ thống hóa kiến thức tốt hơn.”</p>
            <footer>— Thu Hà, Backend Dev</footer>
          </blockquote>
          <blockquote className="testi">
            <p>“Mình chuyển ngành sang Data Engineer nhờ các lộ trình bài bản và dự án thực tế.”</p>
            <footer>— Quang Huy, Data Engineer</footer>
          </blockquote>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="about-cta">
        <div className="cta-inner container">
          <h2>Sẵn sàng bắt đầu hành trình?</h2>
          <p>Chọn lộ trình phù hợp, học thật — làm thật — thăng tiến thật.</p>
          <div className="cta-actions">
            <Link to="/courses" className="btn primary large">Xem khoá học</Link>
            <Link to="/contact" className="btn ghost large">Nhận tư vấn miễn phí</Link>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
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
