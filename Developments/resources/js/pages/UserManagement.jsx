import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/UserManagement.css";

const API = "http://127.0.0.1:8000/api";

export default function UserManagement() {
    const navigate = useNavigate();

    // ==== Filters/Search/Paging ====
    const [role, setRole] = useState(""); // Admin/Instructor/Learner
    const [status, setStatus] = useState(""); // Active/Inactive
    const [approval, setApproval] = useState(""); // Approved/Pending/Rejected
    const [query, setQuery] = useState("");

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // ==== Data ====
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    // ==== Modals ====
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [current, setCurrent] = useState(null); // record đang edit/delete

    const headers = useMemo(
        () => ({
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        }),
        []
    );

    // ===== Helpers =====
    const avatarUrl = (r) => {
        // BE có thể trả avatar path (e.g. "avatars/abc.jpg") hoặc url sẵn
        if (r?.avatarUrl || r?.AvatarUrl) return r.avatarUrl || r.AvatarUrl;
        const p = r?.Avatar || r?.avatar || "avatars/avatar.jpg";
        return `${API.replace("/api", "")}/storage/${p}`;
    };

    const fmtDate = (s) => {
        if (!s) return "-";
        const str = String(s).includes(" ")
            ? String(s).replace(" ", "T")
            : String(s);
        const d = new Date(str);
        return isNaN(d.getTime()) ? String(s) : d.toLocaleString();
    };

    const badgeRoleClass = (role) => {
        if (!role) return "pill gray";
        const key = role.toLowerCase();
        if (key === "admin") return "pill admin";
        if (key === "instructor") return "pill instructor";
        if (key === "learner") return "pill learner";
        return "pill gray";
    };

    const badgeStatusClass = (st) => {
        if (!st) return "pill gray";
        return st.toLowerCase() === "active" ? "pill learner" : "pill gray";
    };

    // ===== Fetch list =====
    const fetchAccounts = async (newPage = 1) => {
        setLoading(true);
        try {
            const params = {
                page: newPage,
                per_page: perPage,
            };
            if (query) params.search = query;
            if (role) params.role = role;
            if (status) params.status = status;
            if (approval) params.approval = approval;

            // Ưu tiên backend filter; nếu BE chưa hỗ trợ query params — vẫn trả list, ta sẽ filter client
            const res = await axios.get(`${API}/users`, { params, headers });
            // Kỳ vọng BE trả: { data:[], total, per_page, current_page } hoặc [] đơn thuần
            let data = Array.isArray(res.data)
                ? res.data
                : res.data.data || res.data.items || [];
            let metaTotal = res.data.total ?? data.length;
            let metaPer = res.data.per_page ?? perPage;
            let metaPage = res.data.current_page ?? newPage;

            // Nếu BE không filter theo params, fallback filter client:
            if (Array.isArray(res.data)) {
                data = data.filter((r) => {
                    const byRole = role
                        ? String(r.ARole).toLowerCase() === role.toLowerCase()
                        : true;
                    const byStatus = status
                        ? String(r.AStatus).toLowerCase() ===
                          status.toLowerCase()
                        : true;
                    const byApproval = approval
                        ? String(r.ApprovalStatus).toLowerCase() ===
                          approval.toLowerCase()
                        : true;
                    const byQuery = query
                        ? String(r.AName || "")
                              .toLowerCase()
                              .includes(query.toLowerCase()) ||
                          String(r.Email || "")
                              .toLowerCase()
                              .includes(query.toLowerCase()) ||
                          String(r.AccountID || "")
                              .toLowerCase()
                              .includes(query.toLowerCase())
                        : true;
                    return byRole && byStatus && byApproval && byQuery;
                });
                // client paginate:
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
            alert("Failed to load accounts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [perPage]); // đổi perPage → luôn refresh

    // ====== Create ======
    const [createForm, setCreateForm] = useState({
        AName: "",
        Email: "",
        Pass: "",
        ARole: "Learner",
    });

    const submitCreate = async (e) => {
        e.preventDefault();
        try {
            // Dùng route register bạn đã có
            await axios.post(`${API}/register`, createForm, { headers });
            alert("Created successfully!");
            setOpenCreate(false);
            setCreateForm({ AName: "", Email: "", Pass: "", ARole: "Learner" });
            fetchAccounts(page);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Create failed!");
        }
    };

    // ====== Edit ======
    const [editForm, setEditForm] = useState({
        AName: "",
        Email: "",
        ARole: "",
        AStatus: "",
        ApprovalStatus: "",
    });

    const openEditModal = (row) => {
        setCurrent(row);
        setEditForm({
            AName: row.AName || "",
            Email: row.Email || "",
            ARole: row.ARole || "",
            AStatus: row.AStatus || "",
            ApprovalStatus: row.ApprovalStatus || "",
        });
        setOpenEdit(true);
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        if (!current) return;
        try {
            // Sử dụng /api/users/{id} (theo route list của bạn)
            await axios.put(`${API}/users/${current.AccountID}`, editForm, {
                headers,
            });
            alert("Updated successfully!");
            setOpenEdit(false);
            setCurrent(null);
            fetchAccounts(page);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Update failed!");
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
            await axios.delete(`${API}/users/${current.AccountID}`, {
                headers,
            });
            alert("Deleted successfully!");
            setOpenDelete(false);
            setCurrent(null);
            // nếu xóa bản cuối cùng trang hiện tại → lùi 1 trang
            const lastPage = Math.max(1, Math.ceil((total - 1) / perPage));
            fetchAccounts(Math.min(page, lastPage));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Delete failed!");
        }
    };

    const totalPages = Math.max(1, Math.ceil(total / perPage));

    return (
        <div className="card-section">
            {/* ===== Header ===== */}
            <div className="um-header">
                <div className="um-title">Account Management</div>

                {/* HÀNG 1: Filters + Search cùng 1 hàng */}
                <div className="um-row1">
                    <div className="um-filters">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">-- Filter by Role --</option>
                            <option value="Admin">Admin</option>
                            <option value="Instructor">Instructor</option>
                            <option value="Learner">Learner</option>
                        </select>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">-- Filter by Status --</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>

                        <select
                            value={approval}
                            onChange={(e) => setApproval(e.target.value)}
                        >
                            <option value="">-- Filter by Approval --</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="search-box">
                        <input
                            placeholder="Search by name/email/account id…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && fetchAccounts(1)
                            }
                        />
                        <button
                            className="btn sm"
                            onClick={() => fetchAccounts(1)}
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* HÀNG 2: Add new (left) — Back (right) */}
                <div className="um-row2">
                    <button className="btn" onClick={() => setOpenCreate(true)}>
                        + Add new account
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
                            <th>Avatar</th>
                            <th>AccountID</th>
                            <th>Full name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Approval</th>
                            <th>Date created</th>
                            <th style={{ width: 140 }} className="center">
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
                            rows.map((r, idx) => (
                                <tr key={r.AccountID || idx}>
                                    <td>{(page - 1) * perPage + idx + 1}</td>
                                    <td>
                                        <img src={avatarUrl(r)} alt="avatar" />
                                    </td>
                                    <td className="muted">{r.AccountID}</td>
                                    <td>{r.AName}</td>
                                    <td>{r.Email}</td>
                                    <td>
                                        <span
                                            className={badgeRoleClass(r.ARole)}
                                        >
                                            {r.ARole}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={badgeStatusClass(
                                                r.AStatus
                                            )}
                                        >
                                            {r.AStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="pill gray">
                                            {r.ApprovalStatus || "-"}
                                        </span>
                                    </td>
                                    <td className="muted">
                                        {fmtDate(r.CreatedAt || r.created_at)}
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
                    onClick={() => fetchAccounts(page - 1)}
                >
                    ← Prev
                </button>

                <span className="muted">
                    Page {page} / {totalPages}
                </span>

                <button
                    className="btn sm ghost"
                    disabled={page >= totalPages || loading}
                    onClick={() => fetchAccounts(page + 1)}
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
                            <h2>Create new account</h2>
                            <p className="muted">
                                Use this form to add a new user
                            </p>
                        </div>

                        <form className="settings-form" onSubmit={submitCreate}>
                            <div className="form-section">
                                <div className="form-group">
                                    <label>Full name</label>
                                    <input
                                        value={createForm.AName}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                AName: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={createForm.Email}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                Email: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        value={createForm.Pass}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                Pass: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select
                                        value={createForm.ARole}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                ARole: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Learner">Learner</option>
                                        <option value="Instructor">
                                            Instructor
                                        </option>
                                        <option value="Admin">Admin</option>
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
                            <h2>Edit account</h2>
                            <p className="muted">Update the selected user</p>
                        </div>

                        <form className="settings-form" onSubmit={submitEdit}>
                            <div className="form-section">
                                <div className="form-group">
                                    <label>Full name</label>
                                    <input
                                        value={editForm.AName}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                AName: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={editForm.Email}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                Email: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select
                                        value={editForm.ARole}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                ARole: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Learner">Learner</option>
                                        <option value="Instructor">
                                            Instructor
                                        </option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={editForm.AStatus}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                AStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">(none)</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Approval</label>
                                    <select
                                        value={editForm.ApprovalStatus}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                ApprovalStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">(none)</option>
                                        <option value="Approved">
                                            Approved
                                        </option>
                                        <option value="Pending">Pending</option>
                                        <option value="Rejected">
                                            Rejected
                                        </option>
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
                            <h2>Delete account</h2>
                            <p className="muted">
                                Are you sure you want to delete{" "}
                                <strong>{current?.AName}</strong> (
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
