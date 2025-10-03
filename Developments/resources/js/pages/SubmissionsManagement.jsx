import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/UserManagement.css"; // tái dùng style

const API = "http://127.0.0.1:8000/api";
const BE = API.replace("/api", "");

// Biến URL tương đối -> tuyệt đối (tránh bị React Router bắt route)
const toAbsoluteFileUrl = (u) => {
    if (!u) return null;
    return /^https?:\/\//i.test(u) ? u : `${BE}/${u.replace(/^\/?/, "")}`;
};

export default function SubmissionsManagement() {
    const navigate = useNavigate();

    // ===== Filters / Search / Paging =====
    const [status, setStatus] = useState(""); // Submitted/Late
    const [role, setRole] = useState(""); // Admin/Instructor/Learner (từ accounts)
    const [approval, setApproval] = useState(""); // Approved/Pending/Rejected (từ accounts)
    const [query, setQuery] = useState("");

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // ===== Data =====
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    // ===== Modals =====
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [current, setCurrent] = useState(null);
    const [viewRow, setViewRow] = useState(null);

    // ===== Auth header =====
    const getAuthHeaders = () => {
        const token = localStorage.getItem("token") || "";
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // ===== Helpers =====
    const fmtDate = (s) => {
        if (!s) return "-";
        const str = String(s).includes(" ")
            ? String(s).replace(" ", "T")
            : String(s);
        const d = new Date(str);
        return isNaN(d.getTime()) ? String(s) : d.toLocaleString();
    };

    const badgeStatusClass = (st) => {
        if (!st) return "pill gray";
        const k = String(st).toLowerCase();
        if (k === "submitted") return "pill learner";
        if (k === "late") return "pill gray";
        return "pill gray";
    };

    // Sắp xếp tự nhiên theo SubID (tiền tố chữ, rồi số)
    const naturalSubSort = (a, b) => {
        const sa = String(a.SubID || "");
        const sb = String(b.SubID || "");
        const ma = sa.match(/^([A-Za-z]+)(\d+)/) || [];
        const mb = sb.match(/^([A-Za-z]+)(\d+)/) || [];
        const pa = (ma[1] || "").toUpperCase();
        const pb = (mb[1] || "").toUpperCase();
        if (pa !== pb) return pa.localeCompare(pb);
        const na = ma[2] ? parseInt(ma[2], 10) : Number.MAX_SAFE_INTEGER;
        const nb = mb[2] ? parseInt(mb[2], 10) : Number.MAX_SAFE_INTEGER;
        return na - nb;
    };

    // ===== API: list =====
    const fetchSubmissions = async (newPage = 1) => {
        setLoading(true);
        try {
            const params = { page: newPage, per_page: perPage };
            if (status) params.status = status;
            if (role) params.role = role;
            if (approval) params.approval = approval;
            if (query) params.search = query;

            const res = await axios.get(`${API}/submissions`, {
                params,
                headers: getAuthHeaders(),
            });

            let data = Array.isArray(res.data)
                ? res.data
                : res.data.data || res.data.items || [];
            let metaTotal = res.data.total ?? data.length;
            let metaPer = res.data.per_page ?? perPage;
            let metaPage = res.data.page ?? res.data.current_page ?? newPage;

            // Nếu BE trả mảng thô → tự lọc + sort + paginate tại client
            if (Array.isArray(res.data)) {
                data = data.filter((r) => {
                    const q = query.trim().toLowerCase();
                    const byQ = q
                        ? String(r.SubID || "")
                              .toLowerCase()
                              .includes(q) ||
                          String(r.AccountID || "")
                              .toLowerCase()
                              .includes(q) ||
                          String(r.CourseID || "")
                              .toLowerCase()
                              .includes(q) ||
                          String(r.Feedback || "")
                              .toLowerCase()
                              .includes(q)
                        : true;
                    const byStatus = status
                        ? String(r.SStatus || "").toLowerCase() ===
                          status.toLowerCase()
                        : true;
                    const byRole = role
                        ? String(r.ARole || "").toLowerCase() ===
                          role.toLowerCase()
                        : true;
                    const byApproval = approval
                        ? String(r.ApprovalStatus || "").toLowerCase() ===
                          approval.toLowerCase()
                        : true;
                    return byQ && byStatus && byRole && byApproval;
                });

                data.sort(naturalSubSort);

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
            console.error(
                "GET /submissions error:",
                err?.response?.status,
                err?.response?.data || err.message
            );
            alert(
                err?.response?.data?.message || "Failed to load submissions."
            );
        } finally {
            setLoading(false);
        }
    };

    // Auto fetch khi đổi filter/perPage
    useEffect(() => {
        fetchSubmissions(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, role, approval, perPage]);

    // ===== API: show 1 item =====
    const fetchSubmission = async (subId) => {
        const res = await axios.get(`${API}/submissions/${subId}`, {
            headers: getAuthHeaders(),
        });
        return res.data?.data;
    };

    // ====== Create ======
    const [createForm, setCreateForm] = useState({
        SubID: "",
        AccountID: "",
        CourseID: "",
        Mark: "",
        Feedback: "",
        SDate: "",
        SStatus: "Submitted",
    });
    const [createFile, setCreateFile] = useState(null);

    const submitCreate = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append("SubID", createForm.SubID || "");
            fd.append("AccountID", createForm.AccountID || "");
            fd.append("CourseID", createForm.CourseID || "");
            if (createFile) fd.append("Answer", createFile);
            if (createForm.Mark !== "") fd.append("Mark", createForm.Mark);
            if (createForm.Feedback) fd.append("Feedback", createForm.Feedback);
            if (createForm.SDate) fd.append("SDate", createForm.SDate);
            if (createForm.SStatus) fd.append("SStatus", createForm.SStatus);

            await axios.post(`${API}/submissions`, fd, {
                headers: getAuthHeaders(),
            });

            alert("Created successfully!");
            setOpenCreate(false);
            setCreateForm({
                SubID: "",
                AccountID: "",
                CourseID: "",
                Mark: "",
                Feedback: "",
                SDate: "",
                SStatus: "Submitted",
            });
            setCreateFile(null);
            fetchSubmissions(page);
        } catch (err) {
            console.error(
                "CREATE /submissions error:",
                err?.response?.status,
                err?.response?.data || err.message
            );
            alert(err?.response?.data?.message || "Create failed!");
        }
    };

    // ====== Edit ======
    const [editForm, setEditForm] = useState({
        SubID: "",
        AccountID: "",
        CourseID: "",
        Mark: "",
        Feedback: "",
        SDate: "",
        SStatus: "",
        Answer: "",
    });
    const [editFile, setEditFile] = useState(null);

    const openEditModal = async (row) => {
        try {
            const fresh = await fetchSubmission(row.SubID);
            const r = fresh || row;
            setCurrent(r);
            setEditForm({
                SubID: r.SubID || "",
                AccountID: r.AccountID || "",
                CourseID: r.CourseID || "",
                Mark: r.Mark ?? "",
                Feedback: r.Feedback || "",
                SDate: (r.SDate || "").replace(" ", "T"),
                SStatus: r.SStatus || "",
                Answer: r.Answer || "",
            });
            setEditFile(null);
            setOpenEdit(true);
        } catch {
            alert("Failed to load submission details.");
        }
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        if (!current) return;

        try {
            const fd = new FormData();
            fd.append("_method", "PUT");
            if (editForm.SubID) fd.append("SubID", editForm.SubID);
            if (editForm.AccountID) fd.append("AccountID", editForm.AccountID);
            if (editForm.CourseID) fd.append("CourseID", editForm.CourseID);
            if (editForm.Mark !== "") fd.append("Mark", editForm.Mark);
            if (editForm.Feedback) fd.append("Feedback", editForm.Feedback);
            if (editForm.SDate) fd.append("SDate", editForm.SDate);
            if (editForm.SStatus) fd.append("SStatus", editForm.SStatus);
            if (editFile) fd.append("Answer", editFile);

            // Dùng POST + _method=PUT để hỗ trợ multipart tốt hơn
            await axios.post(`${API}/submissions/${current.SubID}`, fd, {
                headers: getAuthHeaders(),
            });

            alert("Updated successfully!");
            setOpenEdit(false);
            setCurrent(null);
            setEditFile(null);
            fetchSubmissions(page);
        } catch (err) {
            console.error(
                "UPDATE /submissions error:",
                err?.response?.status,
                err?.response?.data || err.message
            );
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                `Update failed!`;
            alert(msg);
        }
    };

    // ====== View ======
    const openViewModal = async (row) => {
        try {
            const fresh = await fetchSubmission(row.SubID);
            setViewRow(fresh || row);
            setOpenView(true);
        } catch {
            alert("Failed to load submission details.");
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
            await axios.delete(`${API}/submissions/${current.SubID}`, {
                headers: getAuthHeaders(),
            });
            alert("Deleted successfully!");
            setOpenDelete(false);
            setCurrent(null);

            const lastPage = Math.max(1, Math.ceil((total - 1) / perPage));
            fetchSubmissions(Math.min(page, lastPage));
        } catch (err) {
            console.error(
                "DELETE /submissions error:",
                err?.response?.status,
                err?.response?.data || err.message
            );
            alert(err?.response?.data?.message || "Delete failed!");
        }
    };

    const totalPages = Math.max(1, Math.ceil(total / perPage));

    return (
        <div className="card-section">
            {/* ===== Header ===== */}
            <div className="um-header">
                <div className="um-title">Submissions Management</div>

                {/* Row 1: Filters + Search */}
                <div className="um-row1">
                    <div
                        className="um-filters"
                        style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                    >
                        <select
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">-- Filter by Role --</option>
                            <option value="Admin">Admin</option>
                            <option value="Instructor">Instructor</option>
                            <option value="Learner">Learner</option>
                        </select>

                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">-- Filter by Status --</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Late">Late</option>
                        </select>

                        <select
                            value={approval}
                            onChange={(e) => {
                                setApproval(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">-- Filter by Approval --</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="search-box">
                        <input
                            placeholder="Search by sub/account/course/feedback…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && fetchSubmissions(1)
                            }
                        />
                        <button
                            className="btn sm"
                            onClick={() => fetchSubmissions(1)}
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Row 2: Add + Back */}
                <div className="um-row2">
                    <button className="btn" onClick={() => setOpenCreate(true)}>
                        + Add new submission
                    </button>

                    <button
                        className="btn ghost"
                        onClick={() => navigate("/admin")}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>

            {/* ===== Table ===== */}
            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ width: 60 }}>#</th>
                            <th>SubID</th>
                            <th>AccountID</th>
                            <th>CourseID</th>
                            <th>Answer</th>
                            <th>Mark</th>
                            <th>Feedback</th>
                            <th>Submit date</th>
                            <th>Status</th>
                            <th style={{ width: 220 }} className="center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={10} className="center muted">
                                    Loading...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="center muted">
                                    No data
                                </td>
                            </tr>
                        ) : (
                            rows.map((r, idx) => {
                                // Ưu tiên AnswerUrl BE trả; fallback từ Answer -> /storage/...
                                const answerHref = r.AnswerUrl
                                    ? toAbsoluteFileUrl(r.AnswerUrl)
                                    : r.Answer
                                    ? toAbsoluteFileUrl(`storage/${r.Answer}`)
                                    : null;

                                // Hoặc bạn có thể dùng endpoint download:
                                // const answerHref = `${API}/submissions/${r.SubID}/download`;

                                return (
                                    <tr key={r.SubID || idx}>
                                        <td>
                                            {(page - 1) * perPage + idx + 1}
                                        </td>
                                        <td className="muted">{r.SubID}</td>
                                        <td>{r.AccountID}</td>
                                        <td>{r.CourseID}</td>
                                        <td>
                                            {answerHref ? (
                                                <a
                                                    className="btn sm ghost"
                                                    href={answerHref}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download
                                                >
                                                    Download
                                                </a>
                                            ) : (
                                                <span className="muted">-</span>
                                            )}
                                        </td>
                                        <td>{r.Mark ?? "-"}</td>
                                        <td
                                            className="muted"
                                            title={r.Feedback || ""}
                                        >
                                            {r.Feedback || "-"}
                                        </td>
                                        <td className="muted">
                                            {fmtDate(r.SDate)}
                                        </td>
                                        <td>
                                            <span
                                                className={badgeStatusClass(
                                                    r.SStatus
                                                )}
                                            >
                                                {r.SStatus || "-"}
                                            </span>
                                        </td>
                                        <td className="center">
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: 8,
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <button
                                                    className="btn sm ghost"
                                                    onClick={() =>
                                                        openViewModal(r)
                                                    }
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className="btn sm"
                                                    onClick={() =>
                                                        openEditModal(r)
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn sm danger"
                                                    onClick={() =>
                                                        confirmDelete(r)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* ===== Pagination ===== */}
            <div className="pagination">
                <button
                    className="btn sm ghost"
                    disabled={page <= 1 || loading}
                    onClick={() => fetchSubmissions(page - 1)}
                >
                    ← Prev
                </button>

                <span className="muted">
                    Page {page} / {totalPages}
                </span>

                <button
                    className="btn sm ghost"
                    disabled={page >= totalPages || loading}
                    onClick={() => fetchSubmissions(page + 1)}
                >
                    Next →
                </button>

                <select
                    className="pp"
                    value={perPage}
                    onChange={(e) =>
                        setPerPage(parseInt(e.target.value || "10", 10))
                    }
                >
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                </select>
            </div>

            {/* ===== Modal: Create ===== */}
            {openCreate && (
                <div
                    className="modal-overlay"
                    onClick={() => setOpenCreate(false)}
                >
                    <div
                        className="modal-profile"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="profile-header-modal">
                            <h2>Create new submission</h2>
                            <p className="muted">
                                Use this form to add a submission
                            </p>
                        </div>

                        <form
                            className="settings-form1"
                            onSubmit={submitCreate}
                        >
                            <div className="form-section1">
                                <div className="form-group1">
                                    <label>SubID</label>
                                    <input
                                        value={createForm.SubID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                SubID: e.target.value,
                                            })
                                        }
                                        placeholder="VD: S025 (để trống nếu BE tự sinh)"
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>AccountID</label>
                                    <input
                                        value={createForm.AccountID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                AccountID: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>CourseID</label>
                                    <input
                                        value={createForm.CourseID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                CourseID: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Answer file</label>
                                    <input
                                        type="file"
                                        onChange={(e) =>
                                            setCreateFile(
                                                e.target.files?.[0] || null
                                            )
                                        }
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Mark</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={createForm.Mark}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                Mark: e.target.value,
                                            })
                                        }
                                        placeholder="VD: 8.5"
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Feedback</label>
                                    <input
                                        value={createForm.Feedback}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                Feedback: e.target.value,
                                            })
                                        }
                                        placeholder="Comment…"
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Submit date</label>
                                    <input
                                        type="datetime-local"
                                        value={createForm.SDate}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                SDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Status</label>
                                    <select
                                        value={createForm.SStatus}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                SStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Submitted">
                                            Submitted
                                        </option>
                                        <option value="Late">Late</option>
                                    </select>
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button
                                    type="button"
                                    className="btn ghost"
                                    onClick={() => setOpenCreate(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===== Modal: View (đẹp) ===== */}
            {openView && viewRow && (
                <div
                    className="modal-overlay"
                    onClick={() => setOpenView(false)}
                >
                    <div
                        className="modal-view"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="view-head">
                            <div className="title-wrap">
                                <div className="title-icon">📄</div>
                                <div>
                                    <h3>Submission details</h3>
                                    <p className="subtle">
                                        SubID: {viewRow.SubID}
                                    </p>
                                </div>
                            </div>
                            <button
                                className="btn icon ghost"
                                onClick={() => setOpenView(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <hr className="soft" />

                        {/* Body */}
                        <div className="view-body">
                            <div className="kv">
                                <span className="k">Account</span>
                                <span className="v">
                                    {viewRow.AccountID || "-"}
                                </span>
                            </div>

                            <div className="kv">
                                <span className="k">Course</span>
                                <span className="v">
                                    {viewRow.CourseID || "-"}
                                </span>
                            </div>

                            <div className="kv">
                                <span className="k">Mark</span>
                                <span className="v">{viewRow.Mark ?? "-"}</span>
                            </div>

                            <div className="kv">
                                <span className="k">Submit date</span>
                                <span className="v">
                                    {fmtDate(viewRow.SDate)}
                                </span>
                            </div>

                            <div className="kv">
                                <span className="k">Status</span>
                                <span className="v">
                                    <span
                                        className={`pill status ${String(
                                            viewRow.SStatus || ""
                                        ).toLowerCase()}`}
                                    >
                                        {viewRow.SStatus || "-"}
                                    </span>
                                </span>
                            </div>

                            <div className="kv span-2">
                                <span className="k">Feedback</span>
                                <span className="v text-block">
                                    {viewRow.Feedback || "-"}
                                </span>
                            </div>

                            {(viewRow.AnswerUrl || viewRow.Answer) && (
                                <div className="kv span-2">
                                    <span className="k">Answer file</span>
                                    <span className="v">
                                        <a
                                            className="btn soft"
                                            href={
                                                viewRow.AnswerUrl
                                                    ? toAbsoluteFileUrl(
                                                          viewRow.AnswerUrl
                                                      )
                                                    : toAbsoluteFileUrl(
                                                          `storage/${viewRow.Answer}`
                                                      )
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                        >
                                            ⬇️ Download answer
                                        </a>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="view-actions">
                            <button
                                className="btn primary"
                                onClick={() => setOpenView(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== Modal: Edit ===== */}
            {openEdit && (
                <div
                    className="modal-overlay"
                    onClick={() => setOpenEdit(false)}
                >
                    <div
                        className="modal-profile"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="profile-header-modal">
                            <h2>Edit submission</h2>
                            <p className="muted">
                                Update the selected submission
                            </p>
                        </div>

                        <form className="settings-form1" onSubmit={submitEdit}>
                            <div className="form-section1">
                                <div className="form-group1">
                                    <label>SubID</label>
                                    <input
                                        value={editForm.SubID}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                SubID: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>AccountID</label>
                                    <input
                                        value={editForm.AccountID}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                AccountID: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>CourseID</label>
                                    <input
                                        value={editForm.CourseID}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                CourseID: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Answer file</label>
                                    <input
                                        type="file"
                                        onChange={(e) =>
                                            setEditFile(
                                                e.target.files?.[0] || null
                                            )
                                        }
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Mark</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={editForm.Mark}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                Mark: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Feedback</label>
                                    <input
                                        value={editForm.Feedback}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                Feedback: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Submit date</label>
                                    <input
                                        type="datetime-local"
                                        value={editForm.SDate}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                SDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Status</label>
                                    <select
                                        value={editForm.SStatus}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                SStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">(none)</option>
                                        <option value="Submitted">
                                            Submitted
                                        </option>
                                        <option value="Late">Late</option>
                                    </select>
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button
                                    type="button"
                                    className="btn ghost"
                                    onClick={() => setOpenEdit(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn">
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===== Modal: Delete confirm ===== */}
            {openDelete && (
                <div
                    className="modal-overlay"
                    onClick={() => setOpenDelete(false)}
                >
                    <div
                        className="modal-profile"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="profile-header-modal">
                            <h2>Delete submission</h2>
                            <p className="muted">
                                Are you sure you want to delete{" "}
                                <strong>{current?.SubID}</strong> (Account{" "}
                                {current?.AccountID})?
                            </p>
                        </div>
                        <div className="profile-actions">
                            <button
                                className="btn ghost"
                                onClick={() => setOpenDelete(false)}
                            >
                                Cancel
                            </button>
                            <button className="btn danger" onClick={doDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
