import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../../css/contactindex.css";

export default function ContactIndex() {
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setOk("");
    setErr("");

    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") || "").trim();
    const email = (fd.get("email") || "").trim();
    const topic = (fd.get("topic") || "").trim();
    const message = (fd.get("message") || "").trim();

    // Validate đơn giản
    if (!name || !email || !message) {
      setErr("Vui lòng nhập đầy đủ Họ tên, Email và Nội dung.");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      setErr("Email không hợp lệ.");
      return;
    }

    try {
      setSending(true);
      // TODO: Gọi API backend của bạn, ví dụ:
      // await api.post("/contact", { name, email, topic, message });
      await new Promise((r) => setTimeout(r, 800)); // fake loading
      setOk("Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.");
      e.currentTarget.reset();
    } catch (e2) {
      setErr("Gửi không thành công. Vui lòng thử lại sau.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-index">
      {/* NAV (neon underline) */}
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
      <section className="c-hero">
        <div className="c-hero-bg" aria-hidden="true" />
        <div className="container c-hero-inner">
          <h1>Liên hệ đội ngũ hỗ trợ</h1>
          <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn về lộ trình học, kỹ thuật, thanh toán và hợp tác giảng dạy.</p>
          <div className="c-hero-cta">
            <Link to="/courses" className="btn primary large">Xem khoá học</Link>
            <a href="#contact-form" className="btn ghost">Gửi yêu cầu</a>
          </div>
        </div>
      </section>

      {/* INFO CARDS */}
      <section className="c-infos container">
        <div className="c-card">
          <div className="c-ic">💬</div>
          <h3>Hỗ trợ nhanh</h3>
          <p>Thứ 2–Thứ 7, 8:30–21:00</p>
          <a href="mailto:support@elearn.dev" className="c-link">support@elearn.dev</a>
        </div>
        <div className="c-card">
          <div className="c-ic">💼</div>
          <h3>Hợp tác giảng dạy</h3>
          <p>Trở thành instructor và chia sẻ kiến thức của bạn.</p>
          <a href="mailto:instructor@elearn.dev" className="c-link">instructor@elearn.dev</a>
        </div>
        <div className="c-card">
          <div className="c-ic">🏢</div>
          <h3>Doanh nghiệp</h3>
          <p>Giải pháp đào tạo nội bộ, đo hiệu quả và chứng chỉ.</p>
          <a href="mailto:b2b@elearn.dev" className="c-link">b2b@elearn.dev</a>
        </div>
        <div className="c-card">
          <div className="c-ic">🧾</div>
          <h3>Hoá đơn & Thanh toán</h3>
          <p>Hỗ trợ chứng từ, hoàn/đổi khoá, xuất VAT.</p>
          <a href="mailto:billing@elearn.dev" className="c-link">billing@elearn.dev</a>
        </div>
      </section>

      {/* FORM + MAP */}
      <section className="c-form-wrap container" id="contact-form">
        <div className="c-form">
          <h2>Gửi yêu cầu</h2>
          <p className="muted">Điền biểu mẫu, chúng tôi sẽ phản hồi trong 24 giờ làm việc.</p>

          {ok && <div className="c-alert ok">{ok}</div>}
          {err && <div className="c-alert err">{err}</div>}

          <form onSubmit={onSubmit}>
            <div className="row">
              <div className="col">
                <label>Họ tên *</label>
                <input name="name" placeholder="Nguyễn Văn A" />
              </div>
              <div className="col">
                <label>Email *</label>
                <input name="email" placeholder="you@email.com" />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <label>Chủ đề</label>
                <select name="topic" defaultValue="">
                  <option value="">— Chọn chủ đề —</option>
                  <option value="learning-path">Lộ trình học</option>
                  <option value="technical">Vấn đề kỹ thuật</option>
                  <option value="payment">Thanh toán</option>
                  <option value="instructor">Trở thành giảng viên</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className="col">
                <label>Số điện thoại (tuỳ chọn)</label>
                <input name="phone" placeholder="09xx xxx xxx" />
              </div>
            </div>

            <div className="row">
              <div className="col col-12">
                <label>Nội dung *</label>
                <textarea name="message" rows={6} placeholder="Bạn cần hỗ trợ gì? Mô tả càng rõ càng tốt nhé." />
              </div>
            </div>

            <div className="actions">
              <button className="btn primary" disabled={sending}>
                {sending ? "Đang gửi..." : "Gửi yêu cầu"}
              </button>
              <Link to="/faq" className="btn ghost">Xem FAQ</Link>
            </div>
          </form>
        </div>

        <div className="c-map">
          <div className="c-map-card">
            <div className="c-map-header">Văn phòng</div>
            <div className="c-map-body">
              <p>123 Tech Street, District 1, HCMC</p>
              <p>Hotline: 1900 6868</p>
              <div className="c-map-embed">
                {/* Thay iframe Google Map thật khi sẵn sàng */}
                <img
                  src="https://picsum.photos/seed/mapx/800/480"
                  alt="Map placeholder"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ (nhỏ) */}
      <section className="c-faq container">
        <h2>Câu hỏi thường gặp</h2>
        <details>
          <summary>Làm sao để nhận chứng chỉ sau khi hoàn thành?</summary>
          <p>Bạn cần đạt đủ yêu cầu điểm quiz/bài tập. Hệ thống sẽ cấp chứng chỉ điện tử trong trang My Certificates.</p>
        </details>
        <details>
          <summary>Chính sách hoàn tiền như thế nào?</summary>
          <p>Trong 7 ngày đầu, nếu chưa học quá 20% nội dung, bạn có thể yêu cầu hoàn tiền 100%.</p>
        </details>
        <details>
          <summary>Tôi có thể học trên nhiều thiết bị?</summary>
          <p>Có. Bạn có thể đăng nhập từ web/mobile, tiến độ được đồng bộ hoá theo tài khoản.</p>
        </details>
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
