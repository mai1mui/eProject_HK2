import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/UserManagement.css";

const API = "http://127.0.0.1:8000/api";

export default function PaymentInstructor() {
  // ==== Filters/Search/Paging ====
  const [pstatus, setPStatus] = useState("");       // Paid / Processing / Failed
  const [fCourse, setFCourse] = useState("");       // CourseID
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [dateFrom, setDateFrom] = useState("");     // YYYY-MM-DD
  const [dateTo, setDateTo] = useState("");         // YYYY-MM-DD
  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // ==== Data ====
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==== Options ====
  const [courseOpts, setCourseOpts] = useState([]);

  // ==== View modal ====
  const [openView, setOpenView] = useState(false);
  const [current, setCurrent] = useState(null);

  // ==== Feedback form trong View modal ====
  const [fbSubject, setFbSubject] = useState("");
  const [fbMessage, setFbMessage] = useState("");
  const [fbSending, setFbSending] = useState(false);

  // ===== Helpers =====
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token") || "";
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  const fmtDateTime = (s) => {
    if (!s) return "-";
    const str = String(s).includes(" ") ? String(s).replace(" ", "T") : String(s);
    const d = new Date(str);
    return isNaN(d.getTime()) ? String(s) : d.toLocaleString();
  };
  const fmtMoney = (n) => {
    const v = Number(n);
    if (Number.isNaN(v)) return "-";
    return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const badgePStatus = (st) => {
    if (!st) return "pill gray";
    const k = String(st).toLowerCase();
    if (k === "paid") return "pill learner";
    if (k === "failed") return "pill admin";
    return "pill gray";
  };

  // ===== Options: Course list (để lọc) =====
  const fetchCourseOpts = async () => {
    try {
      const res = await axios.get(`${API}/courses`, {
        params: { per_page: 1000 },
        headers: getAuthHeaders(),
      });
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      const ids = Array.from(new Set(data.map((c) => c.CourseID || c.course_id || c.CID).filter(Boolean))).sort();
      setCourseOpts(ids);
    } catch {
      const setC = new Set(rows.map((r) => r.CourseID).filter(Boolean));
      setCourseOpts(Array.from(setC).sort());
    }
  };
  useEffect(() => { fetchCourseOpts(); /* eslint-disable-next-line */ }, []);
  useEffect(() => {
    if (courseOpts.length === 0 && rows.length > 0) {
      const s = new Set(rows.map((r) => r.CourseID).filter(Boolean));
      setCourseOpts(Array.from(s).sort());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  // ===== Fetch payments (chỉ xem) =====
  const fetchPayments = async (newPage = 1) => {
    setLoading(true);
    try {
      const params = { page: newPage, per_page: perPage };
      if (query) params.search = query;
      if (pstatus) params.pstatus = pstatus;
      if (fCourse) params.course_id = fCourse;
      if (minAmount !== "") params.min_amount = minAmount;
      if (maxAmount !== "") params.max_amount = maxAmount;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const res = await axios.get(`${API}/payments`, { params, headers: getAuthHeaders() });

      let data = Array.isArray(res.data) ? res.data : res.data.data || res.data.items || [];
      let metaTotal = res.data.total ?? data.length;
      let metaPer = res.data.per_page ?? perPage;
      let metaPage = res.data.page ?? res.data.current_page ?? newPage;

      // Fallback filter client nếu BE trả mảng thô
      if (Array.isArray(res.data)) {
        data = data.filter((r) => {
          const byStatus = pstatus ? String(r.PStatus || "").toLowerCase() === pstatus.toLowerCase() : true;
          const byCourse = fCourse ? String(r.CourseID || "").toLowerCase() === fCourse.toLowerCase() : true;

          const amt = Number(r.Amount);
          const byMinAmt = minAmount !== "" && !Number.isNaN(Number(minAmount)) ? amt >= Number(minAmount) : true;
          const byMaxAmt = maxAmount !== "" && !Number.isNaN(Number(maxAmount)) ? amt <= Number(maxAmount) : true;

          const paid = r.PayDate ? new Date(String(r.PayDate).replace(" ", "T")) : null;
          const byFrom = dateFrom ? (paid ? paid >= new Date(`${dateFrom}T00:00:00`) : false) : true;
          const byTo = dateTo ? (paid ? paid <= new Date(`${dateTo}T23:59:59`) : false) : true;

          const q = String(query || "").toLowerCase();
          const byQuery = q
            ? String(r.PaymentID || "").toLowerCase().includes(q) ||
              String(r.CourseID || "").toLowerCase().includes(q) ||
              String(r.PStatus || "").toLowerCase().includes(q) ||
              String(r.TransactionRef || "").toLowerCase().includes(q)
            : true;

          return byStatus && byCourse && byMinAmt && byMaxAmt && byFrom && byTo && byQuery;
        });

        metaTotal = data.length;
        const start = (newPage - 1) * perPage;
        data = data.slice(start, start + perPage);
        metaPer = perPage;
        metaPage = newPage;
      }

      setRows(data);
      setTotal(metaTotal);
      setPerPage(metaPer);
      setPage(metaPage);
    } catch (err) {
      console.error("GET /payments (instructor) error:", err?.response?.status, err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pstatus, fCourse, minAmount, maxAmount, dateFrom, dateTo, perPage]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  // ===== View modal =====
  const openViewModal = (row) => {
    setCurrent(row);
    setFbSubject("");
    setFbMessage("");
    setOpenView(true);
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!current) return;
    if (!fbSubject.trim() || !fbMessage.trim()) {
      alert("Vui lòng nhập Subject và Message.");
      return;
    }
    try {
      setFbSending(true);
      await axios.post(
        `${API}/feedback`,
        {
          subject: fbSubject.trim(),
          message: fbMessage.trim(),
          related_type: "payment",
          related_id: current.PaymentID,
        },
        { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
      );
      alert("Đã gửi feedback đến admin. Cảm ơn bạn!");
      setOpenView(false);
    } catch (err) {
      console.error("POST /feedback error:", err?.response?.status, err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Gửi feedback thất bại.");
    } finally {
      setFbSending(false);
    }
  };

  const resetFilters = () => {
    setPStatus("");
    setFCourse("");
    setMinAmount("");
    setMaxAmount("");
    setDateFrom("");
    setDateTo("");
    setQuery("");
    setPage(1);
    fetchPayments(1);
  };

  return (
    <div className="card-section">
      <div className="um-header">
        <div className="um-title">Payment History (Instructor)</div>

        {/* Row 1: Filters + Search */}
        <div className="um-row1">
          <div className="um-filters">
            <select value={pstatus} onChange={(e) => setPStatus(e.target.value)}>
              <option value="">-- Filter by Payment Status --</option>
              <option value="Paid">Paid</option>
              <option value="Processing">Processing</option>
              <option value="Failed">Failed</option>
            </select>

            <select value={fCourse} onChange={(e) => setFCourse(e.target.value)}>
              <option value="">-- Filter by Course --</option>
              {courseOpts.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              placeholder="Min Amount"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="filter-input"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Max Amount"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="filter-input"
            />

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="filter-input"
              title="PayDate From"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="filter-input"
              title="PayDate To"
            />

            <button className="btn sm ghost" type="button" onClick={resetFilters}>
              Reset
            </button>
          </div>

          <div className="search-box">
            <input
              placeholder="Search by PaymentID / CourseID / Status / Ref"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchPayments(1)}
            />
            <button className="btn sm" onClick={() => fetchPayments(1)}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th>PaymentID</th>
              <th>CourseID</th>
              <th>Amount</th>
              <th>PayDate</th>
              <th>PStatus</th>
              <th>TransactionRef</th>
              <th style={{ width: 120 }} className="center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="center muted">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={8} className="center muted">No data</td></tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={r.PaymentID || `${r.CourseID}-${idx}`}>
                  <td>{(page - 1) * perPage + idx + 1}</td>
                  <td className="muted">{r.PaymentID}</td>
                  <td>{r.CourseID}</td>
                  <td>{fmtMoney(r.Amount)}</td>
                  <td className="muted">{fmtDateTime(r.PayDate)}</td>
                  <td><span className={badgePStatus(r.PStatus)}>{r.PStatus || "-"}</span></td>
                  <td className="muted">{r.TransactionRef || "-"}</td>
                  <td className="center">
                    <button className="btn sm warning" onClick={() => openViewModal(r)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="btn sm ghost"
          disabled={page <= 1 || loading}
          onClick={() => fetchPayments(page - 1)}
        >
          ← Prev
        </button>
        <span className="muted">Page {page} / {totalPages}</span>
        <button
          className="btn sm ghost"
          disabled={page >= totalPages || loading}
          onClick={() => fetchPayments(page + 1)}
        >
          Next →
        </button>
        <select
          className="pp"
          value={perPage}
          onChange={(e) => setPerPage(parseInt(e.target.value || "10", 10))}
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>

      {/* View Modal */}
      {openView && current && (
        <div className="modal-overlay" onClick={() => setOpenView(false)}>
          <div className="modal-profile" onClick={(e) => e.stopPropagation()}>
            <div className="profile-header-modal">
              <h2>Payment Details</h2>
              <p className="muted">Xem thông tin chi tiết giao dịch</p>
            </div>

            {/* Thông tin chi tiết */}
            <div className="settings-form1">
              <div className="form-section1">
                <div className="form-group1"><label>PaymentID</label><input value={current.PaymentID || ""} readOnly /></div>
                <div className="form-group1"><label>CourseID</label><input value={current.CourseID || ""} readOnly /></div>
                <div className="form-group1"><label>Amount</label><input value={fmtMoney(current.Amount)} readOnly /></div>
                <div className="form-group1"><label>PayDate</label><input value={fmtDateTime(current.PayDate)} readOnly /></div>
                <div className="form-group1"><label>Status</label><input value={current.PStatus || ""} readOnly /></div>
                <div className="form-group1"><label>TransactionRef</label><input value={current.TransactionRef || ""} readOnly /></div>
                {/* nếu BE trả thêm các field khác, hiển thị tương tự */}
              </div>
            </div>

            {/* Feedback to admin */}
            <div className="profile-header-modal" style={{ marginTop: 6 }}>
              <h3>Report/Feedback to Admin</h3>
              <p className="muted">Nếu có sai sót, hãy mô tả bên dưới để admin xử lý.</p>
            </div>
            <form className="settings-form1" onSubmit={submitFeedback}>
              <div className="form-section1">
                <div className="form-group1">
                  <label>Subject</label>
                  <input value={fbSubject} onChange={(e) => setFbSubject(e.target.value)} placeholder="Sai số tiền / sai trạng thái / ..." />
                </div>
                <div className="form-group1" style={{ gridColumn: "1 / -1" }}>
                  <label>Message</label>
                  <textarea rows={4} value={fbMessage} onChange={(e) => setFbMessage(e.target.value)}
                    placeholder="Mô tả chi tiết vấn đề, thời điểm, minh chứng (nếu có)..." />
                </div>
              </div>

              <div className="profile-actions">
                <button type="button" className="btn ghost" onClick={() => setOpenView(false)}>Cancel</button>
                <button type="submit" className="btn" disabled={fbSending}>
                  {fbSending ? "Sending..." : "Send feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
