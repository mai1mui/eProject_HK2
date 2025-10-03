import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/UserManagement.css";

const API = "http://127.0.0.1:8000/api";

export default function FeedbackManagement() {
    const navigate = useNavigate();

    // ==== Filters/Search/Paging ====
    const [status, setStatus] = useState(""); // Processed / Waiting
    const [rating, setRating] = useState(""); // 1..5
    const [reply, setReply] = useState(""); // with / none / ""
    const [query, setQuery] = useState("");

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // ==== Data ====
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    // ==== Modals: View / Edit / Delete ====
    const [openView, setOpenView] = useState(false);
    const [viewRow, setViewRow] = useState(null);

    const [openEdit, setOpenEdit] = useState(false);
    const [current, setCurrent] = useState(null);
    const [editForm, setEditForm] = useState({
        Content: "",
        Rate: "",
        FStatus: "",
        AdminReply: "",
    });

    const [openDelete, setOpenDelete] = useState(false);

    // ==== Modal: Create ====
    const [openCreate, setOpenCreate] = useState(false);
    const [createForm, setCreateForm] = useState({
        FeedbackID: "",
        AccountID: "",
        Content: "",
        Rate: "5",
        FStatus: "Waiting",
        AdminReply: "",
    });

    const headers = useMemo(
        () => ({
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        }),
        []
    );

    // ==== Helpers ====
    const fmtDate = (s) => {
        if (!s) return "-";
        const str = String(s).includes(" ")
            ? String(s).replace(" ", "T")
            : String(s);
        const d = new Date(str);
        return isNaN(d.getTime()) ? String(s) : d.toLocaleString();
    };

    const Stars = ({ value = 0, size = "sm" }) => (
        <span className={`stars stars-${size}`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    className={i < parseInt(value || 0, 10) ? "on" : ""}
                >
                    ★
                </span>
            ))}
        </span>
    );

    // ==== Fetch list ====
    const fetchRows = async (newPage = 1, override = {}) => {
        setLoading(true);
        try {
            const params = {
                page: newPage,
                per_page: perPage,
            };

            const effStatus = override.status ?? status;
            const effRating = override.rating ?? rating;
            const effReply = override.reply ?? reply;
            const effQuery = override.query ?? query;

            if (effQuery) params.search = effQuery;
            if (effStatus) params.status = effStatus;
            if (effRating) params.rating = effRating;
            if (effReply) params.reply = effReply;

            const res = await axios.get(`${API}/feedback`, { params, headers });

            let data = Array.isArray(res.data)
                ? res.data
                : res.data.data || res.data.items || [];
            let metaTotal = res.data.total ?? data.length;
            let metaPer = res.data.per_page ?? perPage;
            let metaPage = res.data.page ?? newPage;

            if (Array.isArray(res.data)) {
                data = data.filter((r) => {
                    const byStatus = effStatus
                        ? String(r.FStatus).toLowerCase() ===
                          effStatus.toLowerCase()
                        : true;
                    const byRating = effRating
                        ? String(r.Rate) === String(effRating)
                        : true;
                    const byReply =
                        effReply === "with"
                            ? r.AdminReply !== null &&
                              r.AdminReply !== undefined &&
                              String(r.AdminReply).trim() !== ""
                            : effReply === "none"
                            ? r.AdminReply === null ||
                              r.AdminReply === undefined ||
                              String(r.AdminReply).trim() === ""
                            : true;
                    const byQuery = effQuery
                        ? String(r.Content || "")
                              .toLowerCase()
                              .includes(effQuery.toLowerCase()) ||
                          String(r.FeedbackID || "")
                              .toLowerCase()
                              .includes(effQuery.toLowerCase()) ||
                          String(r.AccountID || "")
                              .toLowerCase()
                              .includes(effQuery.toLowerCase())
                        : true;
                    return byStatus && byRating && byReply && byQuery;
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
        } catch (e) {
            console.error(e);
            alert("Failed to load feedback.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRows(1); /* eslint-disable-next-line */
    }, [perPage]);
    useEffect(() => {
        fetchRows(1); /* eslint-disable-next-line */
    }, [status, rating, reply]);

    const totalPages = Math.max(1, Math.ceil(total / perPage));

    // ==== Actions ====
    const openViewModal = (row) => {
        setViewRow(row);
        setOpenView(true);
    };
    const openEditModal = (row) => {
        setCurrent(row);
        setEditForm({
            Content: row.Content || "",
            Rate: row.Rate || "",
            FStatus: row.FStatus || "",
            AdminReply: row.AdminReply || "",
        });
        setOpenEdit(true);
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        if (!current) return;
        try {
            await axios.put(`${API}/feedback/${current.FeedbackID}`, editForm, {
                headers,
            });
            alert("Updated successfully!");
            setOpenEdit(false);
            setCurrent(null);
            fetchRows(page);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Update failed!");
        }
    };

    const sendReply = async () => {
        if (!current) return;
        if (!editForm.AdminReply || !String(editForm.AdminReply).trim()) {
            alert("Please enter a reply.");
            return;
        }
        try {
            await axios.put(
                `${API}/feedback/${current.FeedbackID}`,
                { AdminReply: editForm.AdminReply, FStatus: "Processed" },
                { headers }
            );
            alert("Reply sent!");
            setOpenEdit(false);
            setCurrent(null);
            fetchRows(page);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Send reply failed!");
        }
    };

    const confirmDelete = (row) => {
        setCurrent(row);
        setOpenDelete(true);
    };
    const doDelete = async () => {
        if (!current) return;
        try {
            await axios.delete(`${API}/feedback/${current.FeedbackID}`, {
                headers,
            });
            alert("Deleted successfully!");
            setOpenDelete(false);
            setCurrent(null);
            const lastPage = Math.max(1, Math.ceil((total - 1) / perPage));
            fetchRows(Math.min(page, lastPage));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Delete failed!");
        }
    };

    const submitCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/feedback`, createForm, { headers });
            alert("Created successfully!");
            setOpenCreate(false);
            setCreateForm({
                FeedbackID: "",
                AccountID: "",
                Content: "",
                Rate: "5",
                FStatus: "Waiting",
                AdminReply: "",
            });
            fetchRows(1);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Create failed!");
        }
    };

    return (
        <div className="card-section">
            {/* ===== Header ===== */}
            <div className="um-header">
                <div className="um-title">Feedback Management</div>

                {/* Row 1: Filters + Search */}
                <div className="um-row1">
                    <div className="um-filters">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">-- Filter by Status --</option>
                            <option value="Processed">Processed</option>
                            <option value="Waiting">Waiting</option>
                        </select>

                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        >
                            <option value="">-- Filter by Rating --</option>
                            <option value="5">5 stars</option>
                            <option value="4">4 stars</option>
                            <option value="3">3 stars</option>
                            <option value="2">2 stars</option>
                            <option value="1">1 star</option>
                        </select>

                        <select
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                        >
                            <option value="">-- Filter by Reply --</option>
                            <option value="with">With reply</option>
                            <option value="none">No reply</option>
                        </select>
                    </div>

                    <div className="search-box">
                        <input
                            placeholder="Search by feedback/account/content"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && fetchRows(1)}
                        />
                        <button className="btn sm" onClick={() => fetchRows(1)}>
                            Search
                        </button>
                    </div>
                </div>

                {/* Row 2: Create + Back */}
                <div className="um-row2">
                    <button className="btn" onClick={() => setOpenCreate(true)}>
                        + Add new feedback
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
            <div className="table-wrap pro">
                <table className="table pro">
                    <thead>
                        <tr>
                            <th style={{ width: 60 }}>#</th>
                            <th>FeedbackID</th>
                            <th>User</th>
                            <th>Rate</th>
                            <th>Content</th>
                            <th>Reply</th>
                            <th>Response date</th>
                            <th>Status</th>
                            <th className="center" style={{ width: 160 }}>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={9} className="center muted">
                                    Loading...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="center muted">
                                    No data
                                </td>
                            </tr>
                        ) : (
                            rows.map((r, idx) => (
                                <tr key={r.FeedbackID || idx}>
                                    <td className="row-number">
                                        {(page - 1) * perPage + idx + 1}
                                    </td>
                                    <td className="muted">{r.FeedbackID}</td>
                                    <td>{r.AccountID}</td>
                                    <td>
                                        <Stars value={r.Rate} />
                                    </td>
                                    <td
                                        className="muted cell-ellipsis"
                                        title={r.Content || ""}
                                    >
                                        {r.Content || "-"}
                                    </td>
                                    <td
                                        className="muted cell-ellipsis"
                                        title={r.AdminReply || ""}
                                    >
                                        {r.AdminReply ? (
                                            r.AdminReply
                                        ) : (
                                            <span className="pill status waiting">
                                                No reply
                                            </span>
                                        )}
                                    </td>
                                    <td className="muted">
                                        {fmtDate(r.CreatedAt)}
                                    </td>
                                    <td>
                                        <span
                                            className={`pill status ${String(
                                                r.FStatus || ""
                                            ).toLowerCase()}`}
                                        >
                                            {r.FStatus || "-"}
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
                                                onClick={() => {
                                                    setViewRow(r);
                                                    setOpenView(true);
                                                }}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="btn sm"
                                                onClick={() => openEditModal(r)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn sm danger"
                                                onClick={() => confirmDelete(r)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ===== Pagination ===== */}
            <div className="pagination">
                <button
                    className="btn sm ghost"
                    disabled={page <= 1 || loading}
                    onClick={() => fetchRows(page - 1)}
                >
                    ← Prev
                </button>
                <span className="muted">
                    Page {page} / {totalPages}
                </span>
                <button
                    className="btn sm ghost"
                    disabled={page >= totalPages || loading}
                    onClick={() => fetchRows(page + 1)}
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

            {/* ===== Modal: View (pretty) ===== */}
            {openView && viewRow && (
                <div
                    className="modal-overlay"
                    onClick={() => setOpenView(false)}
                >
                    <div
                        className="modal-view"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="view-head">
                            <div className="title-wrap">
                                <div className="title-icon">💬</div>
                                <div>
                                    <h3>Feedback details</h3>
                                    <p className="subtle">
                                        ID: {viewRow.FeedbackID}
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
                        <div className="view-body">
                            <div className="kv">
                                <span className="k">User</span>
                                <span className="v">
                                    {viewRow.AccountID || "-"}
                                </span>
                            </div>
                            <div className="kv">
                                <span className="k">Rate</span>
                                <span className="v">
                                    <Stars value={viewRow.Rate} />
                                </span>
                            </div>
                            <div className="kv span-2">
                                <span className="k">Content</span>
                                <span className="v text-block">
                                    {viewRow.Content || "-"}
                                </span>
                            </div>
                            <div className="kv">
                                <span className="k">Response date</span>
                                <span className="v">
                                    {fmtDate(viewRow.CreatedAt)}
                                </span>
                            </div>
                            <div className="kv">
                                <span className="k">Status</span>
                                <span className="v">
                                    <span
                                        className={`pill status ${String(
                                            viewRow.FStatus || ""
                                        ).toLowerCase()}`}
                                    >
                                        {viewRow.FStatus || "-"}
                                    </span>
                                </span>
                            </div>
                            {viewRow.AdminReply ? (
                                <div className="kv span-2">
                                    <span className="k">Admin reply</span>
                                    <span className="v text-block">
                                        {viewRow.AdminReply}
                                    </span>
                                </div>
                            ) : null}
                        </div>
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
                            <h2>Create new feedback</h2>
                            <p className="muted">
                                Use this form to add a new feedback
                            </p>
                        </div>
                        <form
                            className="settings-form1"
                            onSubmit={submitCreate}
                        >
                            <div className="form-section1">
                                <div className="form-group1">
                                    <label>FeedbackID</label>
                                    <input
                                        value={createForm.FeedbackID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                FeedbackID: e.target.value,
                                            })
                                        }
                                        placeholder="e.g. F015"
                                        required
                                    />
                                </div>
                                <div className="form-group1">
                                    <label>User (AccountID)</label>
                                    <input
                                        value={createForm.AccountID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                AccountID: e.target.value,
                                            })
                                        }
                                        placeholder="e.g. LRN031"
                                        required
                                    />
                                </div>
                                <div className="form-group1 span-2">
                                    <label>Content</label>
                                    <textarea
                                        rows={3}
                                        value={createForm.Content}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                Content: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group1">
                                    <label>Rate</label>
                                    <select
                                        value={createForm.Rate}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                Rate: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="5">5 stars</option>
                                        <option value="4">4 stars</option>
                                        <option value="3">3 stars</option>
                                        <option value="2">2 stars</option>
                                        <option value="1">1 star</option>
                                    </select>
                                </div>
                                <div className="form-group1">
                                    <label>Status</label>
                                    <select
                                        value={createForm.FStatus}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                FStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Waiting">Waiting</option>
                                        <option value="Processed">
                                            Processed
                                        </option>
                                    </select>
                                </div>
                                <div className="form-group1 span-2">
                                    <label>Admin reply (optional)</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Your reply..."
                                        value={createForm.AdminReply}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                AdminReply: e.target.value,
                                            })
                                        }
                                    />
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

            {/* ===== Modal: Edit ===== */}
            {openEdit && current && (
                <div
                    className="modal-overlay"
                    onClick={() => setOpenEdit(false)}
                >
                    <div
                        className="modal-profile"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="profile-header-modal">
                            <h2>Edit feedback</h2>
                            <p className="muted">
                                Update the selected feedback
                            </p>
                        </div>

                        <form className="settings-form1" onSubmit={submitEdit}>
                            <div className="form-section1">
                                <div className="form-group1">
                                    <label>FeedbackID</label>
                                    <input
                                        value={current.FeedbackID}
                                        disabled
                                    />
                                </div>
                                <div className="form-group1">
                                    <label>User (AccountID)</label>
                                    <input value={current.AccountID} disabled />
                                </div>
                                <div className="form-group1">
                                    <label>Rate</label>
                                    <select
                                        value={editForm.Rate}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                Rate: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">(none)</option>
                                        <option value="5">5 stars</option>
                                        <option value="4">4 stars</option>
                                        <option value="3">3 stars</option>
                                        <option value="2">2 stars</option>
                                        <option value="1">1 star</option>
                                    </select>
                                </div>
                                <div className="form-group1">
                                    <label>Status</label>
                                    <select
                                        value={editForm.FStatus}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                FStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">(none)</option>
                                        <option value="Processed">
                                            Processed
                                        </option>
                                        <option value="Waiting">Waiting</option>
                                    </select>
                                </div>
                                <div className="form-group1 span-2">
                                    <label>Content</label>
                                    <textarea
                                        rows={3}
                                        value={editForm.Content}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                Content: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-group1 span-2">
                                    <label>Reply to feedback</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Enter your answer here..."
                                        value={editForm.AdminReply}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                AdminReply: e.target.value,
                                            })
                                        }
                                    />
                                    <small className="muted">
                                        Bấm <b>Send reply</b> sẽ đặt trạng thái
                                        thành <b>Processed</b>.
                                    </small>
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
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={sendReply}
                                    disabled={!editForm.AdminReply?.trim()}
                                >
                                    Send reply
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===== Modal: Delete confirm ===== */}
            {openDelete && current && (
                <div
                    className="modal-overlay"
                    onClick={() => setOpenDelete(false)}
                >
                    <div
                        className="modal-profile"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="profile-header-modal">
                            <h2>Delete feedback</h2>
                            <p className="muted">
                                Are you sure you want to delete{" "}
                                <strong>{current.FeedbackID}</strong>?
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
