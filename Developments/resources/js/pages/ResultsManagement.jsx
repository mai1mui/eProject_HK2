import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/UserManagement.css";

const API = "http://127.0.0.1:8000/api";

export default function ResultsManagement() {
  const navigate = useNavigate();

  // ==== Filters/Search/Paging ====
  const [rstatus, setRStatus] = useState(""); // Passed/Pending/Failed
  const [fAccount, setFAccount] = useState(""); // AccountID
  const [fCourse, setFCourse] = useState("");   // CourseID
  const [minMark, setMinMark] = useState("");
  const [maxMark, setMaxMark] = useState("");
  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // ==== Data ====
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==== Options for filters (from API) ====
  const [accountOpts, setAccountOpts] = useState([]); // ['LRN001', ...]
  const [courseOpts, setCourseOpts] = useState([]);   // ['SQL505', ...]

  // ==== Modals ====
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [current, setCurrent] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token") || "";
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fmtNum = (n) => {
    if (n === null || n === undefined || n === "") return "-";
    const v = Number(n);
    return isNaN(v) ? String(n) : v.toFixed(2);
  };

  const badgeRStatus = (s) => {
    if (!s) return "pill gray";
    const k = String(s).toLowerCase();
    if (k === "passed") return "pill learner";
    if (k === "failed") return "pill admin";
    return "pill gray";
  };

  // ===== Fetch results list =====
  const fetchResults = async (newPage = 1) => {
    setLoading(true);
    try {
      const params = { page: newPage, per_page: perPage };
      if (query) params.search = query;
      if (rstatus) params.rstatus = rstatus;
      if (fAccount) params.account_id = fAccount;
      if (fCourse) params.course_id = fCourse;
      if (minMark !== "") params.min_mark = minMark;
      if (maxMark !== "") params.max_mark = maxMark;

      const res = await axios.get(`${API}/results`, {
        params,
        headers: getAuthHeaders(),
      });

      let data = Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.items || [];
      let metaTotal = res.data.total ?? data.length;
      let metaPer = res.data.per_page ?? perPage;
      let metaPage = res.data.page ?? res.data.current_page ?? newPage;

      // Fallback filter client nếu BE trả mảng thô
      if (Array.isArray(res.data)) {
        data = data.filter((r) => {
          const byStatus = rstatus
            ? String(r.RStatus || "").toLowerCase() === rstatus.toLowerCase()
            : true;
          const byAccount = fAccount
            ? String(r.AccountID || "").toLowerCase() ===
              fAccount.toLowerCase()
            : true;
          const byCourse = fCourse
            ? String(r.CourseID || "").toLowerCase() === fCourse.toLowerCase()
            : true;

          const mk = Number(r.Mark);
          const byMin =
            minMark !== "" && !Number.isNaN(Number(minMark))
              ? mk >= Number(minMark)
              : true;
          const byMax =
            maxMark !== "" && !Number.isNaN(Number(maxMark))
              ? mk <= Number(maxMark)
              : true;

          const q = String(query || "").toLowerCase();
          const byQuery = q
            ? String(r.id || "").toLowerCase().includes(q) ||
              String(r.ResultCode || "").toLowerCase().includes(q) ||
              String(r.AccountID || "").toLowerCase().includes(q) ||
              String(r.CourseID || "").toLowerCase().includes(q) ||
              String(r.Content || "").toLowerCase().includes(q)
            : true;

          return byStatus && byAccount && byCourse && byMin && byMax && byQuery;
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
      console.error("GET /results error:", err?.response?.status, err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to load results.");
    } finally {
      setLoading(false);
    }
  };

  // ===== Fetch account/course options from API =====
  const fetchAccountOpts = async () => {
    try {
      // lấy tối đa 1000; chỉnh lại theo BE nếu cần
      const res = await axios.get(`${API}/users`, {
        params: { per_page: 1000 },
        headers: getAuthHeaders(),
      });
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      const ids = Array.from(
        new Set(
          data
            .map((u) => u.AccountID || u.account_id)
            .filter((x) => x && typeof x === "string")
        )
      ).sort((a, b) => a.localeCompare(b));
      setAccountOpts(ids);
    } catch (e) {
      // fallback: build từ rows đã có
      const setIds = new Set(rows.map((r) => r.AccountID).filter(Boolean));
      setAccountOpts(Array.from(setIds).sort());
    }
  };

  const fetchCourseOpts = async () => {
    try {
      const res = await axios.get(`${API}/courses`, {
        params: { per_page: 1000 },
        headers: getAuthHeaders(),
      });
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      const cids = Array.from(
        new Set(
          data
            .map((c) => c.CourseID || c.course_id || c.CID)
            .filter((x) => x && typeof x === "string")
        )
      ).sort((a, b) => a.localeCompare(b));
      setCourseOpts(cids);
    } catch (e) {
      const setC = new Set(rows.map((r) => r.CourseID).filter(Boolean));
      setCourseOpts(Array.from(setC).sort());
    }
  };

  // Auto fetch data khi đổi filter/perPage (giống UserManagement)
  useEffect(() => {
    fetchResults(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rstatus, fAccount, fCourse, minMark, maxMark, perPage]);

  // Tải options ban đầu (và khi rows thay đổi mà options trống thì fill từ rows)
  useEffect(() => {
    fetchAccountOpts();
    fetchCourseOpts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (accountOpts.length === 0 && rows.length > 0) {
      const s = new Set(rows.map((r) => r.AccountID).filter(Boolean));
      setAccountOpts(Array.from(s).sort());
    }
    if (courseOpts.length === 0 && rows.length > 0) {
      const s = new Set(rows.map((r) => r.CourseID).filter(Boolean));
      setCourseOpts(Array.from(s).sort());
    }
  }, [rows]); // eslint-disable-line

  // ====== Create ======
  const [createForm, setCreateForm] = useState({
    AccountID: "",
    CourseID: "",
    Content: "",
    Mark: "",
    RStatus: "Passed",
  });

  const submitCreate = async (e) => {
    e.preventDefault();
    try {
      const body = {
        AccountID: createForm.AccountID,
        CourseID: createForm.CourseID,
        Content: createForm.Content,
        Mark: createForm.Mark === "" ? null : Number(createForm.Mark),
        RStatus: createForm.RStatus,
      };

      await axios.post(`${API}/results`, body, {
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      });

      alert("Created successfully!");
      setOpenCreate(false);
      setCreateForm({
        AccountID: "",
        CourseID: "",
        Content: "",
        Mark: "",
        RStatus: "Passed",
      });
      fetchResults(page);
    } catch (err) {
      console.error("CREATE /results error:", err?.response?.status, err?.response?.data || err.message);
      alert(err?.response?.data?.message || err?.response?.data?.error || "Create failed!");
    }
  };

  // ====== Edit ======
  const [editForm, setEditForm] = useState({
    id: "",
    ResultCode: "",
    AccountID: "",
    CourseID: "",
    Content: "",
    Mark: "",
    RStatus: "",
  });

  const openEditModal = (row) => {
    setCurrent(row);
    setEditForm({
      id: row.id ?? "",
      ResultCode: row.ResultCode ?? "",
      AccountID: row.AccountID ?? "",
      CourseID: row.CourseID ?? "",
      Content: row.Content ?? "",
      Mark: row.Mark ?? "",
      RStatus: row.RStatus ?? "",
    });
    setOpenEdit(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!current) return;
    try {
      const body = {
        AccountID: editForm.AccountID,
        CourseID: editForm.CourseID,
        Content: editForm.Content,
        Mark: editForm.Mark === "" ? null : Number(editForm.Mark),
        RStatus: editForm.RStatus,
      };

      const fd = new FormData();
      fd.append("_method", "PUT");
      Object.entries(body).forEach(([k, v]) =>
        fd.append(k, v === null || v === undefined ? "" : v)
      );

      await axios.post(`${API}/results/${current.id}`, fd, {
        headers: getAuthHeaders(),
      });

      alert("Updated successfully!");
      setOpenEdit(false);
      setCurrent(null);
      fetchResults(page);
    } catch (err) {
      console.error("UPDATE /results error:", err?.response?.status, err?.response?.data || err.message);
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          `Update failed! (HTTP ${err?.response?.status ?? "?"})`
      );
    }
  };

  // ====== Delete ======
  const confirmDelete = (row) => {
    setCurrent(row);
    setOpenDelete(true);
  };

  const doDelete = async () => {
    if (!current) return;
    try {
      await axios.delete(`${API}/results/${current.id}`, {
        headers: getAuthHeaders(),
      });
      alert("Deleted successfully!");
      setOpenDelete(false);
      setCurrent(null);

      const lastPage = Math.max(1, Math.ceil((total - 1) / perPage));
      fetchResults(Math.min(page, lastPage));
    } catch (err) {
      console.error("DELETE /results error:", err?.response?.status, err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Delete failed!");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  // Khi đổi filter → về trang 1
  const onChangeRStatus = (v) => { setRStatus(v); setPage(1); };
  const onChangeAccount = (v) => { setFAccount(v); setPage(1); };
  const onChangeCourse  = (v) => { setFCourse(v); setPage(1); };
  const onChangeMinMark = (v) => { setMinMark(v); setPage(1); };
  const onChangeMaxMark = (v) => { setMaxMark(v); setPage(1); };

  const resetFilters = () => {
    setRStatus(""); setFAccount(""); setFCourse("");
    setMinMark(""); setMaxMark(""); setQuery(""); setPage(1);
    fetchResults(1);
  };

  return (
    <div className="card-section">
      <div className="um-header">
        <div className="um-title">Results Management</div>

        {/* Row 1: Filters + Search */}
        <div className="um-row1">
          <div className="um-filters">
            <select value={rstatus} onChange={(e) => onChangeRStatus(e.target.value)}>
              <option value="">-- Filter by Result Status --</option>
              <option value="Passed">Passed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

            <select value={fAccount} onChange={(e) => onChangeAccount(e.target.value)}>
              <option value="">-- Filter by Account --</option>
              {accountOpts.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            <select value={fCourse} onChange={(e) => onChangeCourse(e.target.value)}>
              <option value="">-- Filter by Course --</option>
              {courseOpts.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* 👇 cùng style với select nhờ class filter-input */}
            <input
              type="number"
              step="0.01"
              placeholder="Min Mark"
              value={minMark}
              onChange={(e) => onChangeMinMark(e.target.value)}
              className="filter-input"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Max Mark"
              value={maxMark}
              onChange={(e) => onChangeMaxMark(e.target.value)}
              className="filter-input"
            />

            <button className="btn sm ghost" type="button" onClick={resetFilters}>
              Reset
            </button>
          </div>

          <div className="search-box">
            <input
              placeholder="Search by id / ResultCode / AccountID / CourseID / Content"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchResults(1)}
            />
            <button className="btn sm" onClick={() => fetchResults(1)}>Search</button>
          </div>
        </div>

        <div className="um-row2">
          <button className="btn" onClick={() => setOpenCreate(true)}>+ Add result</button>
          <button className="btn ghost" onClick={() => navigate("/admin")}>← Back to Dashboard</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th>id</th>
              <th>ResultCode</th>
              <th>AccountID</th>
              <th>CourseID</th>
              <th>Content</th>
              <th>Mark</th>
              <th>RStatus</th>
              <th style={{ width: 140 }} className="center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="center muted">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={9} className="center muted">No data</td></tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={r.id}>
                  <td>{(page - 1) * perPage + idx + 1}</td>
                  <td className="muted">{r.id}</td>
                  <td className="muted">{r.ResultCode}</td>
                  <td>{r.AccountID}</td>
                  <td>{r.CourseID}</td>
                  <td title={r.Content}>{r.Content}</td>
                  <td>{fmtNum(r.Mark)}</td>
                  <td><span className={badgeRStatus(r.RStatus)}>{r.RStatus || "-"}</span></td>
                  <td className="center">
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      <button className="btn sm" onClick={() => openEditModal(r)}>Edit</button>
                      <button className="btn sm danger" onClick={() => confirmDelete(r)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button className="btn sm ghost" disabled={page <= 1 || loading} onClick={() => fetchResults(page - 1)}>← Prev</button>
        <span className="muted">Page {page} / {Math.max(1, Math.ceil(total / perPage))}</span>
        <button className="btn sm ghost" disabled={page >= Math.max(1, Math.ceil(total / perPage)) || loading} onClick={() => fetchResults(page + 1)}>Next →</button>
        <select className="pp" value={perPage} onChange={(e) => setPerPage(parseInt(e.target.value || "10", 10))}>
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>

      {/* Create Modal */}
      {openCreate && (
        <div className="modal-overlay" onClick={() => setOpenCreate(false)}>
          <div className="modal-profile" onClick={(e) => e.stopPropagation()}>
            <div className="profile-header-modal">
              <h2>Create new result</h2>
              <p className="muted">Use this form to add a new result</p>
            </div>

            <form className="settings-form1" onSubmit={submitCreate}>
              <div className="form-section1">
                <div className="form-group1">
                  <label>AccountID</label>
                  <select
                    value={createForm.AccountID}
                    onChange={(e) => setCreateForm({ ...createForm, AccountID: e.target.value })}
                    required
                  >
                    <option value="">-- choose account --</option>
                    {accountOpts.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div className="form-group1">
                  <label>CourseID</label>
                  <select
                    value={createForm.CourseID}
                    onChange={(e) => setCreateForm({ ...createForm, CourseID: e.target.value })}
                    required
                  >
                    <option value="">-- choose course --</option>
                    {courseOpts.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group1">
                  <label>Content</label>
                  <input
                    value={createForm.Content}
                    onChange={(e) => setCreateForm({ ...createForm, Content: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group1">
                  <label>Mark</label>
                  <input
                    type="number"
                    step="0.01"
                    value={createForm.Mark}
                    onChange={(e) => setCreateForm({ ...createForm, Mark: e.target.value })}
                    required
                    className="filter-input"
                  />
                </div>

                <div className="form-group1">
                  <label>RStatus</label>
                  <select
                    value={createForm.RStatus}
                    onChange={(e) => setCreateForm({ ...createForm, RStatus: e.target.value })}
                  >
                    <option value="Passed">Passed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div className="profile-actions">
                <button type="button" className="btn ghost" onClick={() => setOpenCreate(false)}>Cancel</button>
                <button type="submit" className="btn">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit & Delete modals giữ nguyên như trước (không đổi UI) */}
      {openEdit && (
        <div className="modal-overlay" onClick={() => setOpenEdit(false)}>
          <div className="modal-profile" onClick={(e) => e.stopPropagation()}>
            <div className="profile-header-modal">
              <h2>Edit result</h2>
              <p className="muted">Update the selected result</p>
            </div>

            <form className="settings-form1" onSubmit={submitEdit}>
              <div className="form-section1">
                <div className="form-group1">
                  <label>id</label>
                  <input value={editForm.id} disabled />
                </div>

                <div className="form-group1">
                  <label>ResultCode</label>
                  <input value={editForm.ResultCode} disabled />
                </div>

                <div className="form-group1">
                  <label>AccountID</label>
                  <select
                    value={editForm.AccountID}
                    onChange={(e) => setEditForm({ ...editForm, AccountID: e.target.value })}
                    required
                  >
                    <option value="">-- choose account --</option>
                    {accountOpts.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div className="form-group1">
                  <label>CourseID</label>
                  <select
                    value={editForm.CourseID}
                    onChange={(e) => setEditForm({ ...editForm, CourseID: e.target.value })}
                    required
                  >
                    <option value="">-- choose course --</option>
                    {courseOpts.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group1">
                  <label>Content</label>
                  <input
                    value={editForm.Content}
                    onChange={(e) => setEditForm({ ...editForm, Content: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group1">
                  <label>Mark</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.Mark}
                    onChange={(e) => setEditForm({ ...editForm, Mark: e.target.value })}
                    required
                    className="filter-input"
                  />
                </div>

                <div className="form-group1">
                  <label>RStatus</label>
                  <select
                    value={editForm.RStatus}
                    onChange={(e) => setEditForm({ ...editForm, RStatus: e.target.value })}
                  >
                    <option value="">(none)</option>
                    <option value="Passed">Passed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div className="profile-actions">
                <button type="button" className="btn ghost" onClick={() => setOpenEdit(false)}>Cancel</button>
                <button type="submit" className="btn">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openDelete && (
        <div className="modal-overlay" onClick={() => setOpenDelete(false)}>
          <div className="modal-profile" onClick={(e) => e.stopPropagation()}>
            <div className="profile-header-modal">
              <h2>Delete result</h2>
              <p className="muted">
                Are you sure you want to delete <strong>{current?.ResultCode || `id=${current?.id}`}</strong>?
              </p>
            </div>
            <div className="profile-actions">
              <button className="btn ghost" onClick={() => setOpenDelete(false)}>Cancel</button>
              <button className="btn danger" onClick={doDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
    